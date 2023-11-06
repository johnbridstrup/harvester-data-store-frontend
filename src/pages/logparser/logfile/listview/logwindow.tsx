import { useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import { VirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/app/hooks";
import {
  ActionTypesEnum,
  Content,
  LogFile,
  LogSession,
  Service,
} from "@/features/logparser/logparserTypes";
import logparserService, {
  LOGFILES_URL,
} from "@/features/logparser/logparserService";
import MainLayout from "@/components/layout/main";
import TabWindowServices from "@/components/logparser/logfile/TabWindowServices";
import LogSearchWindow from "@/components/logparser/logfile/LogSearchWindow";
import { Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import { findLogIndex, logFilter, sortServices } from "@/utils/utils";
import "./styles.css";

interface Search {
  searchText: string | null;
  content: Array<Content>;
  currentIndex: number | null;
  countIndex: number;
}

interface Internal {
  services: Array<Service>;
  search: Search;
}

interface ComponentState {
  fetching: boolean;
  serviceActiveTab: string;
  logsession: LogSession | null;
  logfile: LogFile | null;
  oglogfile: LogFile | null;
  currentMarker: number | null;
  currentIndex: number | null;
  internal: Internal;
}

interface ActionPayload {
  type: string;
  payload: any;
}

const componentState: ComponentState = {
  fetching: false,
  serviceActiveTab: "",
  logsession: null,
  logfile: null,
  oglogfile: null,
  currentMarker: null,
  currentIndex: null,
  internal: {
    search: {
      searchText: null,
      content: [],
      currentIndex: null,
      countIndex: 0,
    },
    services: [],
  },
};

function reducer(state: ComponentState, action: ActionPayload) {
  switch (action.type) {
    case ActionTypesEnum.ON_DATA_REQUEST:
      return {
        ...state,
        fetching: action.payload,
      };
    case ActionTypesEnum.ON_INITIAL_LOAD:
      const { logfile, logsession } = action.payload;
      return {
        ...state,
        logsession: logsession,
        logfile: logfile,
        oglogfile: logfile,
        internal: {
          ...state.internal,
          services: sortServices(logsession?.logs?.services || []),
        },
      };
    case ActionTypesEnum.ON_SERVICE_TAB_CHANGE:
      return {
        ...state,
        serviceActiveTab: action.payload,
      };
    case ActionTypesEnum.ON_LOGFILE_GET_REQ:
      return {
        ...state,
        logfile: action.payload,
        oglogfile: action.payload,
      };
    case ActionTypesEnum.ON_SET_CURR_INDEX:
      return {
        ...state,
        currentIndex: action.payload,
      };
    case ActionTypesEnum.ON_TAB_CHANGE_SEARCH:
      let searchText = state.internal.search.searchText;
      if (searchText) {
        let filtered = logFilter(searchText, state.oglogfile?.content);
        if (state.oglogfile?.file_name.endsWith(".dump")) {
          return {
            ...state,
            logfile: {
              ...state.logfile,
              content: filtered,
            },
          };
        } else {
          return {
            ...state,
            internal: {
              ...state.internal,
              search: {
                ...state.internal.search,
                countIndex: 0,
                content: filtered,
              },
            },
          };
        }
      } else {
        return {
          ...state,
          internal: {
            ...state.internal,
            search: {
              ...state.internal.search,
              countIndex: 0,
              content: [],
            },
          },
        };
      }
    case ActionTypesEnum.ON_SET_MARKER:
      let payload = action.payload;
      return {
        ...state,
        currentMarker: payload.log.timestamp,
        currentIndex: payload.index,
      };
    case ActionTypesEnum.ON_CLEAR_MARKER:
      return {
        ...state,
        currentMarker: null,
      };
    case ActionTypesEnum.ON_CLEAR_SEARCH:
      return {
        ...state,
        internal: {
          ...state.internal,
          search: {
            ...state.internal.search,
            searchText: null,
            currentIndex: null,
            countIndex: 0,
            content: [],
          },
        },
        logfile: {
          ...state.oglogfile,
        },
      };
    case ActionTypesEnum.ON_LOG_SEARCH:
      if (action.payload) {
        let filtered = logFilter(action.payload, state.oglogfile?.content);
        if (state.oglogfile?.file_name.endsWith(".dump")) {
          let logObj = JSON.parse(JSON.stringify(state.logfile));
          logObj.content = filtered;
          return {
            ...state,
            internal: {
              ...state.internal,
              search: {
                ...state.internal.search,
                searchText: action.payload,
                currentIndex: 0,
                countIndex: 0,
                content: filtered,
              },
            },
            currentIndex: 0,
            logfile: logObj,
          };
        } else {
          let objIndex = findLogIndex(state.oglogfile?.content, filtered[0]);
          return {
            ...state,
            internal: {
              ...state.internal,
              search: {
                ...state.internal.search,
                searchText: action.payload,
                currentIndex: objIndex,
                countIndex: 0,
                content: filtered,
              },
            },
            currentIndex: objIndex,
          };
        }
      } else {
        return {
          ...state,
          internal: {
            ...state.internal,
            search: {
              ...state.internal.search,
              currentIndex: null,
              countIndex: 0,
              content: [],
            },
          },
        };
      }
    case ActionTypesEnum.ON_SCROLL_INDEX:
      let direction = action.payload;
      let current: number = 0;
      if (direction === "up") {
        current = state.internal.search.countIndex - 1;
      } else if (direction === "down") {
        current = state.internal.search.countIndex + 1;
      }
      if (
        state.internal.search.searchText &&
        state.internal.search.content[current]
      ) {
        if (state.oglogfile?.file_name.endsWith(".dump")) {
          return {
            ...state,
            internal: {
              ...state.internal,
              search: {
                ...state.internal.search,
                currentIndex: current,
                countIndex: current,
              },
            },
            currentIndex: current,
          };
        } else {
          let obj = state.internal.search.content[current];
          let objIndex = findLogIndex(state.oglogfile?.content, obj);
          return {
            ...state,
            internal: {
              ...state.internal,
              search: {
                ...state.internal.search,
                currentIndex: objIndex,
                countIndex: current,
              },
            },
            currentIndex: objIndex,
          };
        }
      } else {
        return state;
      }
    default:
      return state;
  }
}

function LogWindowView() {
  const [state, dispatchAction] = useReducer(reducer, componentState);
  const { token } = useAppSelector((state) => state.auth);
  const virtuoso = useRef<VirtuosoHandle | null>(null);
  const { sessionId } = useParams();

  useEffect(() => {
    (async () => {
      dispatchAction({ type: ActionTypesEnum.ON_DATA_REQUEST, payload: true });
      const res = await logparserService.get(Number(sessionId), String(token));
      let logId = res.logs?.services[0]?.id;
      const log = await logparserService.factoryGet(
        LOGFILES_URL,
        logId,
        String(token),
      );
      dispatchAction({
        type: ActionTypesEnum.ON_INITIAL_LOAD,
        payload: {
          logsession: res,
          logfile: log,
        },
      });
      dispatchAction({ type: ActionTypesEnum.ON_DATA_REQUEST, payload: false });
    })();
  }, [dispatchAction, sessionId]);

  return (
    <MainLayout>
      <div className="container">
        {state.fetching ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <>
            <LogSearchWindow
              dispatchAction={dispatchAction}
              virtuoso={virtuoso}
              internal={state.internal}
            />
            <TabWindowServices
              state={state}
              dispatchAction={dispatchAction}
              virtuoso={virtuoso}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default LogWindowView;

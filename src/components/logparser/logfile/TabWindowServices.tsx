import { MutableRefObject, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/app/hooks";
import { THEME_MODES } from "@/features/base/constants";
import {
  ActionTypesEnum,
  Content,
  LogFile,
  Service,
} from "@/features/logparser/logparserTypes";
import logparserService, {
  LOGFILES_URL,
} from "@/features/logparser/logparserService";
import { NavTabItem, NavTabs, NavTabSpan } from "@/components/styled";
import { darkThemeClass, getCurrIndex } from "@/utils/utils";
import { LogHighlighter } from "../helpers";

interface TabProps {
  dispatchAction: any;
  virtuoso: MutableRefObject<VirtuosoHandle | null>;
  state: {
    logfile: LogFile | null;
    currentMarker: number | null;
    currentIndex: number | null;
    serviceActiveTab: string;
    internal: { services: Array<Service> };
  };
}

function TabWindowServices(props: TabProps) {
  const [fetching, setFetching] = useState(false);
  const {
    logfile,
    currentMarker,
    currentIndex,
    serviceActiveTab,
    internal: { services },
  } = props.state;
  const { token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);

  const content = logfile?.content || [];

  const handleTabChange = async (tabObj: Service) => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_SERVICE_TAB_CHANGE,
      payload: `${tabObj.service}.${tabObj.robot}`,
    });
    setFetching(true);
    const res = await logparserService.factoryGet(
      LOGFILES_URL,
      tabObj.id,
      String(token),
    );
    setFetching(false);
    let currentIndex = await getCurrIndex(currentMarker as number, res);
    props.dispatchAction({
      type: ActionTypesEnum.ON_LOGFILE_GET_REQ,
      payload: res,
    });
    props.dispatchAction({
      type: ActionTypesEnum.ON_SET_CURR_INDEX,
      payload: currentIndex,
    });
    props.dispatchAction({
      type: ActionTypesEnum.ON_TAB_CHANGE_SEARCH,
    });
    setTimeout(() => {
      props.virtuoso?.current?.scrollToIndex({
        index: currentIndex,
        align: "start",
        behavior: "auto",
      });
    }, 100);
  };

  const handleLineClick = async (index: number, log: Content) => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_SET_MARKER,
      payload: { index, log },
    });
  };

  const clearSelection = () => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_CLEAR_MARKER,
    });
  };

  const markedBackground = (index: number) => {
    return currentIndex === index && theme === THEME_MODES.DARK_THEME
      ? "marked-dark-bg"
      : currentIndex === index
      ? "marked-bg"
      : "";
  };
  const bg = darkThemeClass("bg-hover", theme);

  return (
    <div>
      {currentMarker && (
        <div className="current-marker">
          <span>
            current selection at time: {currentMarker} index: {currentIndex}
          </span>{" "}
          <span className="cursor">
            <i onClick={clearSelection} className="las la-times"></i>
          </span>
        </div>
      )}
      <NavTabs>
        {services.map((x, i) => (
          <NavTabItem key={i}>
            <NavTabSpan
              activetab={serviceActiveTab}
              navto={`${x.display}`}
              onClick={() => handleTabChange(x)}
              theme={theme as string}
              robocolor=""
            >
              {`${x.display}`}
            </NavTabSpan>
          </NavTabItem>
        ))}
      </NavTabs>
      <div className="tab-content">
        {fetching ? (
          <div className="loading">Loading...</div>
        ) : (
          <Virtuoso
            data={content}
            ref={props.virtuoso}
            itemContent={(index: number, log: Content) => {
              return (
                <LogHighlighter
                  key={index}
                  handleClick={handleLineClick}
                  className={`content ${bg} ${markedBackground(index)}`}
                  log={log}
                  logIndex={index}
                />
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

export default TabWindowServices;

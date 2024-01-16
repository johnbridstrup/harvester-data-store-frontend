import { MutableRefObject, useState, useEffect, ChangeEvent } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/app/hooks";
import { LOGSCHANNEL, THEME_MODES } from "@/features/base/constants";
import {
  ActionTypesEnum,
  Content,
  EventPayload,
  LogFile,
  Service,
} from "@/features/logparser/logparserTypes";
import logparserService, {
  LOGFILES_URL,
} from "@/features/logparser/logparserService";
import { NavTabItem, NavTabs, NavTabSpan } from "@/components/styled";
import { darkThemeClass, getCurrIndex } from "@/utils/utils";
import { CurrentMarker, LogHighlighter } from "../helpers";

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
  const [timestamp, setTimestamp] = useState<number>();
  const {
    logfile,
    currentMarker,
    currentIndex,
    serviceActiveTab,
    internal: { services },
  } = props.state;
  const { token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);
  const bc = new BroadcastChannel(LOGSCHANNEL);
  const content = logfile?.content || [];

  const broadcastListener = async (ts: number): Promise<void> => {
    let currentIndex = await getCurrIndex(ts, logfile as LogFile);
    props.dispatchAction({
      type: ActionTypesEnum.ON_SET_MARKER,
      payload: { index: currentIndex, log: { timestamp: ts } },
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

  useEffect(() => {
    const bc = new BroadcastChannel(LOGSCHANNEL);
    bc.onmessage = (event: MessageEvent<any>) => {
      const data: EventPayload = event.data;
      if (data.main?.ts) {
        broadcastListener(data.main.ts);
      }
      if (data.other?.ts) {
        broadcastListener(data.other.ts);
      }
    };
    return () => {
      bc.close();
    };
  }, [props.virtuoso, broadcastListener]);

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
    let currentIndex = await getCurrIndex(Number(currentMarker), res);
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
    bc.postMessage({
      child: { ts: currentMarker },
      other: { ts: currentMarker },
    });
  };

  const handleLineClick = async (index: number, log: Content) => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_SET_MARKER,
      payload: { index, log },
    });
    bc.postMessage({
      child: { ts: log.timestamp },
      other: { ts: log.timestamp },
    });
    setTimestamp(log.timestamp);
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

  const handleTsChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTimestamp(event.target.value as unknown as number);
  };

  const handleKeyDown = async (event: KeyboardEvent): Promise<void> => {
    if (event.key === "Enter") {
      let currentIndex = await getCurrIndex(
        timestamp as number,
        logfile as LogFile,
      );
      props.dispatchAction({
        type: ActionTypesEnum.ON_SET_MARKER,
        payload: { currentIndex, log: { timestamp: Number(timestamp) } },
      });
      props.dispatchAction({
        type: ActionTypesEnum.ON_SET_CURR_INDEX,
        payload: currentIndex,
      });
      setTimeout(() => {
        props.virtuoso?.current?.scrollToIndex({
          index: currentIndex,
          align: "start",
          behavior: "auto",
        });
      }, 100);
    }
  };

  const bg = darkThemeClass("bg-hover", theme);

  return (
    <div>
      {currentMarker && (
        <CurrentMarker
          timestamp={timestamp}
          currentIndex={currentIndex}
          handleTsChange={handleTsChange}
          handleKeyDown={handleKeyDown}
          clearSelection={clearSelection}
          theme={theme as string}
        />
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

import {
  MutableRefObject,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  clearMarker,
  getLogFile,
  setCurrIndex,
  setMarker,
  tabChangeSearch,
} from "@/features/logparser/logparserSlice";
import {
  FULLFILLED_PROMISE,
  LOGSCHANNEL,
  THEME_MODES,
} from "@/features/base/constants";
import { darkThemeClass, getCurrIndex } from "@/utils/utils";
import { NavTabItem, NavTabs, NavTabSpan } from "@/components/styled";
import { CurrentMarker, LogHighlighter } from "../helpers";
import {
  ActionTypesEnum,
  Content,
  EventPayload,
  LogFile,
  Service,
} from "@/features/logparser/logparserTypes";

interface TabProps {
  dispatchAction: any;
  activeTab: string;
  virtuoso: MutableRefObject<VirtuosoHandle | null>;
  videoRef?: any;
}

function TabbedServices(props: TabProps) {
  const [fetching, setFetching] = useState(false);
  const [timestamp, setTimestamp] = useState<number>();
  const {
    logfile,
    currentMarker,
    currentIndex,
    logvideo,
    internal: { services },
  } = useAppSelector((state) => state.logparser);
  const { theme } = useAppSelector((state) => state.home);
  const bc = new BroadcastChannel(LOGSCHANNEL);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const content = logfile?.content || [];

  const broadcastListener = async (ts: number): Promise<void> => {
    let currentIndex = await getCurrIndex(ts, logfile as LogFile);
    dispatch(setMarker({ index: currentIndex, log: { timestamp: ts } }));
    dispatch(tabChangeSearch());
    setTimeout(() => {
      props.virtuoso?.current?.scrollToIndex({
        index: currentIndex,
        align: "start",
        behavior: "auto",
      });
    }, 100);
    if (logvideo?.meta?.length && logvideo.meta[0]) {
      let wholeSeconds = Math.floor(ts - logvideo.meta[0].ts);
      if (wholeSeconds < 0) {
        wholeSeconds = 0;
      }
      await seekToSeconds(wholeSeconds);
    }
  };

  useEffect(() => {
    const bc = new BroadcastChannel(LOGSCHANNEL);
    bc.onmessage = (event: MessageEvent<any>) => {
      const data: EventPayload = event.data;
      if (data.child?.ts) {
        broadcastListener(data.child.ts);
      }
    };
    return () => {
      bc.close();
    };
  }, [props.virtuoso, broadcastListener]);

  const serviceCallback = useCallback(async () => {
    if (search) {
      const urlparams = new URLSearchParams(search);
      let service = urlparams.get("service") as string;
      let robot = Number(urlparams.get("robot"));
      let ts = Number(urlparams.get("ts"));
      const serviceObj = services.find(
        (x) => x.service === service && x.robot === robot,
      );
      if (serviceObj) {
        props.dispatchAction({
          type: ActionTypesEnum.ON_SERVICE_TAB_CHANGE,
          payload: `${serviceObj.service}.${serviceObj.robot}`,
        });
        const res = await dispatch(getLogFile(serviceObj.id));
        if (res.type == FULLFILLED_PROMISE.logfile) {
          let currentIndex = await getCurrIndex(ts, res.payload);
          setTimestamp(ts);
          dispatch(setMarker({ index: currentIndex, log: { timestamp: ts } }));
          props.virtuoso?.current?.scrollToIndex({
            index: currentIndex,
            align: "start",
            behavior: "auto",
          });
        }
      }
    }
  }, [search]);

  useEffect(() => {
    // there is a race condition with the parent
    // request in getting a logfile.
    // we need to a delay of 1 second to make this call
    setTimeout(() => serviceCallback(), 1000);
  }, [serviceCallback]);

  const handleTabChange = async (tabObj: Service) => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_SERVICE_TAB_CHANGE,
      payload: `${tabObj.service}.${tabObj.robot}`,
    });
    setFetching(true);
    const res = await dispatch(getLogFile(tabObj.id));
    setFetching(false);
    let currentIndex = await getCurrIndex(currentMarker as number, res.payload);
    dispatch(setCurrIndex(currentIndex));
    dispatch(tabChangeSearch());
    setTimeout(() => {
      props.virtuoso?.current?.scrollToIndex({
        index: currentIndex,
        align: "start",
        behavior: "auto",
      });
    }, 100);
    bc.postMessage({ main: { ts: currentMarker } });
  };

  const seekToSeconds = (seconds: number) => {
    return new Promise((resolve, _) => {
      props.videoRef?.current?.seekTo(seconds, "seconds");
      resolve(seconds);
    });
  };

  const handleLineClick = async (index: number, log: Content) => {
    dispatch(setMarker({ index, log }));
    if (logvideo?.meta?.length && logvideo.meta[0]) {
      let wholeSeconds = Math.floor(log.timestamp - logvideo.meta[0].ts);
      if (wholeSeconds < 0) {
        wholeSeconds = 0;
      }
      await seekToSeconds(wholeSeconds);
    }
    bc.postMessage({ main: { ts: log.timestamp } });
    setTimestamp(log.timestamp);
  };

  const clearSelection = () => {
    dispatch(clearMarker());
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
      dispatch(
        setMarker({ currentIndex, log: { timestamp: Number(timestamp) } }),
      );
      dispatch(setCurrIndex(currentIndex));
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
              activetab={props.activeTab}
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

export default TabbedServices;

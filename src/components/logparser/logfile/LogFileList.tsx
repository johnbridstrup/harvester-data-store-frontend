import { useReducer, useRef } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { VirtuosoHandle } from "react-virtuoso";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  queryLogVideo,
  setCurrIndex,
} from "@/features/logparser/logparserSlice";
import { LogFile } from "@/features/logparser/logparserTypes";
import { getCurrIndex, imagePath } from "@/utils/utils";
import { NavTabItem, NavTabs, NavTabSpan } from "@/components/styled";
import LoadVideo from "./LoadVideo";
import LogSearch from "./LogSearch";
import TabbedServices from "./TabbedServices";

interface ComponentState {
  videoActiveTab: string;
  serviceActiveTab: string;
  playbackRate: number;
}

interface ActionPayload {
  type: string;
  payload: any;
}

const componentState: ComponentState = {
  videoActiveTab: "",
  serviceActiveTab: "",
  playbackRate: 1,
};

function reducer(state: ComponentState, action: ActionPayload) {
  switch (action.type) {
    case "ON_VIDEO_TAB_CHANGE":
      return {
        ...state,
        videoActiveTab: action.payload,
      };
    case "ON_SERVICE_TAB_CHANGE":
      return {
        ...state,
        serviceActiveTab: action.payload,
      };
    case "ON_PLAY_BACK_RATE":
      return {
        ...state,
        playbackRate: action.payload,
      };
    default:
      return state;
  }
}

function LogFileList() {
  const [state, dispatchAction] = useReducer(reducer, componentState);
  const {
    internal: { videos },
    logvideo,
    logfile,
    logsession,
  } = useAppSelector((state) => state.logparser);
  const { theme } = useAppSelector((state) => state.home);
  const videoRef = useRef<any>(null);
  const virtuoso = useRef<VirtuosoHandle | null>(null);
  const dispatch = useAppDispatch();

  const handleVideoTabChange = async (tab: string) => {
    dispatchAction({ type: "ON_VIDEO_TAB_CHANGE", payload: tab });
    let queryObj = {
      category: tab,
      log_session_id: logsession?.id,
    };
    await dispatch(queryLogVideo(queryObj));
  };

  const handleOnProgress = async (state: OnProgressProps) => {
    let playedSeconds = Math.floor(state.playedSeconds);
    if (logvideo?.meta?.length && logvideo?.meta[0]) {
      let metaTimestamp = logvideo.meta[0].ts + playedSeconds;
      let currentIndex = await getCurrIndex(metaTimestamp, logfile as LogFile);
      dispatch(setCurrIndex(currentIndex));
      virtuoso.current?.scrollToIndex({
        index: currentIndex,
        align: "start",
        behavior: "auto",
      });
    }
  };

  const playbackRate = state.playbackRate === 0 ? 0.5 : state.playbackRate;

  return (
    <div>
      <LogSearch
        rate={state.playbackRate}
        dispatchAction={dispatchAction}
        virtuoso={virtuoso}
      />
      <div className="row mb-4">
        <div className="col-md-6">
          <LoadVideo category={state.videoActiveTab} />
          <div className="row">
            <div className="col">
              <div style={{ height: "400px" }}>
                <NavTabs>
                  {videos.map((vid, _) => (
                    <NavTabItem key={vid.id}>
                      <NavTabSpan
                        activetab={state.videoActiveTab}
                        navto={vid.category}
                        onClick={() => handleVideoTabChange(vid.category)}
                        theme={theme as string}
                        robocolor=""
                      >
                        {vid.category.toUpperCase()}
                      </NavTabSpan>
                    </NavTabItem>
                  ))}
                </NavTabs>
                {logvideo?.video_avi ? (
                  <div className="p-top">
                    <div className="embed-responsive embed-responsive-16by9">
                      <ReactPlayer
                        controls
                        config={{ file: { forceVideo: true } }}
                        url={logvideo?.video_avi}
                        width="100%"
                        height="320px"
                        ref={videoRef}
                        playbackRate={playbackRate}
                        onProgress={(state) => {
                          handleOnProgress(state);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="no-video p-top">
                    <img
                      className="img-unvailable"
                      src={imagePath("novideo")}
                      alt="novideo"
                    />
                    <p>Video Unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div style={{ height: "400px" }}>
                <NavTabs>
                  <NavTabItem>
                    <NavTabSpan
                      activetab={"Table"}
                      navto={"Table"}
                      theme={theme as string}
                      robocolor=""
                    >
                      Table
                    </NavTabSpan>
                  </NavTabItem>
                  <NavTabItem>
                    <NavTabSpan
                      activetab={"Gripper Plot"}
                      navto={"Gripper Plot"}
                      theme={theme as string}
                      robocolor=""
                    >
                      Gripper Plot
                    </NavTabSpan>
                  </NavTabItem>
                </NavTabs>
                <div className="in-progress p-top">
                  <img
                    className="img-unvailable"
                    src={imagePath("inprogress")}
                    alt="inprogress"
                  />
                  <p>Feature currently unavailable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <TabbedServices
            activeTab={state.serviceActiveTab}
            dispatchAction={dispatchAction}
            virtuoso={virtuoso}
            videoRef={videoRef}
          />
        </div>
      </div>
    </div>
  );
}

export default LogFileList;

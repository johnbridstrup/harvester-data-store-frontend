import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  getLogFile,
  getLogSession,
  queryLogVideo,
} from "@/features/logparser/logparserSlice";
import MainLayout from "@/components/layout/main";
import LogFileList from "@/components/logparser/logfile/LogFileList";
import LogWithoutVideo from "@/components/logparser/logfile/LogWithoutVideo";
import { Header, Loader } from "@/components/common";
import { LogSwitch } from "@/components/logparser/helpers";
import { LoaderDiv } from "@/components/styled";
import "./styles.css";

function LogFileListView() {
  const [fetching, setFetching] = useState(false);
  const [logView, setLogView] = useState(false);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { sessionId } = useParams();

  useEffect(() => {
    (async () => {
      setFetching(true);
      const res = await dispatch(getLogSession(Number(sessionId)));
      let logId = res.payload?.logs?.services[0]?.id;
      await dispatch(getLogFile(logId));
      await dispatch(queryLogVideo({ log_session_id: sessionId }));
      setFetching(false);
    })();
  }, [dispatch, sessionId]);

  const toggleLogView = (): void => setLogView(!logView);

  return (
    <MainLayout>
      <div className="container-fluid">
        <Header className={"display-4"} title={"Extracted Log Files"} />
        <LogSwitch
          logView={logView}
          theme={theme as string}
          toggleLogView={toggleLogView}
          id={Number(sessionId)}
        />
        {fetching ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <>{logView ? <LogFileList /> : <LogWithoutVideo />}</>
        )}
      </div>
    </MainLayout>
  );
}

export default LogFileListView;

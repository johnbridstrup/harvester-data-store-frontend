import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { BackButton, Loader } from "@/components/common";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import LogSessionDetail from "@/components/logparser/logsession/LogSessionDetail";
import { LoaderDiv } from "@/components/styled";
import { getLogSession } from "@/features/logparser/logparserSlice";
import "./styles.css";

function LogSessionDetailView() {
  const { loading } = useAppSelector((state) => state.logparser);
  const { theme } = useAppSelector((state) => state.home);
  const { sessionId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLogSession(Number(sessionId)));
  }, [dispatch, sessionId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS LogSession"}
          id={sessionId}
          className={"display-4 mb-4"}
        />
        <BackButton theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <LogSessionDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default LogSessionDetailView;

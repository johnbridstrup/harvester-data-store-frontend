import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import { queryExceptionCode } from "@/features/exception/exceptionSlice";
import {
  queryFruit,
  queryHarvester,
} from "@/features/harvester/harvesterSlice";
import { queryLocation } from "@/features/location/locationSlice";
import { MAX_LIMIT } from "@/features/base/constants";
import "./styles.css";

function TracebackBreakdownView() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryHarvester({ limit: MAX_LIMIT })),
        dispatch(queryLocation({ limit: MAX_LIMIT })),
        dispatch(queryFruit({ limit: MAX_LIMIT })),
        dispatch(queryExceptionCode({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title="Traceback Breakdown" className={"display-6 mt-4 mb-4"} />
      </div>
    </MainLayout>
  );
}

export default TracebackBreakdownView;

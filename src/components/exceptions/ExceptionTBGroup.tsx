import { useAppSelector } from "@/app/hooks";
import { createBarData } from "@/utils/utils";
import TracebackPlot from "../plotly/TracebackPlot";
import { Breakdown } from "@/features/exception/exceptionTypes";

function ExceptionTBGroup() {
  const { tracebackbreakdown } = useAppSelector((state) => state.exception);
  const { theme } = useAppSelector((state) => state.home);
  const [keys, counts] = createBarData(
    tracebackbreakdown?.breakdown as Breakdown,
  );

  return <TracebackPlot keys={keys} counts={counts} theme={theme as string} />;
}

export default ExceptionTBGroup;

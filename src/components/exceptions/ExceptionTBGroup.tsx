import { useState, useRef } from "react";
import VSCodeEditor from "@monaco-editor/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { BreakdownItem } from "@/features/exception/exceptionTypes";
import { THEME_MODES } from "@/features/base/constants";
import exceptionService from "@/features/exception/exceptionService";
import { cacheException } from "@/features/exception/exceptionSlice";
import { monacoOptions } from "@/utils/utils";
import TracebackPlot from "../plotly/TracebackPlot";
import { LoaderDiv } from "../styled";
import { Loader } from "../common";

function ExceptionTBGroup() {
  const [fetching, setFetching] = useState<boolean>(false);
  const {
    tracebackbreakdown,
    internal: { breakdown, counts, exception, keys, tracebackIndex },
  } = useAppSelector((state) => state.exception);
  const { theme } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);

  const getAndSetException = async (
    id: number,
    index: number,
    xvalue?: string,
  ) => {
    setFetching(true);
    const res = await exceptionService.get(id, token as string);
    dispatch(cacheException({ exception: res, index, xvalue }));
    setFetching(false);
  };

  const handleBarClick = async (event: Readonly<Plotly.PlotMouseEvent>) => {
    let xvalue: string = String(event.points[0].x);
    let breakdown: BreakdownItem = tracebackbreakdown?.breakdown[
      xvalue as keyof BreakdownItem
    ] as BreakdownItem;
    if (breakdown.instances[0]) {
      getAndSetException(breakdown.instances[0].id, 0, xvalue);
    }
    navRef.current?.scrollIntoView({ block: "center" });
  };

  const handleNext = async () => {
    let index: number = tracebackIndex + 1;
    if (breakdown?.instances[index]) {
      getAndSetException(breakdown?.instances[index].id, index);
    }
  };
  const handlePrevious = async () => {
    let index: number = tracebackIndex - 1;
    if (breakdown?.instances[index]) {
      getAndSetException(breakdown?.instances[index].id, index);
    }
  };

  return (
    <>
      <TracebackPlot
        keys={keys}
        counts={counts}
        theme={theme as string}
        handleBarClick={handleBarClick}
      />
      {fetching ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <>
          {breakdown && exception && (
            <>
              <VSCodeEditor
                height="50vh"
                language="python"
                value={JSON.stringify(exception.traceback, null, 4)}
                theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
                options={{ ...monacoOptions, readOnly: true } as any}
              />

              <div className="tb-pagination mt-3 mb-5">
                <button
                  onClick={handlePrevious}
                  className={`btn btn-sm btn-primary`}
                >
                  <i className="las la-chevron-circle-left la-2x"></i>
                </button>
                <span className="mx-2">
                  {tracebackIndex + 1}/{breakdown.instances.length}
                </span>
                <button
                  onClick={handleNext}
                  className={`btn btn-sm btn-primary`}
                >
                  <i className="las la-chevron-circle-right la-2x"></i>
                </button>
              </div>
            </>
          )}
          <div ref={navRef}></div>
        </>
      )}
    </>
  );
}

export default ExceptionTBGroup;

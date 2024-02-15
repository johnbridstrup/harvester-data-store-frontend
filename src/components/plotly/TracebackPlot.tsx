import Plotly from "react-plotly.js";
import { useMediaQuery } from "react-responsive";

interface TracebackProps {
  keys: string[];
  counts: number[];
  theme: string;
  handleBarClick: (event: Plotly.PlotMouseEvent) => void;
}

function TracebackPlot(props: TracebackProps) {
  const { theme, keys, counts, handleBarClick } = props;
  const paper_bgcolor = theme === "dark" ? "#343434" : "#fff";
  const plot_bgcolor = theme === "dark" ? "#343434" : "#fff";
  const color = theme === "dark" ? "#fff" : "#444";
  const lg = useMediaQuery({
    query: `(min-width: 1170px)`,
  });
  const md = useMediaQuery({
    query: `(min-width: 850px)`,
  });
  const width = lg ? 1080 : md ? 700 : 400;

  const layout = {
    title: "Traceback Breakdown",
    showlegend: false,
    autosize: false,
    width: width,
    height: 400,
    xaxis: {
      type: "category",
      automargin: true,
    },
    paper_bgcolor: paper_bgcolor,
    plot_bgcolor: plot_bgcolor,
    font: {
      color: color,
    },
  };

  const data: Plotly.Data[] = [
    {
      y: counts,
      x: keys,
      type: "bar",
      marker: {
        color: "rgb(142,124,195)",
      },
    },
  ];

  return (
    <>
      {keys.length ? (
        <Plotly data={data} layout={layout as any} onClick={handleBarClick} />
      ) : (
        <div className="non-cluster">
          <span>Query the data to see available traceback cluster groups</span>
        </div>
      )}
    </>
  );
}

export default TracebackPlot;

import Plotly from "react-plotly.js";
import { useMediaQuery } from "react-responsive";
import { TraceObj } from "@/features/emulatorstat/emulatorstatTypes";

interface ChartProps {
  theme: string;
  title: string;
  ylabel: string;
  traces: Array<TraceObj>;
}

function WeeklyEmustatPlot({ theme, traces, title, ylabel }: ChartProps) {
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
    title: title,
    showlegend: true,
    legend: {
      title: {
        text: "Week",
      },
    },
    autosize: false,
    width: width,
    height: 400,
    xaxis: {
      title: "scene",
    },
    yaxis: {
      title: ylabel,
    },
    paper_bgcolor: paper_bgcolor,
    plot_bgcolor: plot_bgcolor,
    font: {
      color: color,
    },
  };

  return <Plotly data={traces as any} layout={layout} />;
}

export default WeeklyEmustatPlot;

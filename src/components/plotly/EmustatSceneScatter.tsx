import Plotly from "react-plotly.js";
import { useMediaQuery } from "react-responsive";
import { SeriesTrace } from "@/features/emulatorstat/emulatorstatTypes";

interface ChartProps {
  traces: Array<SeriesTrace>;
  ylabel: string;
  xlabel: string;
  title: string;
  theme: string;
}

function EmustatSceneScatter({ traces, ylabel, title, theme }: ChartProps) {
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
        text: "HostName",
      },
    },
    autosize: false,
    width: width,
    height: 400,
    xaxis: {
      title: "report time",
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

export default EmustatSceneScatter;

import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { TraceObj } from "@/features/emulatorstat/emulatorstatTypes";
import WeeklyEmustatPlot from "@/components/plotly/WeeklyEmustatPlot";
import { NavTabItem, NavTabSpan, NavTabs } from "@/components/styled";

interface ChartProps {
  gripSuccessPercent: Array<TraceObj>;
  pickSuccessPercent: Array<TraceObj>;
  picksPerHour: Array<TraceObj>;
  thoroughnessPercent: Array<TraceObj>;
}

function EmulatorstatsChart(props: ChartProps) {
  const [activetab, setActiveTab] = useState("pickRateVsScene");
  const { theme } = useAppSelector((state) => state.home);
  const {
    gripSuccessPercent,
    pickSuccessPercent,
    picksPerHour,
    thoroughnessPercent,
  } = props;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <NavTabs>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("pickRateVsScene")}
            activetab={activetab}
            navto={"pickRateVsScene"}
            theme={theme as string}
            robocolor=""
          >
            Pick Rate Vs Scene
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("thoroughnessVsScene")}
            activetab={activetab}
            navto={"thoroughnessVsScene"}
            theme={theme as string}
            robocolor=""
          >
            Thoroughness Vs Scene
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("gripSuccessVsScene")}
            activetab={activetab}
            navto={"gripSuccessVsScene"}
            theme={theme as string}
            robocolor=""
          >
            Grip Success Vs Scene
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("pickSuccessVsScene")}
            activetab={activetab}
            navto={"pickSuccessVsScene"}
            theme={theme as string}
            robocolor=""
          >
            Pick Success Vs Scene
          </NavTabSpan>
        </NavTabItem>
      </NavTabs>
      {activetab === "pickRateVsScene" && (
        <WeeklyEmustatPlot
          traces={picksPerHour}
          theme={theme as string}
          title="Pick Rate vs Scene"
          ylabel="picks_per_hour"
        />
      )}
      {activetab === "thoroughnessVsScene" && (
        <WeeklyEmustatPlot
          traces={thoroughnessPercent}
          theme={theme as string}
          title="Thoroughness vs Scene"
          ylabel="thoroughness_percentage"
        />
      )}
      {activetab === "gripSuccessVsScene" && (
        <WeeklyEmustatPlot
          traces={gripSuccessPercent}
          theme={theme as string}
          title="Grip Success vs Scene"
          ylabel="grip_success_percentage"
        />
      )}
      {activetab === "pickSuccessVsScene" && (
        <WeeklyEmustatPlot
          traces={pickSuccessPercent}
          theme={theme as string}
          title="Pick Success vs Scene"
          ylabel="pick_success_percentage"
        />
      )}
    </>
  );
}

export default EmulatorstatsChart;

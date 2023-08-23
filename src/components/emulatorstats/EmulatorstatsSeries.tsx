import { useState } from "react";
import Select from "react-select";
import { useAppSelector } from "@/app/hooks";
import { NavTabItem, NavTabSpan, NavTabs } from "@/components/styled";
import EmustatSceneScatter from "@/components/plotly/EmustatSceneScatter";
import { darkThemeClass, selectDarkStyles } from "@/utils/utils";

interface SeriesProps {
  gripSuccessPercent: Array<number>;
  hoverInfo: Array<string>;
  pickSuccessPercent: Array<number>;
  picksPerHour: Array<number>;
  thoroughnessPercent: Array<number>;
  timeSeries: Array<string>;
  dates: Array<string>;
  dispatchAction: Function;
}

function EmulatorstatsSeries(props: SeriesProps) {
  const [activetab, setActiveTab] = useState("pickRateVsReportTime");
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const { theme } = useAppSelector((state) => state.home);
  const {
    gripSuccessPercent,
    hoverInfo,
    pickSuccessPercent,
    picksPerHour,
    thoroughnessPercent,
    timeSeries,
    dates,
    dispatchAction,
  } = props;
  const dateOptions = dates?.map((x) => {
    return { label: x, value: x };
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDateSelect = (newValue: any) => {
    setSelectedDate(newValue);
    dispatchAction({ type: "ON_DATE_PICKED", payload: newValue.value });
  };

  const dark = darkThemeClass("dark-theme", theme);
  const customStyles = dark ? selectDarkStyles : {};

  return (
    <>
      <NavTabs>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("pickRateVsReportTime")}
            activetab={activetab}
            navto={"pickRateVsReportTime"}
            theme={theme as string}
            robocolor=""
          >
            Pick Rate Vs Scene
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("thoroughnessVsReportTime")}
            activetab={activetab}
            navto={"thoroughnessVsReportTime"}
            theme={theme as string}
            robocolor=""
          >
            Thoroughness Vs Scene
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("gripSuccessVsReportTime")}
            activetab={activetab}
            navto={"gripSuccessVsReportTime"}
            theme={theme as string}
            robocolor=""
          >
            Grip Success Vs Scene
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("pickSuccessVsReportTime")}
            activetab={activetab}
            navto={"pickSuccessVsReportTime"}
            theme={theme as string}
            robocolor=""
          >
            Pick Success Vs Scene
          </NavTabSpan>
        </NavTabItem>
      </NavTabs>
      <Select
        isSearchable
        placeholder="dec"
        options={dateOptions}
        name="date"
        inputId="date"
        onChange={handleDateSelect}
        value={selectedDate}
        defaultValue={selectedDate}
        className="multi-select-container"
        classNamePrefix="select"
        styles={customStyles}
      />
      {activetab === "pickRateVsReportTime" && (
        <EmustatSceneScatter
          ydata={picksPerHour}
          xdata={timeSeries}
          hovers={hoverInfo}
          theme={theme as string}
          title={`Pick Rate vs Report Time ${selectedDate?.value || ""}`}
          ylabel="picks_per_hour"
          xlabel="report time"
        />
      )}

      {activetab === "thoroughnessVsReportTime" && (
        <EmustatSceneScatter
          ydata={thoroughnessPercent}
          xdata={timeSeries}
          hovers={hoverInfo}
          theme={theme as string}
          title={`Thoroughness vs Report Time ${selectedDate?.value || ""}`}
          ylabel="thoroughness_percentage"
          xlabel="report time"
        />
      )}

      {activetab === "gripSuccessVsReportTime" && (
        <EmustatSceneScatter
          ydata={gripSuccessPercent}
          xdata={timeSeries}
          hovers={hoverInfo}
          theme={theme as string}
          title={`Grip Success vs Report Time ${selectedDate?.value || ""}`}
          ylabel="grip_success_percentage"
          xlabel="report time"
        />
      )}

      {activetab === "pickSuccessVsReportTime" && (
        <EmustatSceneScatter
          ydata={pickSuccessPercent}
          xdata={timeSeries}
          hovers={hoverInfo}
          theme={theme as string}
          title={`Pick Success vs Report Time ${selectedDate?.value || ""}`}
          ylabel="pick_success_percentage"
          xlabel="report time"
        />
      )}
    </>
  );
}

export default EmulatorstatsSeries;

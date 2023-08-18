import { useState } from "react";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  darkThemeClass,
  handleSelectFactory,
  selectDarkStyles,
  transformRobots,
} from "@/utils/utils";
import { queryLogVideo } from "@/features/logparser/logparserSlice";

interface LogProps {
  category: string;
}

function LoadVideo(props: LogProps) {
  const {
    internal: { robots, harv_id },
    logsession,
  } = useAppSelector((state) => state.logparser);
  const { theme } = useAppSelector((state) => state.home);
  const option = { label: `harv id ${harv_id}`, value: harv_id };
  const [selectedRobot, setSelectedRobot] = useState<any>(null);
  const [selectedHarv, setSelectedHarv] = useState<any>(option);
  const [fetching, setFetching] = useState(false);
  const dispatch = useAppDispatch();
  const handleHarvSelect = handleSelectFactory(setSelectedHarv);
  const handleRobotSelect = handleSelectFactory(setSelectedRobot);

  const robotOptions = transformRobots(robots);
  const harvOptions = [option];
  const btn = darkThemeClass("btn-dark", theme);
  const customStyles = btn ? selectDarkStyles : {};

  const loadLogVideo = async () => {
    let queryObj: Record<string, any> = {};
    if (selectedRobot && selectedRobot.hasOwnProperty("value")) {
      queryObj["robot"] = selectedRobot.value;
    }
    if (harv_id) {
      queryObj["log_session__harv__harv_id"] = harv_id;
    }
    if (props.category) {
      queryObj["category"] = props.category;
    }
    queryObj["log_session_id"] = logsession?.id;
    setFetching(true);
    await dispatch(queryLogVideo(queryObj));
    setFetching(false);
  };

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <Select
          isSearchable
          isClearable
          options={robotOptions}
          defaultValue={selectedRobot}
          value={selectedRobot}
          onChange={handleRobotSelect}
          placeholder="robot id e.g 1"
          className="load-video"
          styles={customStyles}
        />
      </div>
      <div className="col-md-4">
        <Select
          isSearchable
          isClearable
          isDisabled
          options={harvOptions}
          defaultValue={selectedHarv}
          value={selectedHarv}
          onChange={handleHarvSelect}
          placeholder="harvester e.g 11"
          className="load-video"
          styles={customStyles}
        />
      </div>
      <div className="col-md-4">
        <span onClick={loadLogVideo} className={`btn ${btn}`}>
          {fetching ? "loading..." : "Load Video"}
        </span>
      </div>
    </div>
  );
}

export default LoadVideo;

import { Link } from "react-router-dom";
import VSCodeEditor from "@monaco-editor/react";
import { useAppSelector } from "@/app/hooks";
import { THEME_MODES } from "@/features/base/constants";
import { darkThemeClass, monacoOptions, timeStampFormat } from "@/utils/utils";

function EmulatorstatsDetail() {
  const { emustatsObj } = useAppSelector((state) => state.emulatorstat);
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);

  return (
    <>
      <div className="table-responsive mb-2">
        <table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <th>Report Time</th>
              <th>Scene</th>
              <th>Branch</th>
              <th>Date</th>
              <th>Runner</th>
              <th>Elapsed Seconds</th>
              <th>MM Traveled</th>
              <th>Num Grip Attempts</th>
              <th>Grip Success Percentage</th>
              <th>Num Pick Attempts</th>
              <th>Pick Success Percentage</th>
              <th>Thoroughness Percentage</th>
              <th>Detection Success Percentage</th>
              <th>Num Cand Overlaps</th>
              <th>RMSE Localization MM</th>
              <th>Num Fruit Collisions</th>
              <th>Num Leaf Collisions</th>
              <th>Num Bed Collisions</th>
              <th>Num Picks Cand</th>
              <th>Num No Picks Cand</th>
              <th>Num False Ripe</th>
              <th>Num False Unripe</th>
              <th>Avg Ripeness Picks</th>
              <th>Avg Ripeness Unpicks</th>
              <th>Total Targets</th>
              <th>Tags</th>
              <th>Harvester</th>
              <th>Location</th>
              <th>Event</th>
              <th>Picksession</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {timeStampFormat(new Date(emustatsObj?.reportTime as string))}
              </td>
              <td>{emustatsObj?.scene}</td>
              <td>{emustatsObj?.branch}</td>
              <td>{emustatsObj?.date}</td>
              <td>{emustatsObj?.runner}</td>
              <td>{emustatsObj?.elapsed_seconds}</td>
              <td>{emustatsObj?.mm_traveled}</td>
              <td>{emustatsObj?.num_grip_attempts}</td>
              <td>{emustatsObj?.grip_success_percentage}</td>
              <td>{emustatsObj?.num_pick_attempts}</td>
              <td>{emustatsObj?.pick_success_percentage}</td>
              <td>{emustatsObj?.thoroughness_percentage}</td>
              <td>{emustatsObj?.detection_success_percentage}</td>
              <td>{emustatsObj?.num_cand_overlaps}</td>
              <td>{emustatsObj?.rmse_localization_mm}</td>
              <td>{emustatsObj?.num_fruit_collisions}</td>
              <td>{emustatsObj?.num_leaf_collisions}</td>
              <td>{emustatsObj?.num_bed_collisions}</td>
              <td>{emustatsObj?.num_pick_cands}</td>
              <td>{emustatsObj?.num_no_pick_cands}</td>
              <td>{emustatsObj?.num_false_ripe}</td>
              <td>{emustatsObj?.num_false_unripe}</td>
              <td>{emustatsObj?.avg_ripeness_pick}</td>
              <td>{emustatsObj?.avg_ripeness_no_pick}</td>
              <td>{emustatsObj?.total_targets}</td>
              <td>{emustatsObj?.tags?.join(", ")}</td>
              <td>
                <Link to={`/harvesters/${emustatsObj?.harvester}`}>
                  {emustatsObj?.harvester}
                </Link>
              </td>
              <td>
                <Link to={`/locations/${emustatsObj?.location}`}>
                  {emustatsObj?.location}
                </Link>
              </td>
              <td>
                <Link to={`/events/${emustatsObj?.event}`}>
                  {emustatsObj?.event}
                </Link>
              </td>
              <td>
                <Link to={`/picksessions/${emustatsObj?.pick_session}`}>
                  {emustatsObj?.pick_session}
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>Emulator Stats Report</div>
      <VSCodeEditor
        height="40vh"
        language="json"
        value={JSON.stringify(emustatsObj?.report, null, 2)}
        theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
        options={{ ...monacoOptions, readOnly: true } as any}
      />
    </>
  );
}

export default EmulatorstatsDetail;

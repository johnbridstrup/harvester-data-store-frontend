import { darkThemeClass } from "@/utils/utils";

interface TimeTableProps {
  sysmonObj: { chrony_info?: { sys_time: number; ref_time: number } };
  theme: string;
}

function TimeTable(props: TimeTableProps) {
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table table-bordered ${tabledt}`}>
        <tbody>
          <tr>
            <th scope="col">System Time</th>
            <th scope="col">{props.sysmonObj.chrony_info?.sys_time}</th>
          </tr>
          <tr>
            <th scope="col">Reference Time</th>
            <th scope="col">{props.sysmonObj.chrony_info?.ref_time}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TimeTable;

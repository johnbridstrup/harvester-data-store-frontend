import moment from "moment";
import { Link } from "react-router-dom";
import { JobType } from "@/features/harvjob/harvjobTypes";
import { darkThemeClass } from "@/utils/utils";

interface TableProps {
  jobtypes: Array<JobType>;
  handleJTUpdateClick: (job: JobType) => void;
  theme: string;
}

function JobTypeTable(props: TableProps) {
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table ${tabledt}`}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.jobtypes.map((jobtype, _) => (
            <tr key={jobtype.id}>
              <td>
                <Link to={`/jobtypes/${jobtype.id}`}>{jobtype.id}</Link>
              </td>
              <td>{jobtype.name}</td>
              <td>{moment(jobtype.created).format("LLLL")}</td>
              <td>{moment(jobtype.lastModified).format("LLLL")}</td>
              <td>
                <i
                  onClick={() => props.handleJTUpdateClick(jobtype)}
                  className="las la-pencil-alt"
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTypeTable;

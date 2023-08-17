import moment from "moment";
import { JobSchema } from "@/features/harvjob/harvjobTypes";
import { Link } from "react-router-dom";
import { darkThemeClass } from "@/utils/utils";

interface TableProps {
  jobschemas: Array<JobSchema>;
  handleJSUpdateClick: (obj: JobSchema) => void;
  theme: string;
}

function JobSchemaTable(props: TableProps) {
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table ${tabledt}`}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Version</th>
            <th>Comment</th>
            <th>Job Type</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.jobschemas.map((schema, _) => (
            <tr key={schema.id}>
              <td>
                <Link to={`/jobschemas/${schema.id}`}>{schema.id}</Link>
              </td>
              <td>{schema.version}</td>
              <td>{schema.comment}</td>
              <td>{schema.jobtype}</td>
              <td>{moment(schema.created).format("LLLL")}</td>
              <td>{moment(schema.lastModified).format("LLLL")}</td>
              <td>
                <i
                  onClick={() => props.handleJSUpdateClick(schema)}
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

export default JobSchemaTable;

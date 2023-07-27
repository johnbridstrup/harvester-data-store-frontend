import moment from "moment";
import { darkThemeClass } from "@/utils/utils";
import { Distributor } from "@/features/distributor/distributorTypes";

interface DistProps {
  distributors: Array<Distributor>;
  handleDistUpdateClick: (obj: { name: string; id: number }) => void;
  theme: string;
}

function DistributorTable(props: DistProps) {
  const tabledt = darkThemeClass("dt-table", props.theme);
  const rowdt = darkThemeClass("dt-row", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table ${tabledt}`}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created By</th>
            <th>Updated By</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.distributors?.map((distributor, _) => (
            <tr key={distributor.id} className={`tr-hover ${rowdt}`}>
              <td>{distributor.id}</td>
              <td>{distributor.name}</td>
              <td>{distributor.creator?.username}</td>
              <td>{distributor.modifiedBy?.username}</td>
              <td>{moment(distributor.created).format("LLLL")}</td>
              <td>{moment(distributor.lastModified).format("LLLL")}</td>
              <td>
                <span>
                  <i
                    onClick={() => props.handleDistUpdateClick(distributor)}
                    className="las la-pencil-alt"
                  ></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DistributorTable;

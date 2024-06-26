import moment from "moment";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass } from "@/utils/utils";
import { LoaderDiv } from "../styled";
import { Loader } from "../common";
import { Link } from "react-router-dom";

function HarvesterSwInfoList() {
  const { loading, harvesterswinfos } = useAppSelector(
    (state) => state.harvester,
  );
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);
  const rowdt = darkThemeClass("dt-row", theme);

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={25} />
        </LoaderDiv>
      ) : (
        <div className="table-responsive mb-4">
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>Githash</th>
                <th>Dirty</th>
                <th>BranchName</th>
                <th>Deployer</th>
                <th>Deployed TS</th>
                <th>Harvester</th>
              </tr>
            </thead>
            <tbody>
              {harvesterswinfos.map((info, _) => (
                <tr key={info.id} className={`tr-hover ${rowdt}`}>
                  <td>{info.githash}</td>
                  <td>{info.dirty ? "true" : "false"}</td>
                  <td>{info.branchname}</td>
                  <td>{info.deployer}</td>
                  <td>{moment(info.deployed_ts).format("LLLL")}</td>
                  <td>
                    <Link to={`/harvesters/${info.harvester.id}`}>
                      {info.harvester.harv_id}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default HarvesterSwInfoList;

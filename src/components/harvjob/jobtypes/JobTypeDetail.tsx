import moment from "moment";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass } from "@/utils/utils";

function JobTypeDetail() {
  const { jobtype } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  return (
    <div className="mb-4">
      <div
        className={`card card-body mb-4 ${cardtheme}`}
        data-testid="job-type"
      >
        <div className="row">
          <div className="col-md-3 mb-2">
            <div className="f-w-600">ID</div>
            <div>{jobtype?.id}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Name</div>
            <div>{jobtype?.name}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Created At</div>
            <div>{moment(jobtype?.created).format("LLLL")}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Updated At</div>
            <div>{moment(jobtype?.lastModified).format("LLLL")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobTypeDetail;

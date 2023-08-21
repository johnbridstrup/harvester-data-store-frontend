import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Theme, toast } from "react-toastify";
import { THEME_MODES } from "@/features/base/constants";
import { selectDarkStyles } from "@/utils/utils";
import { FormEvent } from "react";

interface JobProps {
  schemaOptions: any;
  handleJobSchemaSelect: (args0: any) => void;
  selectedJobSchema: any;
  theme: string;
  url: string;
}

function JobSchemaSelect(props: JobProps) {
  const navigate = useNavigate();
  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (props.url) {
      let url = new URL(props.url);
      navigate(`/schedulejob/${url.search}`);
    } else {
      toast.error("Please select a job type then job schema to proceed", {
        theme:
          props.theme === THEME_MODES.AUTO_THEME
            ? "colored"
            : (props.theme as Theme),
      });
    }
  };
  const customStyles =
    props.theme === THEME_MODES.DARK_THEME ? selectDarkStyles : {};

  return (
    <div className="row mb-4">
      <div className="col-md-10">
        <div className="job-schema-select">
          <Select
            isSearchable
            isClearable
            placeholder="select schema"
            options={props.schemaOptions}
            name="jobschema"
            inputId="jobschema"
            onChange={props.handleJobSchemaSelect}
            defaultValue={props.selectedJobSchema}
            value={props.selectedJobSchema}
            className="multi-select-container"
            classNamePrefix="select"
            styles={customStyles}
          />
          <span className="add-new-link">
            <Link to={`/jobschemas`}>
              <i className="las la-plus"></i>
            </Link>
          </span>
        </div>
      </div>
      <div className="col-md-2">
        <Link
          to={`/schedulejob/${props.selectedJobSchema?.value}`}
          className="btn btn-primary"
          onClick={handleClick}
        >
          Schedule
        </Link>
      </div>
    </div>
  );
}

export default JobSchemaSelect;

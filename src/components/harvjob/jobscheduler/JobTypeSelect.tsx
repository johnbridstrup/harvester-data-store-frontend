import { Link } from "react-router-dom";
import Select from "react-select";
import { THEME_MODES } from "@/features/base/constants";
import { selectDarkStyles } from "@/utils/utils";

interface JobProps {
  jobtypeOptions: any;
  handleJobTypeSelect: (args0: any) => void;
  selectedJobType: any;
  theme: string;
}

function JobTypeSelect(props: JobProps) {
  const customStyles =
    props.theme === THEME_MODES.DARK_THEME ? selectDarkStyles : {};

  return (
    <div className="job-type-select">
      <Select
        isSearchable
        isClearable
        placeholder="select job type"
        options={props.jobtypeOptions}
        name="jobtype"
        inputId="jobtype"
        onChange={props.handleJobTypeSelect}
        defaultValue={props.selectedJobType}
        value={props.selectedJobType}
        className="multi-select-container"
        classNamePrefix="select"
        styles={customStyles}
      />
      <span className="add-new-link">
        <Link to={`/jobtypes`}>
          <i className="las la-plus"></i>
        </Link>
      </span>
    </div>
  );
}

export default JobTypeSelect;

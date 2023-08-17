import { ChangeEvent, FormEvent } from "react";
import VSCodeEditor from "@monaco-editor/react";
import Select from "react-select";
import { THEME_MODES } from "@/features/base/constants";
import { darkThemeClass, monacoOptions, selectDarkStyles } from "@/utils/utils";
import { Loader } from "../common";

interface ModalProps {
  handleFieldChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSchemaChange: (value?: string) => void;
  fieldData: {
    schema: Record<string, any>;
    version: string;
    comment: string;
    mode: string;
  };
  handleSubmit: (e: FormEvent) => Promise<void>;
  loading?: boolean;
  jobtypeOptions: any;
  handleJobTypeSelect: (args0: any) => void;
  selectedJobType: any;
  theme: string;
}

function JobSchemaModal(props: ModalProps) {
  const { schema, version, comment, mode } = props.fieldData;
  const modal = darkThemeClass("dt-modal-content", props.theme);
  const inputdark = darkThemeClass("dt-form-control", props.theme);
  const customStyles = modal ? selectDarkStyles : {};

  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="jobSchemaModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-center"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className={`modal-content ${modal}`}>
            <div className="text-right">
              <button
                type="button"
                className="btn"
                data-bs-dismiss="modal"
                aria-label="close"
              >
                <span
                  className={`las la-times ${modal && "text-white"}`}
                ></span>
              </button>
            </div>
            <div className="modal-body text-center px-5 pb-2">
              {mode === "edit" ? "UPDATE" : "ADD NEW"} JOB SCHEMA
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={props.handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="version">Version</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="version"
                        id="version"
                        value={version}
                        required
                        onChange={props.handleFieldChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="jobtype">Job Type</label>
                      <Select
                        isSearchable
                        isClearable
                        placeholder="test"
                        options={props.jobtypeOptions}
                        name="jobtype"
                        id="jobtype"
                        onChange={props.handleJobTypeSelect}
                        defaultValue={props.selectedJobType}
                        value={props.selectedJobType}
                        className="multi-select-container"
                        classNamePrefix="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        className={`form-control ${inputdark}`}
                        name="comment"
                        id="comment"
                        value={comment}
                        onChange={props.handleFieldChange}
                        placeholder="write your comment here"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="schema">Schema</label>
                    <VSCodeEditor
                      height="50vh"
                      language="json"
                      value={JSON.stringify(schema, null, 2)}
                      theme={
                        props.theme === THEME_MODES.DARK_THEME
                          ? "vs-dark"
                          : "light"
                      }
                      options={{ ...monacoOptions, readOnly: false } as any}
                      onChange={props.handleSchemaChange}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-block btn-primary mt-4 mb-4"
                  >
                    {props.loading ? (
                      <Loader size={25} />
                    ) : mode === "edit" ? (
                      "EDIT"
                    ) : (
                      "ADD"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSchemaModal;

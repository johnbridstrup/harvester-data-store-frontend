import { ChangeEvent, FormEvent } from "react";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "../common";

interface ModalProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldData: { name: string; mode: string };
  handleSubmit: (e: FormEvent) => void;
  loading?: boolean;
  theme: string;
}

function JobTypeModal({
  fieldData,
  theme,
  handleChange,
  handleSubmit,
  loading,
}: ModalProps) {
  const { name, mode } = fieldData;
  const modal = darkThemeClass("dt-modal-content", theme);
  const inputdark = darkThemeClass("dt-form-control", theme);
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="jobTypeModal"
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
              {fieldData.mode === "edit" ? "UPDATE" : "ADD NEW"} JOB TYPE
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="name"
                        id="name"
                        value={name}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-block btn-primary mt-4 mb-4"
                  >
                    {loading ? (
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

export default JobTypeModal;

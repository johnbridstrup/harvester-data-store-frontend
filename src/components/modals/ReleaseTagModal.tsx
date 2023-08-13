import { ChangeEvent, FormEvent } from "react";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "../common";

interface ModalProps {
  handleSubmit: (e: FormEvent) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldData: { tag: string };
  theme: string;
  loading?: boolean;
}

function ReleaseTagModal({
  fieldData,
  theme,
  handleChange,
  handleSubmit,
  loading,
}: ModalProps) {
  const modal = darkThemeClass("dt-modal-content", theme);
  const inputdark = darkThemeClass("dt-form-control", theme);
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="tagModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-center"
        aria-hidden="true"
        style={{ display: "none" }}
        data-testid="addModal"
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
              ADD RELEASE TAG
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={handleSubmit} data-testid="tag-form">
                <div className="row mb-2">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="tag">Tag</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        placeholder="A comma-separated list of tags."
                        name="tag"
                        id="tag"
                        value={fieldData.tag}
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
                    {loading ? <Loader size={25} /> : "Add"}
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

export default ReleaseTagModal;

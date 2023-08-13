import { FormEvent } from "react";
import Select from "react-select";
import { darkThemeClass, selectDarkStyles } from "@/utils/utils";
import { Loader } from "../common";

interface ModalProps {
  handleSubmit: (e: FormEvent) => void;
  loading?: boolean;
  harvOptions: any;
  selectedHarvId: any;
  handleHarvIdSelect: (args0: any) => void;
  theme: string;
}

function ScheduleModal({
  theme,
  handleHarvIdSelect,
  handleSubmit,
  harvOptions,
  selectedHarvId,
  loading,
}: ModalProps) {
  const modal = darkThemeClass("dt-modal-content", theme);
  const customStyles = modal ? selectDarkStyles : {};
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="scheduleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-center"
        aria-hidden="true"
        style={{ display: "none" }}
        data-testid="scheduleModal"
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
              SCHEDULE DEPLOYMENT
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={handleSubmit} data-testid="schedule-form">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="harv_id">Harv ID</label>
                      <Select
                        isSearchable
                        isClearable
                        placeholder="200"
                        options={harvOptions}
                        name="harv_id"
                        id="harv_id"
                        onChange={handleHarvIdSelect}
                        defaultValue={selectedHarvId}
                        value={selectedHarvId}
                        className="multi-select-container"
                        classNamePrefix="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-block btn-primary mt-4 mb-4"
                  >
                    {loading ? <Loader size={25} /> : "Schedule"}
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

export default ScheduleModal;

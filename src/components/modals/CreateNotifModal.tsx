import Select from "react-select";
import { FormProps, GenericFormField } from "../errorreport/ErrorHelpers";
import { darkThemeClass, selectDarkStyles } from "@/utils/utils";

function CreateNotifModal(props: FormProps) {
  const modal = darkThemeClass("dt-modal-content", props.theme);
  const customStyles = modal ? selectDarkStyles : {};
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="createNotifModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-center"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className={`modal-content ${modal}`}>
            <div
              className="text-right"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className={`btn`}
                data-bs-dismiss="modal"
                aria-label="close"
              >
                <span
                  className={`las la-times ${modal && "text-white"}`}
                ></span>
              </button>
            </div>
            <div className="modal-body text-center px-5 pb-2">
              CREATE NOTIFICATION
            </div>

            <div className="modal-body px-5 pb-4">
              <GenericFormField {...props} />
              <div className="form-group">
                <label htmlFor="recipients">Select Recipients</label>
                <Select
                  isMulti
                  isSearchable
                  placeholder="aft, noaft, ..."
                  options={props.usersOptions}
                  name="recipients"
                  onChange={props.handleRecipientSelect}
                  defaultValue={props.selectedRecipient}
                  value={props.selectedRecipient}
                  className="multi-select-container"
                  classNamePrefix="select"
                  styles={customStyles}
                />
              </div>
              <div className="form-group text-center mt-4 mb-4">
                <button
                  onClick={props.handleSubmit}
                  className="btn btn-primary"
                >
                  CREATE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNotifModal;

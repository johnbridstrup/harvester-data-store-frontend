import { ChangeEvent, FormEvent } from "react";
import Select from "react-select";
import { Loader } from "@/components/common";
import { darkThemeClass, selectDarkStyles } from "@/utils/utils";

interface ModalProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldData: { name: string; harv_id: number | string; mode: string };
  handleSubmit: (e: FormEvent) => void;
  loading: boolean;
  fruitOptions: any;
  selectedFruit: any;
  handleFruitSelect: (args0: any) => void;
  locationOptions: any;
  selectedLocation: any;
  handleLocSelect: (args0: any) => void;
  theme: string;
}

function HarvesterModal(props: ModalProps) {
  const { name, harv_id, mode } = props.fieldData;
  const modal = darkThemeClass("dt-modal-content", props.theme);
  const inputdark = darkThemeClass("dt-form-control", props.theme);
  const customStyles = modal ? selectDarkStyles : {};
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="harvesterModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-center"
        aria-hidden="true"
        style={{ display: "none" }}
        data-testid="addUpdateModal"
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
              {mode === "edit" ? "UPDATE" : "ADD NEW"} HARVESTER
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={props.handleSubmit} data-testid="harv-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="name"
                        id="name"
                        value={name}
                        required
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="harv_id">Harv ID</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="harv_id"
                        id="harv_id"
                        value={harv_id}
                        required
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fruit">Fruit</label>
                      <Select
                        isSearchable
                        isClearable
                        placeholder="strawberry"
                        options={props.fruitOptions}
                        name="fruit"
                        inputId="fruit"
                        onChange={props.handleFruitSelect}
                        defaultValue={props.selectedFruit}
                        value={props.selectedFruit}
                        className="multi-select-container"
                        classNamePrefix="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <Select
                        isSearchable
                        isClearable
                        placeholder="location"
                        options={props.locationOptions}
                        name="location"
                        inputId="location"
                        onChange={props.handleLocSelect}
                        defaultValue={props.selectedLocation}
                        value={props.selectedLocation}
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

export default HarvesterModal;

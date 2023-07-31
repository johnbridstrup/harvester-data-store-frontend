import Select, { ActionMeta } from "react-select";
import { darkThemeClass, selectDarkStyles } from "@/utils/utils";
import { Loader } from "../common";
import { ChangeEvent, FormEvent } from "react";

interface LocProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldData: any;
  handleSubmit: (e: FormEvent) => void;
  loading?: boolean;
  distributorOptions: any;
  selectedDistributor: any;
  handleDistrSelect: (newValue: any, actionMeta: ActionMeta<any>) => void;
  theme: string;
}

function LocationModal(props: LocProps) {
  const { ranch, country, region, mode, siteChannel } = props.fieldData;
  const modal = darkThemeClass("dt-modal-content", props.theme);
  const inputdark = darkThemeClass("dt-form-control", props.theme);
  const customStyles = modal ? selectDarkStyles : {};

  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="locationModal"
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
              {mode === "edit" ? "UPDATE" : "ADD NEW"} LOCATION
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={props.handleSubmit} data-testid="loc-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="ranch">Ranch</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="ranch"
                        id="ranch"
                        value={ranch}
                        required
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="country"
                        id="country"
                        value={country}
                        required
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="region">Region</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        id="region"
                        name="region"
                        value={region}
                        required
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="distributor">Distributor</label>
                      <Select
                        isSearchable
                        isClearable
                        placeholder="distributor"
                        options={props.distributorOptions}
                        name="distributor"
                        id="distributor"
                        onChange={props.handleDistrSelect}
                        defaultValue={props.selectedDistributor}
                        value={props.selectedDistributor}
                        className="multi-select-container"
                        classNamePrefix="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="siteChannel">Site Channel</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="siteChannel"
                        id="siteChannel"
                        value={siteChannel}
                        required
                        onChange={props.handleChange}
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

export default LocationModal;

import { ChangeEvent, FormEvent } from "react";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "../common";

interface ModalProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldData: {
    first_name: string;
    last_name: string;
    username: string;
    slack_id: string;
    email: string;
  };
  handleSubmit: (e: FormEvent) => void;
  loading: boolean;
  theme: string;
}

function ProfileUpdateModal({
  fieldData,
  handleChange,
  handleSubmit,
  loading,
  theme,
}: ModalProps) {
  const { first_name, last_name, username, slack_id, email } = fieldData;
  const modal = darkThemeClass("dt-modal-content", theme);
  const inputdark = darkThemeClass("dt-form-control", theme);
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="profileModal"
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
              UPDATE PROFILE
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        id="first_name"
                        name="first_name"
                        value={first_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="last_name"
                        id="last_name"
                        value={last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="slack_id">Slack ID</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="slack_id"
                        id="slack_id"
                        value={slack_id}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        className={`form-control ${inputdark}`}
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className={`form-control ${inputdark}`}
                        name="username"
                        id="username"
                        value={username}
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
                    {loading ? <Loader size={25} /> : "EDIT"}
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

export default ProfileUpdateModal;

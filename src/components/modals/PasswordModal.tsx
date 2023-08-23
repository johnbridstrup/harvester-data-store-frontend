import { ChangeEvent, FormEvent } from "react";
import { darkThemeClass } from "@/utils/utils";

interface ModalProps {
  password: string;
  handleSubmit: (e: FormEvent) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  theme: string;
}

function PasswordModal({
  password,
  handleChange,
  handleSubmit,
  theme,
}: ModalProps) {
  const modal = darkThemeClass("dt-modal-content", theme);
  const inputdark = darkThemeClass("dt-form-control", theme);

  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="passwordModal"
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
              ENTER PASSWORD
            </div>

            <div className="modal-body px-5 pb-4">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="password">Enter Password</label>
                  <input
                    type="password"
                    className={`form-control ${inputdark}`}
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group text-center mt-2 mb-2">
                  <button type="submit" className="btn btn-primary btn-sm">
                    Confirm
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

export default PasswordModal;

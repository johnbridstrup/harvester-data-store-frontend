import moment from "moment";
import { ChangeEvent, FormEvent, MutableRefObject } from "react";
import { Link } from "react-router-dom";
import { User } from "@/features/auth/authTypes";
import { Notification } from "@/features/notification/notificationTypes";
import { darkThemeClass } from "@/utils/utils";
import avatar from "@/assets/images/avatar.png";
import { LoaderDiv } from "../styled";
import { Loader } from "../common";

interface ColLeftProps {
  user: User;
  theme: string;
}

interface ColRightProps {
  user: User;
  profileRef: MutableRefObject<HTMLButtonElement | null>;
  passwordModalPopUp: () => void;
  passwordRef: MutableRefObject<HTMLButtonElement | null>;
  theme: string;
}

interface PasswordProps {
  fieldData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  loading: boolean;
  theme: string;
}

interface NotificationProps {
  user: User;
  notify_type: string;
  notifications: Array<Notification>;
  confirmDel: (obj: Notification) => void;
  count: number;
  loading: boolean;
  theme: string;
}

export const ProfileColLeft = ({ user, theme }: ColLeftProps) => {
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  return (
    <div className={`card ${cardtheme}`}>
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={avatar}
            alt="Admin"
            className="rounded-circle"
            width="150"
          />
          <div className="mt-3">
            <h4>
              {user?.first_name} {user?.last_name}
            </h4>
            <p className="text-secondary mb-1">
              Slack Id {user?.profile?.slack_id}
            </p>
            <p className="text-muted font-size-sm">
              {user?.is_active ? "Profile is Active" : "Profile is Inactive"},{" "}
              {user?.is_staff
                ? "Profile has staff access"
                : "Profile is non-staff"}
              ,{" "}
              {user?.is_superuser
                ? "Profile is superuser"
                : "Profile is non-superuser"}
            </p>
            <p>Last Login {moment(user?.last_login).format("LLLL")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileColRight = ({
  passwordModalPopUp,
  passwordRef,
  profileRef,
  theme,
  user,
}: ColRightProps) => {
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  return (
    <div className={`card mb-3 ${cardtheme}`}>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-3">
            <h6 className="mb-0">First Name</h6>
          </div>
          <div className="col-sm-9 text-secondary">{user?.first_name}</div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-3">
            <h6 className="mb-0">Last Name</h6>
          </div>
          <div className="col-sm-9 text-secondary">{user?.last_name}</div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-3">
            <h6 className="mb-0">Email</h6>
          </div>
          <div className="col-sm-9 text-secondary">{user?.email}</div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-3">
            <h6 className="mb-0">Username</h6>
          </div>
          <div className="col-sm-9 text-secondary">{user?.username}</div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12 text-center">
            <button className="btn btn-primary" onClick={passwordModalPopUp}>
              Edit
            </button>
            <button
              ref={profileRef}
              data-bs-toggle="modal"
              data-bs-target="#profileModal"
              style={{ display: "none" }}
            >
              Edit
            </button>
            <button
              ref={passwordRef}
              data-bs-toggle="modal"
              data-bs-target="#passwordModal"
              style={{ display: "none" }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChangePassword = ({
  fieldData,
  handleChange,
  handleSubmit,
  loading,
  theme,
}: PasswordProps) => {
  const { current_password, new_password, confirm_password } = fieldData;
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  const inputdark = darkThemeClass("dt-form-control", theme);
  return (
    <div className={`card mt-3 ${cardtheme}`}>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div>
            <h6 className="d-flex align-items-center mb-3">
              <i className="las la-lock size-2x mx-2"></i>
              Change Password
            </h6>
          </div>
          <div className="form-group">
            <label htmlFor="current_password">Current Password</label>
            <input
              type="password"
              name="current_password"
              className={`form-control ${inputdark}`}
              id="current_password"
              required
              value={current_password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              name="new_password"
              className={`form-control ${inputdark}`}
              id="new_password"
              required
              value={new_password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              className={`form-control ${inputdark}`}
              id="confirm_password"
              required
              value={confirm_password}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 mb-3 text-center">
            <button type="submit" className="btn btn-primary">
              {loading ? <Loader size={25} /> : "Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Notifications = ({
  confirmDel,
  count,
  loading,
  notifications,
  notify_type,
  theme,
  user,
}: NotificationProps) => {
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  const btn = darkThemeClass("btn-dark", theme);
  return (
    <div className={`card h-100 ${cardtheme}`}>
      <div className="card-body">
        <h6 className="d-flex align-items-center mb-3">
          <i className="las la-bell size-2x mx-2"></i>
          Recent Notifications ({notify_type}) ({count})
        </h6>
        <hr />
        {loading ? (
          <LoaderDiv>
            <Loader size={25} />
          </LoaderDiv>
        ) : (
          <>
            {notifications.map((notifyObj, _) => (
              <div key={notifyObj.id} className="mb-4">
                <Link
                  to={`/notifications/${notifyObj.id}`}
                  className="notification"
                >
                  <div>
                    Notify {user?.username} when {notifyObj?.trigger_on} has{" "}
                    {JSON.stringify(notifyObj?.criteria)}
                  </div>
                </Link>
                {(user?.id === notifyObj.creator.id ||
                  user?.is_superuser === true) && (
                  <div className="mb-2 mt-2">
                    <button
                      onClick={() => confirmDel(notifyObj)}
                      className={`btn btn-sm text-danger ${btn}`}
                    >
                      Del
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <div className="text-center">
          <Link
            to={`/notifications?category=${notify_type.toLowerCase()}`}
            className="btn btn-primary"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

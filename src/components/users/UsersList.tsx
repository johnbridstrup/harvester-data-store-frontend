import moment from "moment";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Theme, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SUCCESS, THEME_MODES } from "@/features/base/constants";
import {
  createUser,
  queryUsers,
  updateUser,
} from "@/features/users/usersSlice";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "@/components/common";
import UserModal from "../modals/UserModal";
import { LoaderDiv } from "../styled";
import { User } from "@/features/auth/authTypes";

export interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  slack_id: string;
  email: string;
  is_staff: boolean;
  password?: string;
  password2?: string;
  mode: string;
  id: number | null;
}

function UsersList() {
  const [fieldData, setFieldData] = useState<UserData>({
    first_name: "",
    last_name: "",
    username: "",
    slack_id: "",
    email: "",
    is_staff: false,
    password: "",
    password2: "",
    mode: "add",
    id: null,
  });
  const { users, loading } = useAppSelector((state) => state.user);
  const { theme } = useAppSelector((state) => state.home);
  const userRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();
  const tabledt = darkThemeClass("dt-table", theme);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "is_staff") {
      setFieldData((current) => {
        return { ...current, is_staff: e.target.checked };
      });
    } else {
      setFieldData((current) => {
        return { ...current, [e.target.name]: e.target.value };
      });
    }
  };

  const modalPopUp = (mode?: string) => {
    if (typeof mode === "string" && mode === "add") {
      setFieldData((current) => {
        return {
          ...current,
          email: "",
          first_name: "",
          is_staff: false,
          last_name: "",
          mode: "add",
          slack_id: "",
          username: "",
          id: null,
        };
      });
    }
    userRef.current?.click();
  };

  const callback = async (res: any) => {
    if (res?.payload?.status === SUCCESS) {
      await dispatch(queryUsers({}));
      toast.success(res?.payload?.message, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      modalPopUp();
    } else {
      toast.error(res?.payload, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (fieldData.password !== fieldData.password2) {
      toast.error("passwords do not match!", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      return;
    }
    const data = { ...fieldData, profile: { slack_id: fieldData.slack_id } };
    if (data.mode === "edit") {
      delete data.password;
      delete data.password2;
    }

    if (fieldData.mode === "add") {
      const res = await dispatch(createUser(data));
      callback(res);
    } else if (fieldData.mode === "edit") {
      const res = await dispatch(updateUser(data));
      callback(res);
    }
  };

  const handleUserUpdateClick = (user: User) => {
    setFieldData((current) => {
      return {
        ...current,
        email: user.email,
        first_name: user.first_name,
        is_staff: user.is_staff,
        last_name: user.last_name,
        slack_id: user.profile?.slack_id,
        username: user.username,
        mode: "edit",
        id: user.id,
        password: "",
        password2: "",
      };
    });
    modalPopUp();
  };

  return (
    <>
      <div className="flex-right mb-2">
        <button className="btn btn-primary" onClick={() => modalPopUp("add")}>
          Add New User
        </button>
        <button
          ref={userRef}
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#userModal"
          style={{ display: "none" }}
        >
          Create Notification
        </button>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <div className="table-responsive mb-2">
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Slack ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, _) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.profile?.slack_id}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    {user.is_staff ? "Staff" : "Regular User"}{" "}
                    {user.is_superuser && "Superuser"}
                  </td>
                  <td>{moment(user.last_login).format("LLLL")}</td>
                  <td>
                    <i
                      onClick={() => handleUserUpdateClick(user)}
                      className="las la-pencil-alt"
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UserModal
        fieldData={fieldData}
        handleChange={handleFieldChange}
        handleSubmit={handleFormSubmit}
        loading={false}
        theme={theme as string}
      />
    </>
  );
}

export default UsersList;

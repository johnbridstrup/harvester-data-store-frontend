import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import { Theme, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  changePassword,
  confirmPassword,
  updateProfile,
} from "@/features/auth/authSlice";
import { User } from "@/features/auth/authTypes";
import { Notification } from "@/features/notification/notificationTypes";
import {
  FULLFILLED_PROMISE,
  NOTIFY_CATEGORY,
  REJECTED_PROMISE,
  SUCCESS,
  THEME_MODES,
} from "@/features/base/constants";
import notificationService from "@/features/notification/notificationService";
import { deleteNotification } from "@/features/notification/notificationSlice";
import ConfirmModal from "../modals/ConfirmModal";
import PasswordModal from "../modals/PasswordModal";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import {
  ChangePassword,
  Notifications,
  ProfileColLeft,
  ProfileColRight,
} from "./ProfileHelpers";

interface FieldData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  slack_id: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  password: string;
  new_password: string;
  current_password: string;
  confirm_password: string;
}

function UserProfile() {
  const [fieldData, setFieldData] = useState<FieldData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    slack_id: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
    last_login: "",
    password: "",
    new_password: "",
    current_password: "",
    confirm_password: "",
  });
  const [notifObj, setNotifObj] = useState<Notification | null>(null);
  const [created, setCreated] = useState<Array<Notification>>([]);
  const [isRecipient, setIsRecipient] = useState<Array<Notification>>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const profileRef = useRef<HTMLButtonElement | null>(null);
  const passwordRef = useRef<HTMLButtonElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const createdNotification = created.slice(0, 5);
  const assignedNotification = isRecipient.slice(0, 5);

  useEffect(() => {
    setFieldData((current) => {
      return {
        ...current,
        first_name: user?.first_name as string,
        last_name: user?.last_name as string,
        username: user?.username as string,
        email: user?.email as string,
        slack_id: user?.profile?.slack_id as string,
        is_active: user?.is_active as boolean,
        is_staff: user?.is_staff as boolean,
        is_superuser: user?.is_superuser as boolean,
        last_login: user?.last_login as string,
      };
    });
  }, [user]);

  const fetchNotification = useCallback(() => {
    (async () => {
      try {
        setLoading(true);
        const [createdResult, recipientResult] = await Promise.all([
          notificationService.query(
            { category: NOTIFY_CATEGORY.created },
            token as string,
          ),
          notificationService.query(
            { category: NOTIFY_CATEGORY.isRecipient },
            token as string,
          ),
        ]);

        setCreated(createdResult.results);
        setIsRecipient(recipientResult.results);
        setLoading(false);
      } catch (error) {
        setCreated([]);
        setIsRecipient([]);
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  const profileModalPopUp = () => {
    profileRef.current?.click();
  };

  const passwordModalPopUp = () => {
    passwordRef.current?.click();
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      ...fieldData,
      profile: { slack_id: fieldData.slack_id },
      password: undefined,
      id: user?.id as number,
    };
    const res = await dispatch(updateProfile(data));
    if (res.payload?.status === SUCCESS) {
      setFieldData((current) => {
        return { ...current, password: "" };
      });
      toast.success(res.payload?.message, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      profileModalPopUp();
    } else if (res.type === REJECTED_PROMISE.profile) {
      toast.error(res?.payload, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    } else {
      toast.error("something went wrong. please try again", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (fieldData.new_password !== fieldData.confirm_password) {
      toast.error("passwords do not match!", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    } else {
      const data = {
        current_password: fieldData.current_password,
        new_password: fieldData.new_password,
      };
      const res = await dispatch(changePassword(data));
      if (res.payload?.status === SUCCESS) {
        toast.success(res.payload?.message, {
          theme:
            theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
        });
        setFieldData((current) => {
          return {
            ...current,
            current_password: "",
            new_password: "",
            confirm_password: "",
          };
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else if (res.type === REJECTED_PROMISE.password) {
        toast.error(res?.payload, {
          theme:
            theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
        });
      } else {
        toast.error("something went wrong try again later", {
          theme:
            theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
        });
      }
    }
  };

  const handleDeleteNotification = async () => {
    const res = await dispatch(deleteNotification(notifObj?.id as number));
    if (res.type === FULLFILLED_PROMISE.notification) {
      toast.success("Notification deleted successfully", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      fetchNotification();
      confirmPopUp(null);
    } else {
      toast.error("Could not delete the specified notification", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  const handleConfirmPassword = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      username: user?.username as string,
      password: fieldData.password,
    };
    const res = await dispatch(confirmPassword(data));
    if (res.payload?.status === SUCCESS) {
      passwordModalPopUp();
      setTimeout(() => {
        profileModalPopUp();
      }, 1000);
    } else {
      toast.error("could not authenticate with the given credentials", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  const confirmPopUp = (obj: any) => {
    setNotifObj(obj);
    confirmRef.current?.click();
  };
  const cancelRequest = () => {
    confirmRef.current?.click();
  };

  return (
    <>
      <div className="row gutters-sm mt-5">
        <div className="col-md-4 mb-3">
          <ProfileColLeft user={user as User} theme={theme as string} />
          <ChangePassword
            fieldData={fieldData}
            handleChange={handleFieldChange}
            handleSubmit={handlePasswordSubmit}
            theme={theme as string}
            loading={false}
          />
        </div>
        <div className="col-md-8">
          <ProfileColRight
            user={user as User}
            profileRef={profileRef}
            passwordModalPopUp={passwordModalPopUp}
            passwordRef={passwordRef}
            theme={theme as string}
          />

          <div className="row gutters-sm">
            <div className="col-sm-6 mb-3">
              <Notifications
                user={user as User}
                notifications={createdNotification}
                notify_type={NOTIFY_CATEGORY.created.toUpperCase()}
                confirmDel={confirmPopUp}
                count={created.length}
                loading={loading}
                theme={theme as string}
              />
            </div>
            <div className="col-sm-6 mb-3">
              <Notifications
                user={user as User}
                notifications={assignedNotification}
                notify_type={NOTIFY_CATEGORY.isRecipient.toUpperCase()}
                confirmDel={confirmPopUp}
                count={isRecipient.length}
                loading={loading}
                theme={theme as string}
              />
            </div>
          </div>
        </div>
      </div>
      <ProfileUpdateModal
        fieldData={fieldData}
        handleChange={handleFieldChange}
        handleSubmit={handleProfileSubmit}
        loading={false}
        theme={theme as string}
      />
      <PasswordModal
        password={fieldData.password}
        handleChange={handleFieldChange}
        handleSubmit={handleConfirmPassword}
        theme={theme as string}
      />
      <ConfirmModal
        confirmRef={confirmRef}
        cancelRequest={cancelRequest}
        confirmRequest={handleDeleteNotification}
        msg={"Are you sure you want to delete the selected notification(s)"}
        theme={theme as string}
        loading={false}
      />
    </>
  );
}

export default UserProfile;

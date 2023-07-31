import { ChangeEvent, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { MAX_LIMIT } from "@/features/base/constants";
import {
  deleteManyNotif,
  queryNotification,
} from "@/features/notification/notificationSlice";
import { Notification } from "@/features/notification/notificationTypes";
import { paramsToObject } from "@/utils/utils";
import ConfirmModal from "../modals/ConfirmModal";
import NotificationTable from "../tables/NotificationTable";

function NotificationList() {
  const [checkedNotif, setCheckedNotif] = useState<Array<Notification>>([]);
  const { user, token } = useAppSelector((state) => state.auth);
  const { notifications, loading } = useAppSelector(
    (state) => state.notification,
  );
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const { search } = useLocation();

  const handleDeleteMany = async () => {
    const { success, message } = await deleteManyNotif(
      checkedNotif,
      token as string,
    );
    if (success) {
      toast.success(message);
      setCheckedNotif([]);
      if (search) {
        let queryObj = paramsToObject(search);
        queryObj["limit"] = MAX_LIMIT;
        await dispatch(queryNotification(queryObj));
      } else {
        await dispatch(queryNotification({}));
      }
      confirmPopUp();
    } else {
      toast.error(message);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    notifObj: Notification,
  ) => {
    const notif = checkedNotif.slice();
    let exists = notif.find((x) => x.id === notifObj.id);
    let index = notif.findIndex((x) => x.id === notifObj.id);
    if (e.target.checked) {
      notif.push(notifObj);
    } else {
      if (exists) {
        notif.splice(index, 1);
      }
    }
    setCheckedNotif(notif);
  };

  const confirmPopUp = () => {
    confirmRef.current?.click();
  };

  return (
    <>
      <NotificationTable
        notifications={notifications}
        user={user}
        checkedNotif={checkedNotif}
        handleChange={handleChange}
        handleDeleteMany={confirmPopUp}
        loading={loading}
        theme={theme}
      />

      <ConfirmModal
        confirmRequest={handleDeleteMany}
        cancelRequest={confirmPopUp}
        confirmRef={confirmRef}
        msg={"Are you sure you want to delete the selected notification(s)"}
        theme={theme}
        loading={false}
      />
    </>
  );
}

export default NotificationList;

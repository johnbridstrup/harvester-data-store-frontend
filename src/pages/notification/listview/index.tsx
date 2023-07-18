import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import NotificationList from "@/components/notification/NotificationList";
import { NotificationPagination } from "@/components/pagination";
import { MAX_LIMIT } from "@/features/base/constants";
import { queryNotification } from "@/features/notification/notificationSlice";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function NotificationListView() {
  const { search } = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (search) {
      const queryObj = paramsToObject(search);
      queryObj["limit"] = MAX_LIMIT;
      dispatch(queryNotification(queryObj));
    } else {
      dispatch(queryNotification({}));
    }
  }, [dispatch, search]);
  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Notifications"} className={"display-6 mt-4 mb-4"} />

        <NotificationList />
        <NotificationPagination />
      </div>
    </MainLayout>
  );
}

export default NotificationListView;

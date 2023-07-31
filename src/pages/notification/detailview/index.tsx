import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { getNotificationById } from "@/features/notification/notificationSlice";
import NotificationDetail from "@/components/notification/NotificationDetail";
import "./styles.css";

function NotificationDetailView() {
  const params = useParams<string>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getNotificationById(Number(params.notifyId)));
  }, [dispatch, params]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Notification"}
          className={"display-6 mt-4 mb-4"}
          id={params.notifyId}
        />
        <NotificationDetail />
      </div>
    </MainLayout>
  );
}

export default NotificationDetailView;

import { useAppSelector } from "@/app/hooks";
import { darkThemeClass } from "@/utils/utils";

function NotificationDetail() {
  const { notification } = useAppSelector((state) => state.notification);
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  return (
    <div>
      <div className={`card ${cardtheme}`}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <span>
                <strong>Trigger On: </strong>
              </span>
              <div>{notification?.trigger_on}</div>
            </div>
            <div className="col-md-4">
              <span>
                <strong>Recipients: </strong>
              </span>
              <div>
                {notification?.recipients?.map((x) => x.username).join(", ")}
              </div>
            </div>
            <div className="col-md-4">
              <span>
                <strong>Criteria: </strong>
              </span>
              <div>{JSON.stringify(notification?.criteria)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetail;

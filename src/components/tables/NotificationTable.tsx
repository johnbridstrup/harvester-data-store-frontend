import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "../common";
import { LoaderDiv } from "../styled";
import { Notification } from "@/features/notification/notificationTypes";

interface User {
  id: number;
  is_superuser: boolean;
}

interface NotificationProps {
  notifications: Array<Notification>;
  handleDeleteMany: () => void;
  user?: User | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>, obj: Notification) => void;
  checkedNotif: Array<Notification>;
  loading: boolean;
  theme: string | null;
}

function NotificationTable(props: NotificationProps) {
  const tabledt = darkThemeClass("dt-table", props.theme);
  const rowdt = darkThemeClass("dt-row", props.theme);
  return (
    <div className="table-responsive">
      {props.loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <th>Trigger On</th>
              <th>Recipients</th>
              <th>Criteria</th>
              <th>
                {props.checkedNotif.length > 0 ? (
                  <button
                    onClick={props.handleDeleteMany}
                    className="btn btn-sm btn-danger"
                  >
                    DEL
                  </button>
                ) : (
                  "Action"
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.notifications.map((notif, _) => (
              <tr key={notif.id} className={`tr-hover ${rowdt}`}>
                <td>
                  <Link
                    to={`/notifications/${notif.id}`}
                    className="notif-link"
                  >
                    {notif.trigger_on}
                  </Link>
                </td>
                <td>{notif.recipients?.map((x) => x.username)?.join(", ")}</td>
                <td>{JSON.stringify(notif.criteria)}</td>
                <td>
                  {((props.user?.id as number) === notif.creator.id ||
                    props.user?.is_superuser === true) && (
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={(e) => props.handleChange(e, notif)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NotificationTable;

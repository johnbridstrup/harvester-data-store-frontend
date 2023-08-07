import { API_URL, ERRORREPORT_TRIGGER } from "../base/constants";
import { BaseService, axiosService } from "../base/services";

export const NOTIFICATION_URL = `${API_URL}/notifications/`;

class NotificationService extends BaseService {
  constructor(url: string) {
    super(url);
  }

  public create = async (queryObj: Record<string, any>, token: string) => {
    const recipients = queryObj["recipients"];
    delete queryObj["recipients"];
    const searchParams = new URLSearchParams(queryObj);
    const response = await axiosService.post(
      `${this.url}?${searchParams.toString()}`,
      token,
      { recipients, trigger_on: ERRORREPORT_TRIGGER },
    );
    return response;
  };
}

const notificationService = new NotificationService(NOTIFICATION_URL);

export default notificationService;

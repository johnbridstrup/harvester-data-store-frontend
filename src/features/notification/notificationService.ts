import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const NOTIFICATION_URL = `${API_URL}/notifications/`;

class NotificationService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const notificationService = new NotificationService(NOTIFICATION_URL);

export default notificationService;

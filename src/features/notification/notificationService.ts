import { API_URL } from "../base/constants";
import { axiosService } from "../base/services";

class NotificationService {
  constructor() {}

  public NOTIFICATION_URL = `${API_URL}/notifications/`;

  public query = async (queryObj = {}, token: string) => {
    const params = new URLSearchParams(queryObj);
    const res = await axiosService.get(
      `${this.NOTIFICATION_URL}?${params.toString()}`,
      token,
    );
    return res;
  };

  public getById = async (id: string | number, token: string) => {
    const res = await axiosService.get(`${this.NOTIFICATION_URL}${id}/`, token);
    return res;
  };

  public delete = async (id: string | number, token: string | null) => {
    const response = await axiosService.delete(
      `${this.NOTIFICATION_URL}${id}/`,
      token,
    );
    return response;
  };
}

const notificationService = new NotificationService();

export default notificationService;

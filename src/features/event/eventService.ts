import { API_URL } from "../base/constants";
import { BaseService, axiosService } from "../base/services";

export const EVENTS_URL = `${API_URL}/events/`;
export const PICKSESSION_URL = `${API_URL}/picksessions/`;

class EventService extends BaseService {
  constructor(url: string) {
    super(url);
  }

  public getTags = async (url: string, token: string) => {
    const res = await axiosService.get(url, token);
    return res;
  };
}

class PickSessionService extends EventService {
  constructor(url: string) {
    super(url);
  }
}

export const eventService = new EventService(EVENTS_URL);
export const pickSessionService = new PickSessionService(PICKSESSION_URL);

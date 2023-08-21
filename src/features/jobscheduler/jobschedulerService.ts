import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const SCHEDULEDJOBS_URL = `${API_URL}/scheduledjobs/`;

class JobSchedulerService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const jobschedulerService = new JobSchedulerService(SCHEDULEDJOBS_URL);
export default jobschedulerService;

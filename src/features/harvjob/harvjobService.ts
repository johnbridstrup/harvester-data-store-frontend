import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const JOBTYPES_URL = `${API_URL}/jobtypes/`;
export const JOBSCHEMAS_URL = `${API_URL}/jobschemas/`;
export const JOBS_URL = `${API_URL}/harvjobs/`;
export const JOBRESULTS_URL = `${API_URL}/jobresults/`;

class HarvJobService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const harvjobService = new HarvJobService(JOBS_URL);
export default harvjobService;

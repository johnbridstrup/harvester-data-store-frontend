import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const HARVESTERS_URL = `${API_URL}/harvesters/`;
export const FRUITS_URL = `${API_URL}/fruits/`;
export const HARVESTER_HISTORY_URL = `${API_URL}/harvesterhistory/`;
export const harvester_version_report_url = (id: number): string =>
  `${HARVESTERS_URL}${id}/versions/`;

class HarvesterService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const harvesterService = new HarvesterService(HARVESTERS_URL);
export default harvesterService;

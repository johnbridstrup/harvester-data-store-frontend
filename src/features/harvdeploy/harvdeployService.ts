import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const HARVESTER_RELEASE_URL = `${API_URL}/release/`;
export const HARVESTER_VERSION_URL = `${API_URL}/harvversion/`;

class HarvDeployService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const harvdeployService = new HarvDeployService(HARVESTER_RELEASE_URL);
export default harvdeployService;

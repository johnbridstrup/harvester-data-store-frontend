import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";
import { HARVESTERS_URL } from "../harvester/harvesterService";

export const AFTCONFIG_URL = `${API_URL}aftconfigs/`;
export const harvester_config_url = (id: number) =>
  `${HARVESTERS_URL}${id}/config/`;

class AFTConfigService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const aftconfigService = new AFTConfigService(AFTCONFIG_URL);
export default aftconfigService;

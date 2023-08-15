import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const AUTODIAG_REPORT_URL = `${API_URL}/autodiagnostics/`;

class AutodiagnoticService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const autodiagnoticService = new AutodiagnoticService(AUTODIAG_REPORT_URL);
export default autodiagnoticService;

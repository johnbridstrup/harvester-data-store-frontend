import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const LOGSESSION_URL = `${API_URL}/logsessions/`;
export const LOGFILES_URL = `${API_URL}/logfiles/`;
export const LOGVIDEOS_URL = `${API_URL}/logvideos/`;

class LogParserService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const logparserService = new LogParserService(LOGSESSION_URL);
export default logparserService;

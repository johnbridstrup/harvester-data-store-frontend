import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const EMULATORSTATS_URL = `${API_URL}/emustats/`;

class EmulatorstatService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const emulatorstatService = new EmulatorstatService(EMULATORSTATS_URL);

export default emulatorstatService;

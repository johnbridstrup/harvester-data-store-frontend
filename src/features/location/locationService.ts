import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const LOCATION_URL = `${API_URL}/locations/`;

class LocationService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const locationService = new LocationService(LOCATION_URL);
export default locationService;

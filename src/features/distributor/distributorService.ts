import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const DISTRIBUTORS_URL = `${API_URL}/distributors/`;

class DistributorService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const distributorService = new DistributorService(DISTRIBUTORS_URL);

export default distributorService;

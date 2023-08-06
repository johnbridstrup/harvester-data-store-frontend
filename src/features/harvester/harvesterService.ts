import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const HARVESTERS_URL = `${API_URL}/harvesters/`;
export const FRUITS_URL = `${API_URL}/fruits/`;
export const HARVESTER_HISTORY_URL = `${API_URL}/harvesterhistory/`;

class HarvesterService extends BaseService {
  constructor(url: string) {
    super(url);
  }

  public queryFruit = async (
    url: string,
    queryObj: Record<string, any>,
    token: string,
  ) => {
    return this.factoryQuery(url, queryObj, token);
  };

  public getFruit = async (url: string, id: number, token: string) => {
    return this.factoryGet(url, id, token);
  };
}

const harvesterService = new HarvesterService(HARVESTERS_URL);
export default harvesterService;

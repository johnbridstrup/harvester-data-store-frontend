import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const EXCEPTION_URL = `${API_URL}/exceptions/`;
export const EXCEPTION_CODE_URL = `${API_URL}/exceptioncodes/`;

class ExceptionService extends BaseService {
  constructor(url: string) {
    super(url);
  }

  public queryExceptionCode = async (
    url: string,
    queryObj: Record<string, any>,
    token: string,
  ) => {
    return this.factoryQuery(url, queryObj, token);
  };

  public getExceptionCode = async (url: string, id: number, token: string) => {
    return this.factoryGet(url, id, token);
  };
}

const exceptionService = new ExceptionService(EXCEPTION_URL);

export default exceptionService;

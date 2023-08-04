import { API_URL } from "../base/constants";
import { BaseService, axiosService } from "../base/services";

export const ERROR_REPORT_URL = `${API_URL}/errorreports/`;
export const ERROR_PARETO_URL = `${API_URL}/exceptions/pareto/`;

class ErrorreportService extends BaseService {
  constructor(url: string) {
    super(url);
  }

  public genPareto = async (paramsObj: Record<string, any>, token: string) => {
    const searchParams = new URLSearchParams(paramsObj);
    const res = await axiosService.get(
      `${ERROR_PARETO_URL}?${searchParams.toString()}`,
      token,
    );
    return res;
  };
}

const errorreportService = new ErrorreportService(ERROR_REPORT_URL);
export default errorreportService;

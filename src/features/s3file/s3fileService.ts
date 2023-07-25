import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const S3FILE_URL = `${API_URL}/s3files/`;

class S3FileService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const s3fileService = new S3FileService(S3FILE_URL);
export default s3fileService;

import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const MIGRATION_URL = `${API_URL}/migrations/`;

class MigrationService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const migrationService = new MigrationService(MIGRATION_URL);
export default migrationService;

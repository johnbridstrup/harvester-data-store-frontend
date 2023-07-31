import { API_URL } from "../base/constants";
import { BaseService } from "../base/services";

export const USERS_URL = `${API_URL}/users/profiles/`;

class UserService extends BaseService {
  constructor(url: string) {
    super(url);
  }
}

const userService = new UserService(USERS_URL);
export default userService;

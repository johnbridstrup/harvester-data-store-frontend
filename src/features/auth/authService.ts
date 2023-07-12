import { API_URL } from "../base/constants";
import { axiosService } from "../base/services";
import { ChangePassword, LoginData, TokenData, User } from "./authTypes";

class AuthService {
  constructor() {}

  public LOGIN_URL = `${API_URL}/users/login/`;
  public LOGOUT_URL = `${API_URL}/users/logout/`;
  public USER_PROFILE_URL = `${API_URL}/users/profiles/`;
  public PASSWORD_URL = `${API_URL}/users/change/password/`;

  public login = async (loginData: LoginData) => {
    const res = await axiosService.post(this.LOGIN_URL, undefined, loginData);
    if (res.data.data) {
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.data.token));
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
    }
    return res;
  };

  public logout = async (tokenData: TokenData) => {
    const response = await axiosService.post(
      this.LOGOUT_URL,
      undefined,
      tokenData,
    );
    if (response.status === "success") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
    }
    return response;
  };

  public update = async (id: string, token: string, userData: User) => {
    const response = await axiosService.patch(
      `${this.USER_PROFILE_URL}${id}/`,
      token,
      userData,
    );
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response;
  };

  public changePassword = async (token: string, userData: ChangePassword) => {
    const response = await axiosService.post(
      `${this.PASSWORD_URL}`,
      token,
      userData,
    );
    return response;
  };

  public confirmPassword = async (userData: LoginData) => {
    const res = await axiosService.post(this.LOGIN_URL, undefined, userData);
    return res;
  };

  public authListener = async (id: string, token: string) => {
    const response = await axiosService.get(
      `${this.USER_PROFILE_URL}${id}/`,
      token,
    );
    return response;
  };
}

const authService = new AuthService();

export default authService;

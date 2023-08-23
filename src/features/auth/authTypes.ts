export interface LoginData {
  username: string;
  password: string;
}

export interface TokenData {
  token: string | null;
}

export interface Profile {
  id: number;
  slack_id: string;
  role: string;
  user: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  profile: Profile;
}

export interface ChangePassword {
  current_password: string;
  new_password: string;
}

export interface UpdateProfile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  profile: {
    slack_id: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null | undefined;
  token: string | null;
  loading: boolean;
  editting: boolean;
  confirming: boolean;
  errorCode: string | null | unknown;
  errorMsg: string | null | unknown;
}

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { status } from "../base/constants";
import authService from "./authService";
import {
  ChangePassword,
  AuthState,
  LoginData,
  TokenData,
  UpdateProfile,
} from "./authTypes";

const isAuthenticated =
  JSON.parse(localStorage.getItem("isAuthenticated") as string) || false;
const user = JSON.parse(localStorage.getItem("user") as string) || null;
const token = JSON.parse(localStorage.getItem("token") as string) || null;

const initialState: AuthState = {
  token,
  isAuthenticated,
  loading: false,
  editting: false,
  confirming: false,
  user,
  errorCode: null,
  errorMsg: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (user: LoginData, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (tokenData: TokenData, thunkAPI) => {
    try {
      return await authService.logout(tokenData);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const invalidateCache = (error: any, dispatch: any) => {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    (error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.exception) ||
    (error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.detail &&
      JSON.stringify(error.response.data.errors.detail)) ||
    (error.response && error.response.data && error.response.data.errors) ||
    error.message ||
    error.toString();
  if (message === status.HTTP_401_UNAUTHORIZED) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("csrftoken");
    dispatch(reset());
    window.location.href = "/login";
  }
  return message;
};

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: UpdateProfile, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await authService.update(data.id, token, data);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (userData: ChangePassword, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await authService.changePassword(token, userData);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const confirmPassword = createAsyncThunk(
  "auth/confirmPassword",
  async (userData: LoginData, thunkAPI) => {
    try {
      return await authService.confirmPassword(userData);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const authListener = createAsyncThunk("auth", async (_, thunkAPI) => {
  try {
    const {
      auth: { token, user },
    } = thunkAPI.getState() as {
      auth: { token: string; user: { id: string } };
    };
    return await authService.authListener(user?.id, token);
  } catch (error) {
    console.log(error);
    const message = invalidateCache(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.data.data.token;
        state.user = action.payload.data.data.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.errorMsg = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.errorMsg = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.editting = false;
        state.user = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.editting = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(confirmPassword.pending, (state) => {
        state.confirming = true;
      })
      .addCase(confirmPassword.fulfilled, (state) => {
        state.confirming = false;
      })
      .addCase(confirmPassword.rejected, (state, action) => {
        state.confirming = false;
        state.errorMsg = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

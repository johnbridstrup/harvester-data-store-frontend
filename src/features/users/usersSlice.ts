import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import userService from "./usersService";
import { paginateRequest } from "@/features/base/services";
import { UserState } from "./usersTypes";

const initialState: UserState = {
  loading: false,
  adding: false,
  editting: false,
  user: null,
  users: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryUsers = createAsyncThunk(
  "user/queryUsers",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await userService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await userService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await userService.create(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateUser = createAsyncThunk(
  "user/paginateUser",
  async (url: string, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await paginateRequest(url, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await userService.update(data.id, token, data);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryUsers.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.adding = true;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      });
  },
});

export default userSlice.reducer;

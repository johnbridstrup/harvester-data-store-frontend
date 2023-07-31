import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import notificationService from "./notificationService";
import { paginateRequest } from "@/features/base/services";
import { NotificationState, Notification } from "./notificationTypes";

const initialState: NotificationState = {
  loading: false,
  notification: null,
  notifications: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryNotification = createAsyncThunk(
  "notification/queryNotification",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await notificationService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await notificationService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await notificationService.delete(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteManyNotif = async (
  notifs: Notification[],
  token: string,
) => {
  try {
    for (let i = 0; i < notifs.length; i++) {
      await notificationService.delete(notifs[i].id, token);
    }
    return { success: true, message: "Notification(s) deleted successfully" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const paginateNotification = createAsyncThunk(
  "notification/paginateNotification",
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

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryNotification.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action.payload;
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateNotification.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default notificationSlice.reducer;

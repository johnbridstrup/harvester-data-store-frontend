import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import jobschedulerService, { SCHEDULEDJOBS_URL } from "./jobschedulerService";
import { JobSchedulerState } from "./jobschedulerTypes";
import { paginateRequest } from "../base/services";

const initialState: JobSchedulerState = {
  loading: false,
  creating: false,
  scheduledjobs: [],
  scheduledjob: null,
  jobtypeschema: null,
  formbuilder: {
    form: {},
    submit: "",
  },
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryScheduledJob = createAsyncThunk(
  "jobscheduler/queryScheduledJob",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await jobschedulerService.query(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getScheduledJob = createAsyncThunk(
  "jobscheduler/getScheduledJob",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await jobschedulerService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getJobTypeSchema = createAsyncThunk(
  "jobscheduler/getJobTypeSchema",
  async (_, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await jobschedulerService.genericGet(
        `${SCHEDULEDJOBS_URL}create/`,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getScheduledJobForm = createAsyncThunk(
  "jobscheduler/getScheduledJobForm",
  async (url: string, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await jobschedulerService.genericGet(url, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createScheduledJob = createAsyncThunk(
  "jobscheduler/createScheduledJob",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await jobschedulerService.factoryCreate(
        data.url,
        data.data,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateScheduledJob = createAsyncThunk(
  "harvjobs/paginateScheduledJob",
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

const jobschedulerSlice = createSlice({
  name: "jobscheduler",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryScheduledJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryScheduledJob.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduledjobs = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryScheduledJob.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getScheduledJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(getScheduledJob.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduledjob = action.payload;
      })
      .addCase(getScheduledJob.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getJobTypeSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobTypeSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.jobtypeschema = action.payload;
      })
      .addCase(getJobTypeSchema.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getScheduledJobForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(getScheduledJobForm.fulfilled, (state, action) => {
        state.loading = false;
        state.formbuilder = action.payload;
      })
      .addCase(getScheduledJobForm.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createScheduledJob.pending, (state) => {
        state.creating = true;
      })
      .addCase(createScheduledJob.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createScheduledJob.rejected, (state, action) => {
        state.creating = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateScheduledJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateScheduledJob.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduledjobs = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateScheduledJob.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default jobschedulerSlice.reducer;

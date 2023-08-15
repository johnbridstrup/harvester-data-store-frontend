import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "@/features/auth/authSlice";
import { paginateRequest } from "@/features/base/services";
import { transformSensors } from "@/utils/utils";
import autodiagnosticService from "./autodiagnosticService";
import { AutodiagnosticState } from "./autodiagnosticTypes";

const initialState: AutodiagnosticState = {
  loading: false,
  pagination: {
    count: 0,
    limit: 10,
    offset: 1,
    next: null,
    previous: null,
  },
  errorMsg: null,
  reports: [],
  report: null,
  sensors: {
    finger: {},
    vacuum: {},
    touch: {},
  },
};

export const queryAutodiagReport = createAsyncThunk(
  "autodiagnostics/queryAutodiagReport",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await autodiagnosticService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getAutodiagReport = createAsyncThunk(
  "autodiagnostics/getAutodiagReport",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await autodiagnosticService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateAutodiagReport = createAsyncThunk(
  "autodiagnostics/paginateAutodiagReport",
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

const autodiagnosticSlice = createSlice({
  name: "autodiagnostics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryAutodiagReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryAutodiagReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryAutodiagReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getAutodiagReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAutodiagReport.fulfilled, (state, action) => {
        state.loading = false;
        const report = action.payload;
        state.report = report;
        const { vacuum, finger, touch } = transformSensors(
          report.run_data?.sensors,
        );
        state.sensors.finger = finger;
        state.sensors.touch = touch;
        state.sensors.vacuum = vacuum;
      })
      .addCase(getAutodiagReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateAutodiagReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateAutodiagReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateAutodiagReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default autodiagnosticSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getServicesInError,
  transformErrorReport,
  transformExceptions,
  transformReportDetail,
  transformSysmonKeys,
  transformSysmonReport,
} from "@/utils/utils";
import { invalidateCache } from "../auth/authSlice";
import errorreportService from "./errorreportService";
import { paginateRequest } from "@/features/base/services";
import { ErrorReportState } from "./errorreportTypes";

const initialState: ErrorReportState = {
  loading: false,
  pagination: {
    count: 0,
    limit: 10,
    offset: 1,
    next: null,
    previous: null,
  },
  reports: [],
  report: null,
  timezone: null,
  errorMsg: null,
  queryUrl: null,
  paretos: [],
  transformed: {
    sysmonkeys: [],
    sysmonreport: {},
    reportobj: null,
    erroredservices: [],
    exceptions: [],
  },
  internal: {
    hovered: null,
    searchObj: null,
  },
};

export const queryErrorReport = createAsyncThunk(
  "errorreport/queryErrorReport",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await errorreportService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateErrorReport = createAsyncThunk(
  "errorreport/paginateErrorReport",
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

export const getErrorReport = createAsyncThunk(
  "errorreport/getErrorReport",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await errorreportService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const generatePareto = createAsyncThunk(
  "errorreport/generatePareto",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await errorreportService.genPareto(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const errorreportSlice = createSlice({
  name: "errorreport",
  initialState,
  reducers: {
    timezoneUpdate: (state, action) => {
      state.timezone = action.payload;
    },
    copyQueryUrl: (state, action) => {
      state.queryUrl = action.payload;
    },
    hoverEffect: (state, action) => {
      state.internal.hovered = action.payload;
    },
    cacheParamsObj: (state, action) => {
      state.internal.searchObj = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryErrorReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryErrorReport.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
        state.reports = transformErrorReport(action.payload.results);
      })
      .addCase(queryErrorReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateErrorReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateErrorReport.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
        state.reports = transformErrorReport(action.payload.results);
      })
      .addCase(paginateErrorReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getErrorReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getErrorReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        let report = action.payload;
        let sysreport = transformSysmonReport(
          report.report?.data?.sysmon_report,
        );
        let exceptions = transformExceptions(report.exceptions);
        state.transformed.reportobj = transformReportDetail(report);
        state.transformed.sysmonreport = sysreport;
        let services = getServicesInError(exceptions, sysreport);
        state.transformed.erroredservices = services;
        state.transformed.sysmonkeys = transformSysmonKeys(
          Object.keys(sysreport),
          services,
          sysreport,
        );
        state.transformed.exceptions = exceptions;
      })
      .addCase(getErrorReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(generatePareto.pending, (state) => {
        state.loading = true;
      })
      .addCase(generatePareto.fulfilled, (state, action) => {
        state.loading = false;
        state.paretos = action.payload;
      })
      .addCase(generatePareto.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export const { timezoneUpdate, copyQueryUrl, hoverEffect, cacheParamsObj } =
  errorreportSlice.actions;
export default errorreportSlice.reducer;

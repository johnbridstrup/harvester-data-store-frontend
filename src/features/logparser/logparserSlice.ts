import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  logFilter,
  findLogIndex,
  sortServices,
  uniqueVideoTabs,
} from "@/utils/utils";
import { invalidateCache } from "../auth/authSlice";
import logparserService, {
  LOGFILES_URL,
  LOGVIDEOS_URL,
} from "./logparserService";
import { paginateRequest } from "@/features/base/services";
import { LogParserState } from "./logparserTypes";

const initialState: LogParserState = {
  loading: false,
  uploading: false,
  logsessions: [],
  logsession: null,
  logfile: null,
  oglogfile: null,
  logvideo: null,
  currentMarker: null,
  currentIndex: null,
  internal: {
    harv_id: null,
    services: [],
    robots: [],
    videos: [],
    search: {
      searchText: null,
      content: [],
      currentIndex: null,
      countIndex: 0,
    },
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

export const queryLogSession = createAsyncThunk(
  "logparser/queryLogSession",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await logparserService.query(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getLogSession = createAsyncThunk(
  "logparser/getLogSession",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await logparserService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createLogSession = createAsyncThunk(
  "logparser/createLogSession",
  async (data: object, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await logparserService.upload(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateLogSession = createAsyncThunk(
  "logparser/paginateLogSession",
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

export const getLogFile = createAsyncThunk(
  "logparser/getLogFile",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      // cache log files by id in session
      let cachedData = sessionStorage.getItem(String(id));
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        let data = await logparserService.factoryGet(LOGFILES_URL, id, token);
        try {
          sessionStorage.setItem(String(id), JSON.stringify(data));
        } catch (error) {
          console.log(error);
        }
        return data;
      }
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const queryLogVideo = createAsyncThunk(
  "logparser/queryLogVideo",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await logparserService.factoryQuery(LOGVIDEOS_URL, data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const logparserSlice = createSlice({
  name: "logparser",
  initialState,
  reducers: {
    setMarker: (state, action) => {
      let payload = action.payload;
      state.currentMarker = payload.log.timestamp;
      state.currentIndex = payload.index;
    },
    clearMarker: (state) => {
      state.currentMarker = null;
    },
    setCurrIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    searchLog: (state, action) => {
      if (action.payload) {
        let filtered = logFilter(action.payload, state.oglogfile?.content);
        state.internal.search.searchText = action.payload;

        if (state.oglogfile?.file_name.endsWith(".dump")) {
          state.internal.search.currentIndex = 0;
          state.internal.search.countIndex = 0;
          state.currentIndex = 0;
          state.internal.search.content = filtered;
          let logObj = JSON.parse(JSON.stringify(state.logfile));
          logObj.content = filtered;
          state.logfile = logObj;
        } else {
          let objIndex = findLogIndex(state.oglogfile?.content, filtered[0]);
          state.internal.search.currentIndex = objIndex;
          state.internal.search.countIndex = 0;
          state.currentIndex = objIndex;
          state.internal.search.content = filtered;
        }
      } else {
        state.internal.search.currentIndex = null;
        state.internal.search.countIndex = 0;
        state.internal.search.content = [];
      }
    },
    scrollUpIndex: (state) => {
      let current = state.internal.search.countIndex - 1;
      if (
        state.internal.search.searchText &&
        state.internal.search.content[current]
      ) {
        if (state.oglogfile?.file_name.endsWith(".dump")) {
          state.internal.search.currentIndex = current;
          state.internal.search.countIndex = current;
          state.currentIndex = current;
        } else {
          let obj = state.internal.search.content[current];
          let objIndex = findLogIndex(state.oglogfile?.content, obj);
          state.internal.search.currentIndex = objIndex;
          state.internal.search.countIndex = current;
          state.currentIndex = objIndex;
        }
      }
    },
    scrollDownIndex: (state) => {
      let current = state.internal.search.countIndex + 1;
      if (
        state.internal.search.searchText &&
        state.internal.search.content[current]
      ) {
        if (state.oglogfile?.file_name.endsWith(".dump")) {
          state.internal.search.currentIndex = current;
          state.internal.search.countIndex = current;
          state.currentIndex = current;
        } else {
          let obj = state.internal.search.content[current];
          let objIndex = findLogIndex(state.oglogfile?.content, obj);
          state.internal.search.currentIndex = objIndex;
          state.internal.search.countIndex = current;
          state.currentIndex = objIndex;
        }
      }
    },
    clearSearch: (state) => {
      state.internal.search.searchText = null;
      state.internal.search.currentIndex = null;
      state.internal.search.countIndex = 0;
      state.internal.search.content = [];
      state.logfile = state.oglogfile;
    },
    tabChangeSearch: (state) => {
      let searchText = state.internal.search.searchText;
      if (searchText) {
        let filtered = logFilter(searchText, state.oglogfile?.content);
        state.internal.search.countIndex = 0;
        state.internal.search.content = filtered;
        if (state.oglogfile?.file_name.endsWith(".dump")) {
          let logObj = JSON.parse(JSON.stringify(state.logfile));
          logObj.content = filtered;
          state.logfile = logObj;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryLogSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryLogSession.fulfilled, (state, action) => {
        state.loading = false;
        state.logsessions = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryLogSession.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getLogSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLogSession.fulfilled, (state, action) => {
        let payload = action.payload;
        state.loading = false;
        state.logsession = payload;
        state.internal.services = sortServices(payload.logs?.services || []);
        state.internal.robots = payload.logs?.robots || [];
        state.internal.harv_id = payload.logs?.harv_id;
        state.internal.videos = uniqueVideoTabs(payload.logs?.videos || []);
      })
      .addCase(getLogSession.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createLogSession.pending, (state) => {
        state.uploading = true;
      })
      .addCase(createLogSession.fulfilled, (state, action) => {
        state.uploading = false;
        state.logsession = action.payload;
      })
      .addCase(createLogSession.rejected, (state, action) => {
        state.uploading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateLogSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateLogSession.fulfilled, (state, action) => {
        state.loading = false;
        state.logsessions = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateLogSession.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getLogFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLogFile.fulfilled, (state, action) => {
        state.loading = false;
        state.logfile = action.payload;
        state.oglogfile = action.payload;
      })
      .addCase(getLogFile.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryLogVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryLogVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.logvideo = action.payload.results[0] || {};
      })
      .addCase(queryLogVideo.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export const {
  setMarker,
  clearMarker,
  searchLog,
  setCurrIndex,
  scrollUpIndex,
  scrollDownIndex,
  clearSearch,
  tabChangeSearch,
} = logparserSlice.actions;
export default logparserSlice.reducer;

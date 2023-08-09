import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import harvesterService, {
  FRUITS_URL,
  HARVESTER_HISTORY_URL,
  harvester_version_report_url,
} from "./harvesterService";
import { HarvesterState } from "./harvesterTypes";
import { paginateRequest } from "../base/services";

const initialState: HarvesterState = {
  loading: false,
  editting: false,
  adding: false,
  fruit: null,
  fruits: [],
  harvester: null,
  harvesters: [],
  harvversion: [],
  historyObj: null,
  historys: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryFruit = createAsyncThunk(
  "harvester/queryFruit",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.factoryQuery(FRUITS_URL, queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getFruit = createAsyncThunk(
  "harvester/getFruit",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.factoryGet(FRUITS_URL, id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const queryHarvester = createAsyncThunk(
  "harvester/queryHarvester",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getHarvester = createAsyncThunk(
  "harvester/getHarvester",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createHarvester = createAsyncThunk(
  "harvester/createHarvester",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.create(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateHarvester = createAsyncThunk(
  "harvester/updateHarvester",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.update(data.id, token, data);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateHarvester = createAsyncThunk(
  "harvester/paginateHarvester",
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

export const queryHarvesterVersion = createAsyncThunk(
  "harvester/queryHarvesterVersion",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.factoryQuery(
        harvester_version_report_url(queryObj.id),
        queryObj,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateHarvesterVersion = createAsyncThunk(
  "harvester/paginateHarvesterVersion",
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

export const queryHarvesterHistory = createAsyncThunk(
  "harvester/queryHarvesterHistory",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.factoryQuery(
        HARVESTER_HISTORY_URL,
        queryObj,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getHarvesterHistory = createAsyncThunk(
  "harvester/getHarvesterHistory",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvesterService.factoryGet(
        HARVESTER_HISTORY_URL,
        id,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateHarvesterHistory = createAsyncThunk(
  "harvester/paginateHarvesterHistory",
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

const codeslice = createSlice({
  name: "harvester",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryFruit.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryFruit.fulfilled, (state, action) => {
        state.loading = false;
        state.fruits = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryFruit.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getFruit.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFruit.fulfilled, (state, action) => {
        state.loading = false;
        state.fruit = action.payload;
      })
      .addCase(getFruit.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryHarvester.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryHarvester.fulfilled, (state, action) => {
        state.loading = false;
        state.harvesters = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryHarvester.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getHarvester.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHarvester.fulfilled, (state, action) => {
        state.loading = false;
        state.harvester = action.payload;
      })
      .addCase(getHarvester.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createHarvester.pending, (state) => {
        state.adding = true;
      })
      .addCase(createHarvester.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(createHarvester.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateHarvester.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateHarvester.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(updateHarvester.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateHarvester.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateHarvester.fulfilled, (state, action) => {
        state.loading = false;
        state.harvesters = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateHarvester.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryHarvesterVersion.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryHarvesterVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.harvversion = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryHarvesterVersion.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateHarvesterVersion.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateHarvesterVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.harvversion = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateHarvesterVersion.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryHarvesterHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryHarvesterHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historys = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryHarvesterHistory.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getHarvesterHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHarvesterHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyObj = action.payload;
      })
      .addCase(getHarvesterHistory.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateHarvesterHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateHarvesterHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historys = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateHarvesterHistory.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default codeslice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import emulatorstatsService, { EMULATORSTATS_URL } from "./emulatorstatService";
import { paginateRequest } from "../base/services";
import { EmulatorstatState } from "./emulatorstatTypes";

const initialState: EmulatorstatState = {
  loading: false,
  errorMsg: null,
  emustats: [],
  emustatsObj: null,
  tags: [],
  pagination: {
    count: 0,
    limit: 10,
    offset: 1,
    next: null,
    previous: null,
  },
};

export const queryEmulatorstat = createAsyncThunk(
  "emulatorstats/queryEmulatorstat",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await emulatorstatsService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getEmulatorstat = createAsyncThunk(
  "emulatorstats/getEmulatorstat",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await emulatorstatsService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateEmulatorstats = createAsyncThunk(
  "emulatorstats/paginateEmulatorstats",
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

export const getEmulatorstatTags = createAsyncThunk(
  "emulatorstats/getEmulatorstatTags",
  async (_, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await emulatorstatsService.factoryQuery(
        `${EMULATORSTATS_URL}tags/`,
        {},
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const emulatorstatsSlice = createSlice({
  name: "emulatorstats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryEmulatorstat.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryEmulatorstat.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
        state.emustats = action.payload.results;
      })
      .addCase(queryEmulatorstat.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getEmulatorstat.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmulatorstat.fulfilled, (state, action) => {
        state.loading = false;
        state.emustatsObj = action.payload;
      })
      .addCase(getEmulatorstat.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateEmulatorstats.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateEmulatorstats.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
        state.emustats = action.payload.results;
      })
      .addCase(paginateEmulatorstats.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getEmulatorstatTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmulatorstatTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;
      })
      .addCase(getEmulatorstatTags.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default emulatorstatsSlice.reducer;

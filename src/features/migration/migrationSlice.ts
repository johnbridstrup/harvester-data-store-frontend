import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import migrationService, { MIGRATION_URL } from "./migrationService";
import { paginateRequest } from "../base/services";
import { MigrationState } from "./migrationTypes";

const initialState: MigrationState = {
  loading: false,
  queueing: false,
  migration: null,
  migrations: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryMigrationLog = createAsyncThunk(
  "migration/queryMigrationLog",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await migrationService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getMigrationLog = createAsyncThunk(
  "migration/getMigrationLog",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await migrationService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const execMigration = createAsyncThunk(
  "migration/execMigration",
  async (_, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await migrationService.factoryQuery(
        `${MIGRATION_URL}migrate/`,
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

export const paginateMigration = createAsyncThunk(
  "migration/paginateMigration",
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

const migrationSlice = createSlice({
  name: "migration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryMigrationLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryMigrationLog.fulfilled, (state, action) => {
        state.loading = false;
        state.migrations = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryMigrationLog.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getMigrationLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMigrationLog.fulfilled, (state, action) => {
        state.loading = false;
        state.migration = action.payload;
      })
      .addCase(getMigrationLog.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(execMigration.pending, (state) => {
        state.queueing = true;
      })
      .addCase(execMigration.fulfilled, (state) => {
        state.queueing = false;
      })
      .addCase(execMigration.rejected, (state, action) => {
        state.queueing = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateMigration.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateMigration.fulfilled, (state, action) => {
        state.loading = false;
        state.migrations = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateMigration.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default migrationSlice.reducer;

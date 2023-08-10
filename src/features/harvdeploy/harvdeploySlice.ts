import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import harvdeployService, { HARVESTER_VERSION_URL } from "./harvdeployService";
import { paginateRequest } from "../base/services";
import { HarvDeployState } from "./harvdeployTypes";

const initialState: HarvDeployState = {
  loading: false,
  editting: false,
  harvrelease: null,
  harvreleases: [],
  harvversions: [],
  harvversion: null,
  errorMsg: null,
  tags: [],
  installed: [],
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryRelease = createAsyncThunk(
  "harvdeploy/queryRelease",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getRelease = createAsyncThunk(
  "harvdeploy/getRelease",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateRelease = createAsyncThunk(
  "harvdeploy/updateRelease",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.update(data.id, token, data);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateRelease = createAsyncThunk(
  "harvdeploy/paginateRelease",
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

export const queryVersion = createAsyncThunk(
  "harvdeploy/queryVersion",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.factoryQuery(
        HARVESTER_VERSION_URL,
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

export const getVersion = createAsyncThunk(
  "harvdeploy/getVersion",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.factoryGet(
        HARVESTER_VERSION_URL,
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

export const paginateVersion = createAsyncThunk(
  "harvdeploy/paginateVersion",
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

export const queryReleaseTags = createAsyncThunk(
  "harvdeploy/queryReleaseTags",
  async (_, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.factoryQuery(
        `${harvdeployService.url}tags/`,
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

export const installedHarvesters = createAsyncThunk(
  "harvdeploy/installedHarvesters",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvdeployService.factoryQuery(
        `${harvdeployService.url}${id}/harvesters/`,
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

export const paginateInstalled = createAsyncThunk(
  "harvdeploy/paginateInstalled",
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

const harvdeploySlice = createSlice({
  name: "harvdeploy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryRelease.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryRelease.fulfilled, (state, action) => {
        state.loading = false;
        state.harvreleases = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryRelease.rejected, (state, action) => {
        state.loading = true;
        state.errorMsg = action.payload;
      })
      .addCase(getRelease.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRelease.fulfilled, (state, action) => {
        state.loading = false;
        state.harvrelease = action.payload;
      })
      .addCase(getRelease.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateRelease.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateRelease.fulfilled, (state, action) => {
        state.editting = false;
        state.harvrelease = action.payload.data;
      })
      .addCase(updateRelease.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateRelease.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateRelease.fulfilled, (state, action) => {
        state.loading = false;
        state.harvreleases = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateRelease.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryVersion.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.harvversions = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryVersion.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getVersion.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.harvversion = action.payload;
      })
      .addCase(getVersion.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateVersion.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.harvversions = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateVersion.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryReleaseTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryReleaseTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;
      })
      .addCase(queryReleaseTags.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(installedHarvesters.pending, (state) => {
        state.loading = true;
      })
      .addCase(installedHarvesters.fulfilled, (state, action) => {
        state.loading = false;
        state.installed = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(installedHarvesters.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateInstalled.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateInstalled.fulfilled, (state, action) => {
        state.loading = false;
        state.installed = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateInstalled.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default harvdeploySlice.reducer;

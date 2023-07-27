import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { paginateRequest } from "@/features/base/services";
import { invalidateCache } from "../auth/authSlice";
import distributorService from "./distributorService";
import { DistributorState } from "./distributorTypes";

const initialState: DistributorState = {
  loading: false,
  adding: false,
  editting: false,
  distributor: null,
  distributors: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryDistributor = createAsyncThunk(
  "distributor/queryDistributor",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await distributorService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getDistributor = createAsyncThunk(
  "distributor/getDistributor",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await distributorService.getById(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createDistributor = createAsyncThunk(
  "distributor/createDistributor",
  async (data: { name: string }, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await distributorService.create(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateDistributor = createAsyncThunk(
  "distributor/updateDistributor",
  async (data: { name: string; id: number }, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await distributorService.update(data.id, token, data);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateDistributor = createAsyncThunk(
  "distributor/paginateDistributor",
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

const distributorSlice = createSlice({
  name: "distributor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryDistributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryDistributor.fulfilled, (state, action) => {
        state.loading = false;
        state.distributors = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryDistributor.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getDistributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDistributor.fulfilled, (state, action) => {
        state.loading = false;
        state.distributor = action.payload;
      })
      .addCase(getDistributor.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createDistributor.pending, (state) => {
        state.adding = true;
      })
      .addCase(createDistributor.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(createDistributor.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateDistributor.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateDistributor.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(updateDistributor.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateDistributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateDistributor.fulfilled, (state, action) => {
        state.loading = false;
        state.distributors = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateDistributor.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default distributorSlice.reducer;

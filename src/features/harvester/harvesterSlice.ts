import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import harvesterService, { FRUITS_URL } from "./harvesterService";
import { HarvesterState } from "./harvesterTypes";

const initialState: HarvesterState = {
  loading: false,
  fruit: null,
  fruits: [],
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
      return await harvesterService.queryFruit(FRUITS_URL, queryObj, token);
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
      return await harvesterService.getFruit(FRUITS_URL, id, token);
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
      });
  },
});

export default codeslice.reducer;

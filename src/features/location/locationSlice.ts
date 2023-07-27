import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import locationService from "./locationService";
import { paginateRequest } from "@/features/base/services";
import { LocationState } from "./locationTypes";

const initialState: LocationState = {
  loading: false,
  location: null,
  locations: [],
  errorMsg: null,
  adding: false,
  editting: false,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryLocation = createAsyncThunk(
  "location/queryLocation",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await locationService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getLocation = createAsyncThunk(
  "location/getLocation",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await locationService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await locationService.create(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await locationService.update(data.id, token, data);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateLocation = createAsyncThunk(
  "location/paginateLocation",
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

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryLocation.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.location = action.payload;
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createLocation.pending, (state) => {
        state.adding = true;
      })
      .addCase(createLocation.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateLocation.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateLocation.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateLocation.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default locationSlice.reducer;

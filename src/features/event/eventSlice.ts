import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import {
  EVENTS_URL,
  PICKSESSION_URL,
  eventService,
  pickSessionService,
} from "./eventService";
import { paginateRequest } from "@/features/base/services";
import { EventState } from "./eventTypes";

const initialState: EventState = {
  loading: false,
  event: null,
  events: [],
  picksession: null,
  picksessions: [],
  tags: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const getEvent = createAsyncThunk(
  "event/getEvent",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await eventService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateEvent = createAsyncThunk(
  "event/paginateEvent",
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

export const queryEvent = createAsyncThunk(
  "event/queryEvent",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await eventService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getEventTags = createAsyncThunk(
  "event/getEventTags",
  async (_, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await eventService.getTags(`${EVENTS_URL}tags/`, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const queryPickSession = createAsyncThunk(
  "event/queryPickSession",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await pickSessionService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPickSession = createAsyncThunk(
  "event/getPickSession",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await pickSessionService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginatePickSession = createAsyncThunk(
  "event/paginatePickSession",
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

export const getPickSessionTags = createAsyncThunk(
  "event/getPickSessionTags",
  async (_, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await pickSessionService.getTags(`${PICKSESSION_URL}tags/`, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateEvent.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryEvent.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getEventTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;
      })
      .addCase(getEventTags.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryPickSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryPickSession.fulfilled, (state, action) => {
        state.loading = false;
        state.picksessions = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryPickSession.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getPickSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPickSession.fulfilled, (state, action) => {
        state.loading = false;
        state.picksession = action.payload;
      })
      .addCase(getPickSession.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginatePickSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginatePickSession.fulfilled, (state, action) => {
        state.loading = false;
        state.picksessions = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginatePickSession.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getPickSessionTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPickSessionTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;
      })
      .addCase(getPickSessionTags.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default eventSlice.reducer;

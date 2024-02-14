import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createBarData } from "@/utils/utils";
import { invalidateCache } from "../auth/authSlice";
import exceptionService, {
  EXCEPTION_CODE_URL,
  TB_ENDPOINT,
} from "./exceptionService";
import { ExceptionState } from "./exceptionTypes";

const initialState: ExceptionState = {
  loading: false,
  exceptioncodes: [],
  exceptioncode: null,
  errorMsg: null,
  pagination: {
    count: 0,
    limit: 10,
    next: null,
    previous: null,
    offset: 1,
  },
  tracebackbreakdown: null,
  internal: {
    breakdown: null,
    exception: null,
    counts: [],
    keys: [],
    xvalue: "",
    tracebackIndex: 0,
  },
};

export const queryExceptionCode = createAsyncThunk(
  "exception/queryExceptionCode",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await exceptionService.queryExceptionCode(
        EXCEPTION_CODE_URL,
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

export const getExceptionCode = createAsyncThunk(
  "exception/getExceptionCode",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await exceptionService.getExceptionCode(
        EXCEPTION_CODE_URL,
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

export const queryTBBreakdown = createAsyncThunk(
  "exception/queryTBBreakdown",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await exceptionService.queryTBBreakdown(
        TB_ENDPOINT,
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

const codeslice = createSlice({
  name: "exception",
  initialState,
  reducers: {
    cacheException: (state, action) => {
      let payload = action.payload;
      if (payload.xvalue) {
        state.internal.xvalue = payload.xvalue;
        if (state.tracebackbreakdown?.breakdown) {
          state.internal.breakdown =
            state.tracebackbreakdown.breakdown[payload.xvalue];
        }
      }
      state.internal.exception = payload.exception;
      state.internal.tracebackIndex = payload.index;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryExceptionCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryExceptionCode.fulfilled, (state, action) => {
        state.loading = false;
        state.exceptioncodes = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryExceptionCode.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getExceptionCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExceptionCode.fulfilled, (state, action) => {
        state.loading = false;
        state.exceptioncode = action.payload;
      })
      .addCase(getExceptionCode.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryTBBreakdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryTBBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        let tbbreakdown = action.payload;
        const [keys, counts] = createBarData(tbbreakdown.breakdown);
        state.tracebackbreakdown = tbbreakdown;
        state.internal.keys = keys;
        state.internal.counts = counts;
        if (keys[0]) {
          state.internal.breakdown = tbbreakdown.breakdown[keys[0]];
        }
        state.internal.exception = null;
      })
      .addCase(queryTBBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export const { cacheException } = codeslice.actions;
export default codeslice.reducer;

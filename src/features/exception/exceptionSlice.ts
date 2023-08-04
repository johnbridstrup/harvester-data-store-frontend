import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import exceptionService, { EXCEPTION_CODE_URL } from "./exceptionService";
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

const codeslice = createSlice({
  name: "exception",
  initialState,
  reducers: {},
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
      });
  },
});

export default codeslice.reducer;

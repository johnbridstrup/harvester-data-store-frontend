import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import s3fileService from "./s3fileService";
import { paginateRequest } from "@/features/base/services";
import { S3FileState } from "./s3fileTypes";

const initialState: S3FileState = {
  loading: false,
  flagging: false,
  s3file: null,
  s3files: [],
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryS3File = createAsyncThunk(
  "s3file/queryS3File",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await s3fileService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getS3File = createAsyncThunk(
  "s3file/getS3File",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await s3fileService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateS3File = createAsyncThunk(
  "s3file/paginateS3File",
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

export const deleteS3File = createAsyncThunk(
  "s3file/deleteS3File",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await s3fileService.delete(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const s3fileSlice = createSlice({
  name: "s3file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryS3File.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryS3File.fulfilled, (state, action) => {
        state.loading = false;
        state.s3files = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryS3File.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getS3File.pending, (state) => {
        state.loading = true;
      })
      .addCase(getS3File.fulfilled, (state, action) => {
        state.loading = false;
        state.s3file = action.payload;
      })
      .addCase(getS3File.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateS3File.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateS3File.fulfilled, (state, action) => {
        state.loading = false;
        state.s3files = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateS3File.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(deleteS3File.pending, (state) => {
        state.flagging = true;
      })
      .addCase(deleteS3File.fulfilled, (state) => {
        state.flagging = false;
      })
      .addCase(deleteS3File.rejected, (state, action) => {
        state.flagging = false;
        state.errorMsg = action.payload;
      });
  },
});

export default s3fileSlice.reducer;

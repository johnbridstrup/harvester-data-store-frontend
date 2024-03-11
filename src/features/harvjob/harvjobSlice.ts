import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invalidateCache } from "../auth/authSlice";
import harvjobService, {
  JOBRESULTS_URL,
  JOBSCHEMAS_URL,
  JOBS_URL,
  JOBTYPES_URL,
} from "./harvjobService";
import { paginateRequest } from "@/features/base/services";
import { HarvJobState } from "./harvjobTypes";

const selectOptions = JSON.parse(
  localStorage.getItem("selectOptions") as string,
);

const initialState: HarvJobState = {
  loading: false,
  adding: false,
  editting: false,
  jobtypes: [],
  jobtype: null,
  jobschemas: [],
  jobschema: null,
  jobs: [],
  job: null,
  jobresults: [],
  jobresult: null,
  jobstatuses: [],
  internal: {
    schema: selectOptions?.schema,
    jtype: selectOptions?.jtype,
    cacheSchemaOptions: selectOptions?.schemaOptions,
  },
  errorMsg: null,
  pagination: {
    next: null,
    previous: null,
    count: 0,
    limit: 10,
    offset: 1,
  },
};

export const queryJobType = createAsyncThunk(
  "harvjobs/queryJobType",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryQuery(JOBTYPES_URL, queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getJobType = createAsyncThunk(
  "harvjobs/getJobType",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryGet(JOBTYPES_URL, id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createJobType = createAsyncThunk(
  "harvjobs/createJobType",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryCreate(JOBTYPES_URL, data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateJobType = createAsyncThunk(
  "harvjobs/updateJobType",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryPatch(
        JOBTYPES_URL,
        data.id,
        token,
        data,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateJobType = createAsyncThunk(
  "harvjobs/paginateJobType",
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

export const queryJobSchema = createAsyncThunk(
  "harvjobs/queryJobSchema",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryQuery(JOBSCHEMAS_URL, queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getJobSchema = createAsyncThunk(
  "harvjobs/getJobSchema",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryGet(JOBSCHEMAS_URL, id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createJobSchema = createAsyncThunk(
  "harvjobs/createJobSchema",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryCreate(JOBSCHEMAS_URL, data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateJobSchema = createAsyncThunk(
  "harvjobs/updateJobSchema",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryPatch(
        JOBSCHEMAS_URL,
        data.id,
        token,
        data,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateJobSchema = createAsyncThunk(
  "harvjobs/paginateJobSchema",
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

export const queryJob = createAsyncThunk(
  "harvjobs/queryJob",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.query(queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getJob = createAsyncThunk(
  "harvjobs/getJob",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.get(id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createJob = createAsyncThunk(
  "harvjobs/createJob",
  async (data: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.create(data, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateJob = createAsyncThunk(
  "harvjobs/paginateJob",
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

export const queryJobResult = createAsyncThunk(
  "harvjobs/queryJobResult",
  async (queryObj: Record<string, any>, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryQuery(JOBRESULTS_URL, queryObj, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getJobResult = createAsyncThunk(
  "harvjobs/getJobResult",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.factoryGet(JOBRESULTS_URL, id, token);
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateJobResult = createAsyncThunk(
  "harvjobs/paginateJobResult",
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

export const queryJobStatus = createAsyncThunk(
  "harvjobs/queryJobStatus",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.genericGet(
        `${JOBS_URL}${id}/history/`,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const paginateJobStatus = createAsyncThunk(
  "harvjobs/paginateJobStatus",
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

export const rescheduleJob = createAsyncThunk(
  "harvjobs/rescheduleJob",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await harvjobService.genericGet(
        `${JOBS_URL}${id}/reschedule/`,
        token,
      );
    } catch (error) {
      console.log(error);
      const message = invalidateCache(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const harvjobSlice = createSlice({
  name: "harvjobs",
  initialState,
  reducers: {
    resetSelectOptions: (state) => {
      state.jobschema = null;
      state.jobs = [];
    },
    cacheSelectOptions: (state, action) => {
      state.internal.schema = action.payload.schema;
      state.internal.jtype = action.payload.jtype;
      state.internal.cacheSchemaOptions = action.payload.schemaOptions;
      localStorage.setItem("selectOptions", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryJobType.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryJobType.fulfilled, (state, action) => {
        state.loading = false;
        state.jobtypes = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryJobType.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getJobType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobType.fulfilled, (state, action) => {
        state.loading = false;
        state.jobtype = action.payload;
      })
      .addCase(getJobType.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createJobType.pending, (state) => {
        state.adding = true;
      })
      .addCase(createJobType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createJobType.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateJobType.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateJobType.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(updateJobType.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateJobType.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateJobType.fulfilled, (state, action) => {
        state.loading = false;
        state.jobtypes = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateJobType.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryJobSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryJobSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.jobschemas = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryJobSchema.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getJobSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.jobschema = action.payload;
      })
      .addCase(getJobSchema.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createJobSchema.pending, (state) => {
        state.adding = true;
      })
      .addCase(createJobSchema.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(createJobSchema.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateJobSchema.pending, (state) => {
        state.editting = true;
      })
      .addCase(updateJobSchema.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(updateJobSchema.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateJobSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateJobSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.jobtypes = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateJobSchema.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryJob.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
      })
      .addCase(getJob.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(createJob.pending, (state) => {
        state.adding = true;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.adding = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateJob.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryJobResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryJobResult.fulfilled, (state, action) => {
        state.loading = false;
        state.jobresults = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryJobResult.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(getJobResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobResult.fulfilled, (state, action) => {
        state.loading = false;
        state.jobresult = action.payload;
      })
      .addCase(getJobResult.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateJobResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateJobResult.fulfilled, (state, action) => {
        state.loading = false;
        state.jobresults = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateJobResult.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(queryJobStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.jobstatuses = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(queryJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(paginateJobStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(paginateJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.jobstatuses = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(paginateJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })
      .addCase(rescheduleJob.pending, (state) => {
        state.editting = true;
      })
      .addCase(rescheduleJob.fulfilled, (state) => {
        state.editting = false;
      })
      .addCase(rescheduleJob.rejected, (state, action) => {
        state.editting = false;
        state.errorMsg = action.payload;
      });
  },
});

export const { resetSelectOptions, cacheSelectOptions } = harvjobSlice.actions;
export default harvjobSlice.reducer;

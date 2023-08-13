import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { objectKeys, transformConfig } from "@/utils/utils";
import { invalidateCache } from "../auth/authSlice";
import aftconfigService, { harvester_config_url } from "./aftconfigService";
import { AFTConfigState } from "./aftconfigTypes";

const initialState: AFTConfigState = {
  loading: false,
  aftconfig: null,
  configkeys: [],
  errorMsg: null,
  transformed: {
    configs: {},
    errored: false,
  },
  pagination: {
    count: 0,
    offset: 1,
    limit: 10,
    previous: null,
    next: null,
  },
};

export const fullConfigReport = createAsyncThunk(
  "aftconfig/fullConfigReport",
  async (id: number, thunkAPI) => {
    try {
      const {
        auth: { token },
      } = thunkAPI.getState() as { auth: { token: string } };
      return await aftconfigService.factoryQuery(
        harvester_config_url(id),
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

const aftconfigSlice = createSlice({
  name: "aftconfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fullConfigReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fullConfigReport.fulfilled, (state, action) => {
        state.loading = false;
        const configs = action.payload.report?.data;
        const { errored, obj } = transformConfig(configs);
        state.aftconfig = action.payload;
        state.configkeys = objectKeys(configs);
        state.transformed.configs = obj;
        state.transformed.errored = errored;
      })
      .addCase(fullConfigReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export default aftconfigSlice.reducer;

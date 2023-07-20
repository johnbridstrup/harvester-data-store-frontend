import { createSlice } from "@reduxjs/toolkit";

interface HomeState {
  theme: string | null;
}

const initialState: HomeState = {
  theme: localStorage.getItem("theme"),
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setAppTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setAppTheme } = homeSlice.actions;
export default homeSlice.reducer;

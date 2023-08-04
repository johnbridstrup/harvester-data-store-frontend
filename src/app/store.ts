import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import homeReducer from "@/features/home/homeSlice";
import notificationReducer from "@/features/notification/notificationSlice";
import s3fileReducer from "@/features/s3file/s3fileSlice";
import distributorReducer from "@/features/distributor/distributorSlice";
import locationReducer from "@/features/location/locationSlice";
import exceptionReducer from "@/features/exception/exceptionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    notification: notificationReducer,
    s3file: s3fileReducer,
    distributor: distributorReducer,
    location: locationReducer,
    exception: exceptionReducer,
  },
  devTools: import.meta.env.DEV,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

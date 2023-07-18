import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import homeReducer from "@/features/home/homeSlice";
import notificationReducer from "@/features/notification/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    notification: notificationReducer,
  },
  devTools: import.meta.env.DEV,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

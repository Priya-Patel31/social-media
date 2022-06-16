import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import exploreReducer from "../features/explore/exploreSlice";
import postsReducer from "../features/posts/PostsSlice";
import usersReducer from "../features/users/usersSlice";
import bookmarkReducer from "../features/bookmark/bookmarkSlice";
import profileReducer from "../features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    users: usersReducer,
    explore: exploreReducer,
    bookmark : bookmarkReducer,
    profile: profileReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebaseApp";
import {
  BookmarkPostReturnType,
  LikePostReturnType,
  Post,
} from "../posts/posts.types";
import { likePost, bookmarkPost } from "../posts/PostsSlice";
import { exploreInitialState } from "./explore.types";

const initialState: exploreInitialState = {
  posts: [],
  fetchPostsStatus: "idle",
};

export const fetchPosts = createAsyncThunk<Post[]>(
  "explore/fetchPosts",
  async () => {
    const fetchedPosts: Post[] = [];
    const q = query(collection(db, "posts"));
    const snapshots = await getDocs(q);
    snapshots.forEach((post) => {
      fetchedPosts.push({ ...post.data(), id: post.id } as Post);
      console.log(fetchedPosts);
    });
    return fetchedPosts as Post[];
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        console.log(action.payload);
        state.posts = action.payload;
        state.fetchPostsStatus = "succeded";
      }
    );
    builder.addCase(fetchPosts.rejected, (state) => {
      state.fetchPostsStatus = "failed";
    });
    builder.addCase(fetchPosts.pending, (state) => {
      state.fetchPostsStatus = "pending";
    });
    builder.addCase(
      likePost.fulfilled,
      (state, action: PayloadAction<LikePostReturnType>) => {
        if (action.payload.explore === false) return;
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.post.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload.post;
        }
      }
    );
    builder.addCase(
      bookmarkPost.fulfilled,
      (state, action: PayloadAction<BookmarkPostReturnType>) => {
        if (!action.payload.explore) {
          return;
        }
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.post.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload.post;
        }
      }
    );
  },
});

export default exploreSlice.reducer;
// export const {} = userSlice.actions;

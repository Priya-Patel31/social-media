import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { RootState } from "../../app/store";
import { db } from "../../firebaseApp";
import { postComment } from "../comments/commentsSlice";
import {
  ActionPostReturnType,
  DeletePostParams,
  Post,
  PostCommentParams,
} from "../posts/posts.types";
import {
  likePost,
  deletePost,
  editPost,
  uploadPost,
} from "../posts/PostsSlice";
import { exploreInitialState, FetchPostReturnType } from "./explore.types";

const initialState: exploreInitialState = {
  posts: [],
  fetchPostsStatus: "idle",
  limit: 4,
  last: null,
  hasMore: true,
};

export const fetchPosts = createAsyncThunk<FetchPostReturnType>(
  "explore/fetchPosts",
  async (params, { getState }) => {
    const state = getState() as RootState;
    const posts: Post[] = [];
    let q;
    if (state.explore.last === null) {
      q = query(collection(db, "posts"), limit(state.explore.limit));
    } else {
      q = query(
        collection(db, "posts"),
        limit(state.explore.limit),
        startAfter(state.explore.last)
      );
    }
    const Snap = await getDocs(q);
    Snap.forEach(async (post) => {
      posts.push(post.data() as Post);
    });
    const last = Snap.docs[Snap.docs.length - 1];
    return { posts, last };
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    resetExploreState: (state) => {
      state.posts = [];
      state.fetchPostsStatus = "idle";
      state.hasMore = true;
      state.last = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<FetchPostReturnType>) => {
        state.posts = [...state.posts, ...action.payload.posts];
        state.last = action.payload.last;
        if (action.payload.posts.length === 0) {
          state.hasMore = false;
        }
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
      (state, action: PayloadAction<ActionPostReturnType>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.post.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload.post;
        }
      }
    );
    builder.addCase(
      deletePost.fulfilled,
      (state, action: PayloadAction<DeletePostParams>) => {
        state.posts = state.posts.filter((post) => {
          return post.id !== action.payload.postId;
        });
      }
    );
    builder.addCase(
      editPost.fulfilled,
      (state, action: PayloadAction<ActionPostReturnType>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.post.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload.post;
        }
      }
    );
    builder.addCase(
      uploadPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      }
    );
    builder.addCase(
      postComment.fulfilled,
      (state, action: PayloadAction<PostCommentParams>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.postId;
        });
        if (postIndex !== -1) {
          state.posts[postIndex].comments.unshift(action.payload.comment);
        }
      }
    );
  },
});

export default exploreSlice.reducer;
export const { resetExploreState } = exploreSlice.actions;

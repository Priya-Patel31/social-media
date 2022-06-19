import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  bookmarkPost,
  deletePost,
  editPost,
} from "../posts/PostsSlice";
import { bookmarkInitialState, bookmarkPostReturnType } from "./bookmark.types";

const initialState: bookmarkInitialState = {
  posts: [],
  bookmarkFetchPostsStatus: "idle",
};

export const fetchPosts = createAsyncThunk<Post[], string[]>(
  "bookmark/fetchPosts",
  async (postIds) => {
    const fetchedPosts: Post[] = [];
    const q = query(collection(db, "posts"), where("id", "in", postIds));
    const snapshots = await getDocs(q);
    snapshots.forEach((post) => {
      fetchedPosts.push({ ...post.data(), id: post.id } as Post);
    });
    return fetchedPosts as Post[];
  }
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    resetBookmarkState: (state) => {
      state.posts = [];
      state.bookmarkFetchPostsStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        state.posts = action.payload;
        state.bookmarkFetchPostsStatus = "succeded";
      }
    );
    builder.addCase(fetchPosts.rejected, (state) => {
      state.bookmarkFetchPostsStatus = "failed";
    });
    builder.addCase(fetchPosts.pending, (state) => {
      state.bookmarkFetchPostsStatus = "pending";
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
      bookmarkPost.fulfilled,
      (state, action: PayloadAction<bookmarkPostReturnType>) => {
        if (action.payload.isBookmarked) {
          const findIndex = state.posts.findIndex((post) => {
            return post.id === action.payload.post.id;
          });
          if (findIndex !== -1) {
            state.posts = state.posts.filter((post) => {
              return post.id !== action.payload.post.id;
            });
          }
        } else {
          state.posts.unshift(action.payload.post);
        }
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

export default bookmarkSlice.reducer;
export const { resetBookmarkState } = bookmarkSlice.actions;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseApp";
import {
  ActionPostReturnType,
  DeletePostParams,
  Post,
  PostCommentParams,
} from "../posts/posts.types";
import { deletePost, editPost, likePost } from "../posts/PostsSlice";
import { InitialStateType } from "./comment.type";

const initialState: InitialStateType = {
  post: null,
  fetchCommentStatus: "idle",
  postCommentStatus: "idle",
  isDelete: false,
};
export const getPostById = createAsyncThunk<Post, string>(
  "comments/getComments",
  async (postId) => {
    const postRef = doc(db, "posts", postId);
    const post = (await (await getDoc(postRef)).data()) as Post;
    return post;
  }
);
export const postComment = createAsyncThunk<
  PostCommentParams,
  PostCommentParams
>("comments/postComment", async ({ postId, comment }) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { comments: arrayUnion(comment) });
  return { postId, comment };
});
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetCommentState: (state) => {
      state.post = null;
      state.fetchCommentStatus = "idle";
      state.postCommentStatus = "idle";
      state.isDelete = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getPostById.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.post = action.payload;
        state.fetchCommentStatus = "succeded";
      }
    );
    builder.addCase(getPostById.pending, (state, action) => {
      state.fetchCommentStatus = "pending";
    });
    builder.addCase(getPostById.rejected, (state, action) => {
      state.fetchCommentStatus = "failed";
    });
    builder.addCase(
      postComment.fulfilled,
      (state, action: PayloadAction<PostCommentParams>) => {
        state.post?.comments.unshift(action.payload.comment);
        state.postCommentStatus = "succeded";
      }
    );
    builder.addCase(postComment.pending, (state) => {
      state.postCommentStatus = "pending";
    });
    builder.addCase(postComment.rejected, (state) => {
      state.postCommentStatus = "failed";
    });
    builder.addCase(
      likePost.fulfilled,
      (state, action: PayloadAction<ActionPostReturnType>) => {
        if (state?.post?.id === action.payload.post.id) {
          state.post = action.payload.post;
        }
      }
    );
    builder.addCase(
      editPost.fulfilled,
      (state, action: PayloadAction<ActionPostReturnType>) => {
        if (state?.post?.id === action.payload.post.id) {
          state.post = action.payload.post;
        }
      }
    );
    builder.addCase(
      deletePost.fulfilled,
      (state, action: PayloadAction<DeletePostParams>) => {
        state.isDelete = true;
      }
    );
  },
});

export default commentsSlice.reducer;
export const { resetCommentState } = commentsSlice.actions;

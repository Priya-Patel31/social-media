import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseApp";
import { Comment, Post, PostCommentParams } from "../posts/posts.types";
import { InitialStateType } from "./comment.type";

const initialState: InitialStateType = {
  comments: [],
  fetchCommentStatus: "idle",
  postCommentStatus: "idle",
};
export const getCommentsByPostId = createAsyncThunk<Comment[], string>(
  "comments/getComments",
  async (postId) => {
    const postRef = doc(db, "posts", postId);
    const post = (await (await getDoc(postRef)).data()) as Post;
    return post.comments;
  }
);
export const postComment = createAsyncThunk<Comment, PostCommentParams>(
  "comments/postComment",
  async ({ postId, comment }) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { comments: arrayUnion(comment) });
    return comment;
  }
);
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCommentsByPostId.fulfilled,
      (state, action: PayloadAction<Comment[]>) => {
        state.comments = action.payload;
        state.fetchCommentStatus = "succeded";
      }
    );
    builder.addCase(getCommentsByPostId.pending, (state, action) => {
      state.fetchCommentStatus = "pending";
    });
    builder.addCase(getCommentsByPostId.rejected, (state, action) => {
      state.fetchCommentStatus = "failed";
    });
    builder.addCase(
      postComment.fulfilled,
      (state, action: PayloadAction<Comment>) => {
        state.comments.unshift(action.payload);
        state.postCommentStatus = "succeded";
      }
    );
    builder.addCase(postComment.pending, (state, action) => {
      state.postCommentStatus = "pending";
    });
    builder.addCase(postComment.rejected, (state, action) => {
      state.postCommentStatus = "failed";
    });
  },
});

export default commentsSlice.reducer;

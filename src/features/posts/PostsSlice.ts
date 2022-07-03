import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  arrayRemove,
  deleteDoc,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import { query, where } from "firebase/firestore";
import {
  ActionPostReturnType,
  BookmarkParams,
  DeletePostParams,
  FetchUserPostReturnType,
  LikePostParams,
  Post,
  PostCommentParams,
  PostsInitialState,
} from "./posts.types";
import { followUser } from "../auth/authSlice";
import { followUserReturnType } from "../auth/auth.types";
import { bookmarkPostReturnType } from "../bookmark/bookmark.types";
import { postComment } from "../comments/commentsSlice";
import { RootState } from "../../app/store";


export const uploadPost = createAsyncThunk<any, Post>(
  "posts/uploadPost",
  async (postData) => {
    const uid: any = localStorage.getItem("uid");
    const userRef = await doc(db, "users", uid);
    const docId = await addDoc(collection(db, "posts"), { ...postData, uid });
    await updateDoc(docId, { id: docId.id });
    const post = await (await getDoc(docId)).data();
    await updateDoc(userRef, { posts: arrayUnion(docId.id) });
    return post;
  }
);

export const fetchUserPosts = createAsyncThunk<
  FetchUserPostReturnType,
  string[]
>("posts/fetchUserPost", async (following, { getState }) => {
  const state = getState() as RootState;
  const posts: Post[] = [];
  const uid: any = localStorage.getItem("uid");
  let q;
  if (state.posts.last === null) {
    q = query(
      collection(db, "posts"),
      where("uid", "in", [uid, ...following]),
      limit(state.posts.limit)
    );
  } else {
    q = query(
      collection(db, "posts"),
      where("uid", "in", [uid, ...following]),
      limit(state.posts.limit),
      startAfter(state.posts.last)
    );
  }

  const Snap = await getDocs(q);
  Snap.forEach(async (post) => {
    posts.push(post.data() as Post);
  });
  const last = Snap.docs[Snap.docs.length - 1];
  return { posts, last };
});

export const likePost = createAsyncThunk<ActionPostReturnType, LikePostParams>(
  "posts/likePost",
  async ({ postId, isLiked }) => {
    const uid = localStorage.getItem("uid");
    const postRef = await doc(db, "posts", postId ?? "");
    if (isLiked) {
      await updateDoc(postRef, { likes: arrayRemove(uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(uid) });
    }
    const updatedPost = await (await getDoc(postRef)).data();
    return {
      post: updatedPost,
    } as ActionPostReturnType;
  }
);

export const bookmarkPost = createAsyncThunk<
  bookmarkPostReturnType,
  BookmarkParams
>("posts/bookmark", async ({ postId, isBookmarked }) => {
  const uid = localStorage.getItem("uid");
  const userRef = await doc(db, "users", uid ?? "");
  if (isBookmarked) {
    await updateDoc(userRef, { bookmarks: arrayRemove(postId) });
  } else {
    await updateDoc(userRef, { bookmarks: arrayUnion(postId) });
  }
  const postRef: any = await getDoc(doc(db, "posts", postId));


  return {
    post: postRef.data(),
    isBookmarked,
  } as bookmarkPostReturnType;
});

export const editPost = createAsyncThunk<ActionPostReturnType, { post: Post }>(
  "posts/editPost",
  async ({ post }) => {
    const postRef = doc(db, "posts", post.id ?? "");
    await updateDoc(postRef, { caption: post.caption });
    return { post } as ActionPostReturnType;
  }
);
export const deletePost = createAsyncThunk<DeletePostParams, DeletePostParams>(
  "posts/deletePost",
  async ({ postId }) => {
    const postRef = doc(db, "posts", postId ?? "");
    const uid = localStorage.getItem("uid");
    const userRef = doc(db, "users", uid ?? "");
    await updateDoc(userRef, { posts: arrayRemove(postId) });
    await deleteDoc(postRef);
    return { postId } as DeletePostParams;
  }
);

const initialState: PostsInitialState = {
  posts: [],
  uploadPostStatus: "idle",
  fetchPostsStatus: "idle",
  likePostStatus: "idle",
  bookmarkStatus: "idle",
  deletePostStatus: "idle",
  postCommentStatus: "idle",
  limit: 4,
  last: null,
  hasMore: true,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.posts = [];
      state.uploadPostStatus = "idle";
      state.fetchPostsStatus = "idle";
      state.likePostStatus = "idle";
      state.bookmarkStatus = "idle";
      state.deletePostStatus = "idle";
      state.postCommentStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      uploadPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
        state.uploadPostStatus = "succeded";
      }
    );
    builder.addCase(uploadPost.pending, (state) => {
      state.uploadPostStatus = "pending";
    });
    builder.addCase(uploadPost.rejected, (state) => {
      state.uploadPostStatus = "failed";
    });
    builder.addCase(
      fetchUserPosts.fulfilled,
      (state, action: PayloadAction<FetchUserPostReturnType>) => {
        state.posts = [...state.posts, ...action.payload.posts];
        state.last = action.payload.last;
        if (action.payload.posts.length === 0) {
          state.hasMore = false;
        }
        console.log(state.posts.length);
        state.fetchPostsStatus = "succeded";
      }
    );
    builder.addCase(fetchUserPosts.pending, (state) => {
      state.fetchPostsStatus = "pending";
    });
    builder.addCase(fetchUserPosts.rejected, (state) => {
      state.fetchPostsStatus = "failed";
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
        state.likePostStatus = "succeded";
      }
    );
    builder.addCase(likePost.pending, (state) => {
      state.likePostStatus = "pending";
    });
    builder.addCase(likePost.rejected, (state) => {
      state.likePostStatus = "failed";
    });
    builder.addCase(
      bookmarkPost.fulfilled,
      (state, action: PayloadAction<bookmarkPostReturnType>) => {
        state.bookmarkStatus = "succeded";
      }
    );
    builder.addCase(bookmarkPost.pending, (state) => {
      state.bookmarkStatus = "pending";
    });
    builder.addCase(bookmarkPost.rejected, (state) => {
      state.bookmarkStatus = "failed";
    });
    builder.addCase(
      editPost.fulfilled,
      (state, action: PayloadAction<ActionPostReturnType>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.post.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload.post;

          state.uploadPostStatus = "succeded";
        }
      }
    );
    builder.addCase(editPost.pending, (state) => {
      state.uploadPostStatus = "pending";
    });
    builder.addCase(editPost.rejected, (state) => {
      state.uploadPostStatus = "failed";
    });
    builder.addCase(
      deletePost.fulfilled,
      (state, action: PayloadAction<DeletePostParams>) => {
        state.posts = state.posts.filter((post) => {
          return post.id !== action.payload.postId;
        });
        state.deletePostStatus = "succeded";
      }
    );
    builder.addCase(deletePost.pending, (state) => {
      state.deletePostStatus = "pending";
    });
    builder.addCase(deletePost.rejected, (state) => {
      state.deletePostStatus = "failed";
    });
    builder.addCase(
      followUser.fulfilled,
      (state, action: PayloadAction<followUserReturnType>) => {
        state.posts.unshift(...action.payload.posts);
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

export default postsSlice.reducer;
export const { resetPostState } = postsSlice.actions;

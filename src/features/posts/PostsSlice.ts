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
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import { query, where } from "firebase/firestore";
import {
  ActionPostReturnType,
  BookmarkParams,
  DeletePostParams,
  LikePostParams,
  Post,
  PostsInitialState,
} from "./posts.types";
import { followUser } from "../auth/authSlice";
import { followUserReturnType } from "../auth/auth.types";
import { bookmarkPostReturnType } from "../bookmark/bookmark.types"

export const uploadPost = createAsyncThunk<any, Post>(
  "posts/uploadPost",
  async (postData) => {
    const uid: any = localStorage.getItem("uid");
    const docId = await addDoc(collection(db, "posts"), { ...postData, uid });
    await updateDoc(docId, { id: docId.id });
    const post = await (await getDoc(docId)).data();
    return post;
  }
);

export const fetchUserPosts = createAsyncThunk<Post[], string[]>(
  "posts/fetchUserPost",
  async (following) => {
    const posts: Post[] = [];
    const uid: any = localStorage.getItem("uid");
    const q = query(
      collection(db, "posts"),
      where("uid", "in", [uid, ...following])
    );
    const Snap = await getDocs(q);
    Snap.forEach(async (post) => {
      posts.push(post.data() as Post);
    });
    return posts;
  }
);

export const likePost = createAsyncThunk<ActionPostReturnType, LikePostParams>(
  "posts/likePost",
  async ({ postId, isLiked, explore }) => {
    const uid = localStorage.getItem("uid");
    const postRef = await doc(db, "posts", postId ?? "");
    if (isLiked) {
      await updateDoc(postRef, { likes: arrayRemove(uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(uid) });
    }
    const updatedPost = await (await getDoc(postRef)).data();
    return {
      post: updatedPost ,
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
const postRef = await getDoc(doc(db,"posts",postId));

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
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
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
      (state, action: PayloadAction<Post[]>) => {
        state.posts = action.payload;
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
  },
});

export default postsSlice.reducer;

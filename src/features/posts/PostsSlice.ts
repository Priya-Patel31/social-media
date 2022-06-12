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
  BookmarkParams,
  LikePostParams,
  Post,
  PostsInitialState,
} from "./posts.types";

export const uploadPost = createAsyncThunk<any, Post>(
  "posts/uploadPost",
  async (postData) => {
    const uid: any = localStorage.getItem("uid");

    const docId = await addDoc(collection(db, "posts"), { ...postData, uid });
    const post = await (await getDoc(docId)).data();
    return {...post,id:docId.id};
  }
);

export const fetchUserPosts = createAsyncThunk<Post[]>(
  "posts/fetchUserPost",
  async () => {
    const posts: Post[] = [];
    const uid: any = localStorage.getItem("uid");
    const q = query(collection(db, "posts"), where("uid", "in", [uid]));
    const Snap = await getDocs(q);

    Snap.forEach(async (doc) => {
      const post = (await doc.data()) as Post;
      posts.push({ ...post, id: doc.id });
    });
    return posts;
  }
);

export const likePost = createAsyncThunk<Post, LikePostParams>(
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
    return { ...updatedPost, id: postRef.id } as Post;
  }
);

export const bookmarkPost = createAsyncThunk<Post, BookmarkParams>(
  "posts/bookmark",
  async ({ postId, isBookmarked }) => {
    const uid = localStorage.getItem("uid");
    const postRef = await doc(db, "posts", postId);
    if (isBookmarked) {
      await updateDoc(postRef, { bookmarks: arrayRemove(uid) });
    } else {
      await updateDoc(postRef, { bookmarks: arrayUnion(uid) });
    }
    const updatedPost = await (await getDoc(postRef)).data();
    return { ...updatedPost, id: postRef.id } as Post;
  }
);

export const editPost = createAsyncThunk<Post, { post: Post }>(
  "posts/editPost",
  async ({ post }) => {
    const postRef = doc(db, "posts", post.id ?? "");
    await updateDoc(postRef, { caption: post.caption });
    return post;
  }
);
export const deletePost = createAsyncThunk<string, string>(
  "posts/deletePost",
  async (postId) => {
    const postRef = doc(db, "posts", postId ?? "");
    await deleteDoc(postRef);
    return postId;
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
      (state, action: PayloadAction<Post>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
          state.likePostStatus = "succeded";
        }
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
      (state, action: PayloadAction<Post>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
          state.bookmarkStatus = "succeded";
        }
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
      (state, action: PayloadAction<Post>) => {
        const postIndex = state.posts.findIndex((post) => {
          return post.id === action.payload.id;
        });
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
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
      (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter((post) => {
          return post.id !== action.payload;
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
  },
});

export default postsSlice.reducer;
export const {} = postsSlice.actions;

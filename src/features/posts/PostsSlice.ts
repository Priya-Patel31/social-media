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
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import { query, where } from "firebase/firestore";
import { Post, PostsInitialState } from "./posts.type";

export const uploadPost = createAsyncThunk<any, Post>(
  "posts/uploadPost",
  async (postData) => {
    const uid: any = localStorage.getItem("uid");

    const docId = await addDoc(collection(db, "posts"), { ...postData, uid });
    const post = await (await getDoc(docId)).data();
    return post;
  }
);

export const fetchUserPosts = createAsyncThunk<Post[]>(
  "posts/fetchUserPost",
  async () => {
    const posts: Post[] = [];
    const uid: any = localStorage.getItem("uid");
    const q = query(collection(db, "posts"), where("uid", "==", uid));
    const Snap = await getDocs(q);

    Snap.forEach(async (doc) => {
      const post = await doc.data() as Post
      posts.push({ ...post, id: doc.id });
    });
    return posts;
  }
);

export const likePost = createAsyncThunk<any,any>(
  "posts/likePost",
  async (postId) => {
    const uid = localStorage.getItem("uid");
    const postRef = await doc(db , "posts" , postId);
    const post = await (await getDoc(postRef)).data() as Post
    if(post.likes.some((likeId) => likeId === uid )){
      await updateDoc(postRef,{likes:arrayRemove(uid)})
    }else{
      await updateDoc(postRef,{likes:arrayUnion(uid)})
    }
    console.log(post);
    
  }
);

const initialState: PostsInitialState = {
  posts: [],
  uploadPostStatus: "idle",
  fetchPostsStatus: "idle",
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
        state.uploadPostStatus = "succeded";
      }
    );
    builder.addCase(fetchUserPosts.pending, (state) => {
      state.uploadPostStatus = "pending";
    });
    builder.addCase(fetchUserPosts.rejected, (state) => {
      state.uploadPostStatus = "failed";
    });
  },
});

export default postsSlice.reducer;
export const {} = postsSlice.actions;

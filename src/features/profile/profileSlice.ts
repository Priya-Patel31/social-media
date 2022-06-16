import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseApp";
import { bookmarkPostReturnType } from "../bookmark/bookmark.types";
import {
  ActionPostReturnType,
  DeletePostParams,
  Post,
} from "../posts/posts.types";
import {
  likePost,
  bookmarkPost,
  deletePost,
  editPost,
  uploadPost,
} from "../posts/PostsSlice";
import { profileInitialState } from "./profile.types";

const initialState: profileInitialState = {
  posts: [],
  fetchProfilePostsStatus: "idle",
};

export const fetchPosts = createAsyncThunk<Post[], string[]>(
  "profile/fetchPosts",
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        state.posts = action.payload;
        state.fetchProfilePostsStatus = "succeded";
      }
    );
    builder.addCase(fetchPosts.rejected, (state) => {
      state.fetchProfilePostsStatus = "failed";
    });
    builder.addCase(fetchPosts.pending, (state) => {
      state.fetchProfilePostsStatus = "pending";
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
      bookmarkPost.fulfilled,
      (state, action: PayloadAction<bookmarkPostReturnType>) => {
        if (action.payload.isBookmarked) {
        const findIndex = state.posts.findIndex((post)=>{
          return post.id === action.payload.post.id;
        })
        if(findIndex !== -1){
          state.posts = state.posts.filter((post) =>{
            return  post.id !== action.payload.post.id; 
          })
        
        }
        } else {
         state.posts.unshift(action.payload.post);
        }
      }
    );
  },
});

export default profileSlice.reducer;

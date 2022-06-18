import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { app, db } from "../../firebaseApp";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  signupState,
  signinState,
  User,
  authInitialState,
  followUserReturnType,
  followUserParams,
} from "./auth.types";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Status } from "../../generic.types";
import { DeletePostParams, Post } from "../posts/posts.types";
import { bookmarkPost, deletePost, uploadPost } from "../posts/PostsSlice";
import { bookmarkPostReturnType } from "../bookmark/bookmark.types";
import { FormDataType } from "../../pages/profile/components/EditProfile/EditProfile";

const auth = getAuth(app);

export const signup = createAsyncThunk<User, signupState>(
  "auth/signup",
  async ({ name, username, email, password }, thunkApi) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    const data: User = {
      uid: user.user.uid,
      name,
      username,
      email,
      bio: "",
      website: "",
      imageUrl: "",
      followers: [],
      following: [],
      posts: [],
      bookmarks: [],
    };
    await setDoc(doc(db, "users", user.user.uid), data);
    return data;
  }
);
export const getPostsByUserId = async (userId: string) => {
  const q = query(collection(db, "posts"), where("uid", "==", userId));
  const snapshots = await getDocs(q);
  const posts: Post[] = [];
  snapshots.forEach((postRef) => {
    const post = postRef.data();
    posts.push({ ...post, id: postRef.id } as Post);
  });
  return posts;
};

export const getCurrentUser = createAsyncThunk<User | false>(
  "auth/getCurrentUser",
  async () => {
    const currentUserId = localStorage.getItem("uid");
    if (currentUserId) {
      const userRef = await getDoc(doc(db, "users", currentUserId));
      console.log(userRef.data());
      return userRef.data() as User;
    } else {
      return false;
    }
  }
);
export const signin = createAsyncThunk<User, signinState>(
  "auth/signin",
  async ({ email, password }, thunkApi) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = await getDoc(doc(db, "users", res.user.uid));
    return user.data() as User;
  }
);

export const followUser = createAsyncThunk<
  followUserReturnType,
  followUserParams
>("users/followUser", async ({ userId, follow }) => {
  const uid = localStorage.getItem("uid");
  const userRef = doc(db, "users", uid ?? "");
  const followUserRef = doc(db, "users", userId);
  let posts: Post[] = [];
  if (follow) {
    await updateDoc(userRef, { following: arrayUnion(userId) });
    await updateDoc(followUserRef, { followers: arrayUnion(uid) });
    posts = await getPostsByUserId(userId);
  } else {
    await updateDoc(userRef, { following: arrayRemove(userId) });
    await updateDoc(followUserRef, { followers: arrayRemove(uid) });
  }
  return { uid, userId, follow, posts } as followUserReturnType;
});

export const saveUser = createAsyncThunk<FormDataType, FormDataType>(
  "auth/saveUser",
  async (formData) => {
    const uid = localStorage.getItem("uid");
    const userRef = doc(db, "users", uid ?? "");
    await updateDoc(userRef, {
      name: formData.name,
      bio: formData.bio,
      website: formData.website,
      imageUrl: formData.image_url,
    });
    return formData;
  }
);

const initialState: authInitialState = {
  user: null,
  signupStatus: "idle",
  signinStatus: "idle",
  followUserStatus: "idle",
  saveProfileStatus: "idle",

};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateSignupStatus: (state, action: PayloadAction<Status>) => {
      state.signupStatus = action.payload;
    },
    updateSigninStatus: (state, action: PayloadAction<Status>) => {
      state.signinStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state) => {
      state.signupStatus = "pending";
    });
    builder.addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("uid", state.user.uid);
      state.signupStatus = "succeded";
    });
    builder.addCase(signup.rejected, (state) => {
      state.signupStatus = "failed";
    });
    builder.addCase(signin.pending, (state) => {
      state.signinStatus = "pending";
    });
    builder.addCase(signin.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("uid", state.user.uid);
      state.signinStatus = "succeded";
    });
    builder.addCase(signin.rejected, (state) => {
      state.signinStatus = "failed";
    });
    builder.addCase(followUser.pending, (state) => {
      state.followUserStatus = "pending";
    });
    builder.addCase(
      followUser.fulfilled,
      (state, action: PayloadAction<followUserReturnType>) => {
        state.user?.following.push(action.payload.userId);
        state.followUserStatus = "succeded";
      }
    );
    builder.addCase(followUser.rejected, (state) => {
      state.followUserStatus = "failed";
    });
    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<User | false>) => {
        if (action.payload !== false) state.user = action.payload;
      }
    );
    builder.addCase(
      bookmarkPost.fulfilled,
      (state, action: PayloadAction<bookmarkPostReturnType>) => {
        if (action.payload.isBookmarked) {
          const updatedBookmarkPosts =
            state.user?.bookmarks.filter((bookmark) => {
              return bookmark !== action.payload.post.id;
            }) ?? [];

          if (state.user !== null) {
            state.user.bookmarks = updatedBookmarkPosts;
          }
        } else {
          state.user?.bookmarks.unshift(action.payload.post.id ?? "");
        }
      }
    );
    builder.addCase(
      uploadPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        if (action.payload.id) state.user?.posts.push(action.payload.id);
      }
    );
    builder.addCase(
      deletePost.fulfilled,
      (state, action: PayloadAction<DeletePostParams>) => {
        if (state.user !== null) {
          state.user.posts = state.user?.posts.filter((postId) => {
            return postId !== action.payload.postId;
          });
        }
      }
    );
    builder.addCase(saveUser.pending, (state) => {
      state.saveProfileStatus = "pending";
    });
    builder.addCase(
      saveUser.fulfilled,
      (state, action: PayloadAction<FormDataType>) => {
        if (state.user) {
          state.user.name = action.payload.name;
          state.user.bio = action.payload.bio;
          state.user.website = action.payload.website;
          state.user.name = action.payload.name;
        }
        state.saveProfileStatus = "succeded";
      }
    );
    builder.addCase(saveUser.rejected, (state) => {
      state.saveProfileStatus = "failed";
    });
  },
});
export default authSlice.reducer;
export const { updateSigninStatus, updateSignupStatus, updateUser } =
  authSlice.actions;

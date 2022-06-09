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
  authResponse,
  authInitialState,
} from "./auth.types";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { Status } from "../../generic.types";

const auth = getAuth(app);

export const signup = createAsyncThunk<authResponse, signupState>(
  "auth/signup",
  async ({ name, username, email, password }, thunkApi) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
    const data: authResponse = {
      uid: user.user.uid,
      name,
      username,
      email,
    };
    await setDoc(doc(db, "users", user.user.uid), data);
    return data;
  }
);
export const getCurrentUser = createAsyncThunk<authResponse | false>(
  "auth/getCurrentUser",
  async () => {
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId) {
      const userRef = await getDoc(doc(db, "users", currentUserId));
      return userRef.data() as authResponse;
    } else {
      return false;
    }
  }
);
export const signin = createAsyncThunk<authResponse, signinState>(
  "auth/signin",
  async ({ email, password }, thunkApi) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = await getDoc(doc(db, "users", res.user.uid));
    return user.data() as authResponse;
  }
);

const initialState: authInitialState = {
  user: null,
  signupStatus: "idle",
  signinStatus: "idle",
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<authResponse>) => {
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
    builder.addCase(signup.pending, (state, action) => {
      state.signupStatus = "pending";
    });
    builder.addCase(
      signup.fulfilled,
      (state, action: PayloadAction<authResponse>) => {
        state.user = action.payload;
        localStorage.setItem("uid", state.user.uid);
        state.signupStatus = "succeded";
      }
    );
    builder.addCase(signup.rejected, (state, action) => {
      state.signupStatus = "failed";
    });
    builder.addCase(signin.pending, (state, action) => {
      state.signinStatus = "pending";
    });
    builder.addCase(
      signin.fulfilled,
      (state, action: PayloadAction<authResponse>) => {
        state.user = action.payload;
        localStorage.setItem("uid", state.user.uid);
        state.signinStatus = "succeded";
      }
    );
    builder.addCase(signin.rejected, (state, action) => {
      state.signinStatus = "failed";
    });
    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<authResponse | false>) => {
        if (action.payload) state.user = action.payload;
      }
    );
  },
});
export default authSlice.reducer;
export const { updateSigninStatus, updateSignupStatus, updateUser } =
  authSlice.actions;

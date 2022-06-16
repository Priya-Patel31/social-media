import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseApp";
import { followUserReturnType, User } from "../auth/auth.types";
import { followUser } from "../auth/authSlice";
import { usersInitialState } from "./users.types";

const initialState: usersInitialState = {
  users: [],
  fetchUsersStatus: "idle",
};

export const fetchUsers = createAsyncThunk<User[],string[]>(
  "users/fetchUsers",
  async (following) => {
    
    const fetchedUsers: User[] = [];
    const uid = localStorage.getItem("uid");
    const q = query(
      collection(db, "users"),
      where("uid", "not-in", [...(following ?? []), uid])
    );
   
    const snapshots = await getDocs(q);
    
    snapshots.forEach((user) => {
      fetchedUsers.push(user.data() as User);
    });

    return fetchedUsers;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.fetchUsersStatus = "succeded";
      }
    );
    builder.addCase(fetchUsers.rejected, (state) => {
      state.fetchUsersStatus = "failed";
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.fetchUsersStatus = "pending";
    });
    builder.addCase(
      followUser.fulfilled,
      (state, action: PayloadAction<followUserReturnType>) => {
          state.users = state.users.filter((user)=>{
            return user.uid !== action.payload.userId;
          });
      }
    );
  },
});

export default userSlice.reducer;
// export const {} = userSlice.actions;

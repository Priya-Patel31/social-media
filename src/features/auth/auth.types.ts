import { Status } from "../../generic.types";

export type signupState = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type signinState = {
  email: string;
  password: string;
};
export type User = {
  uid: string;
  name: string;
  username: string;
  email: string;
  posts: string[];
  followers: string[];
  following: string[];
  bookmarks: string[];
};
export type authInitialState = {
  user: User | null;
  signupStatus: Status;
  signinStatus: Status;
  followUserStatus : Status
};

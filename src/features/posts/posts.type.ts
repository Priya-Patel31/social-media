import { Status } from "../../generic.types";

export type Reply = {
  reply: string;
  uid: string;
};
export type Comment = {
  comment: string;
  uid: string;
  replies: Reply[];
};
export type Post = {
  caption: string;
  username: string;
  name: string;
  date: string;
  likes: string[];
  comments: Comment[];
  bookmark: boolean;
  uid?: string;
  id?: string;
};
export type PostsInitialState = {
  posts: Post[];
  uploadPostStatus: Status;
  fetchPostsStatus: Status;
};

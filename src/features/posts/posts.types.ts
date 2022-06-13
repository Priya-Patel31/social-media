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
  bookmarks: string[];
  uid?: string;
  id?: string;
};
export type LikePostParams = {
  postId: string;
  isLiked: boolean;
  explore?: boolean;
};
export type ActionPostReturnType = { post: Post; explore?: boolean };
export type DeletePostParams = {postId : string ,explore?: boolean}
export type BookmarkParams = {
  postId: string;
  isBookmarked: boolean;
  explore?: boolean;
};
export type PostsInitialState = {
  posts: Post[];
  uploadPostStatus: Status;
  fetchPostsStatus: Status;
  likePostStatus: Status;
  bookmarkStatus: Status;
  deletePostStatus: Status;
};

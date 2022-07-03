import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Status } from "../../generic.types";

export type Reply = {
  reply: string;
  uid: string;
};
export type Comment = {
  commentId: string;
  comment: string;
  username: string;
  imageUrl: string;
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
};
export type ActionPostReturnType = { post: Post };
export type DeletePostParams = { postId: string };
export type BookmarkParams = {
  postId: string;
  isBookmarked: boolean;
};

export type PostCommentParams = {
  postId: string;
  comment: Comment;
};
export type PostsInitialState = {
  posts: Post[];
  uploadPostStatus: Status;
  fetchPostsStatus: Status;
  likePostStatus: Status;
  bookmarkStatus: Status;
  deletePostStatus: Status;
  postCommentStatus: Status;
  limit: number;
  last: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;

};
export type FetchUserPostReturnType = {
  posts : Post[];
  last : QueryDocumentSnapshot<DocumentData> | null;
}
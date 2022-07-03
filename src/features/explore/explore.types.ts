import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Status } from "../../generic.types";
import { Post } from "../posts/posts.types";

export type exploreInitialState = {
  posts: Post[];
  fetchPostsStatus: Status;
  limit: number;
  last: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;

};
export type FetchPostReturnType = {
    posts : Post[];
    last : QueryDocumentSnapshot<DocumentData> | null;
  }

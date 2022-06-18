import { Status } from "../../generic.types";
import { Post } from "../posts/posts.types";

export type profileInitialState = {
  posts: Post[];
  fetchProfilePostsStatus: Status;
};

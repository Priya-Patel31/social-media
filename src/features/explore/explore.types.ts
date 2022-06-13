import { Status } from "../../generic.types"
import { Post } from "../posts/posts.types"

export type exploreInitialState = {
    posts : Post[],
    fetchPostsStatus : Status
}
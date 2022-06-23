import { Status } from "../../generic.types"
import { Post } from "../posts/posts.types"

export type InitialStateType ={
   post: Post | null,
    fetchCommentStatus : Status,
    postCommentStatus : Status,
    isDelete : boolean
}
import { Status } from "../../generic.types"
import { Comment } from "../posts/posts.types"

export type InitialStateType ={
    comments: Comment[],
    fetchCommentStatus : Status,
    postCommentStatus : Status
}
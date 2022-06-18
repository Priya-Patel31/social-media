import { Status } from "../../generic.types"
import { Post } from "../posts/posts.types"

export type bookmarkInitialState ={
    posts: Post[],
    bookmarkFetchPostsStatus: Status   
}
export type bookmarkPostReturnType ={
 post :Post,
  isBookmarked : boolean  
}
import { Post } from "../../features/posts/posts.types"

type Helper = {
    arr : Post[],
    value : string
}
export const isPresent = ({arr,value}: Helper)   =>{
    return  arr.some((post) => post.id === value);
}
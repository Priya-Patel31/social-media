import React, { useState } from "react";
import Avatar from "../../assets/images/avatar.jpg";
import MoreOptions from "../../shared/moreOptions/MoreOptions";
import {
  BsThreeDots,
  BsHeartFill,
  MdInsertComment,
  BsBookmarkFill,
} from "../../assets/icons/icons";
import "./post.css";
import { Post as PostType } from "../../features/posts/posts.type";
import { useAppDispatch } from "../../app/hooks";
import { likePost } from "../../features/posts/PostsSlice";

type PostProps = { post: PostType };
const Post = ({ post }: PostProps) => {
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleMoreOptions = () => {
    setShow(!show);
  };

  const handleLikes = () =>{
    dispatch(likePost(post.id));
  }
  return (
    <div className="flex-col post-container">
      <div className="flex-row">
        <img src={Avatar} className="avatar small-avatar" alt="profile" />
        <div className="flex-col post-header ml-1">
          <div className="flex-row align-center justify-between">
            <div className="">
              <h3 className="name mr-2">{post.name}</h3>
              <span className="username">{post.username}</span>
            </div>
            <div className="more-options-wrapper">
              <BsThreeDots
                className="more-icon"
                onClick={() => handleMoreOptions()}
              />
              {show && <MoreOptions></MoreOptions>}
            </div>
          </div>
          <div className="caption-container">{post.caption}</div>
        </div>
      </div>
      <div className="flex-row justify-between color-white icons-container align-center">
        <div className="flex-row align-center">
          <button onClick={handleLikes}>
          <BsHeartFill className="icon" />
          </button>
          <span className="ml-1 font-xxs">{post.likes.length}</span>
        </div>
        <div className="flex-row align-center">
          <MdInsertComment className="icon" />
          <span className="ml-1 font-xxs">{post.comments.length}</span>
        </div>
        <BsBookmarkFill className="icon" />
      </div>
    </div>
  );
};

export default Post;

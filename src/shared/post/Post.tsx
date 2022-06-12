import React, { useState } from "react";
import Avatar from "../../assets/images/avatar.jpg";
import MoreOptions from "../../shared/moreOptions/MoreOptions";
import {
  BsThreeDots,
  BsHeartFill,
  MdInsertComment,
  BsBookmarkFill,
  BsHeart,
  BsBookmark,
} from "../../assets/icons/icons";
import "./post.css";
import { Post as PostType } from "../../features/posts/posts.types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { bookmarkPost, likePost } from "../../features/posts/PostsSlice";

type PostProps = { post: PostType };
const Post = ({ post }: PostProps) => {
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleMoreOptions = () => {
    setShow(!show);
  };
  const { likePostStatus, bookmarkStatus } = useAppSelector((state) => {
    return state.posts;
  });
  const uid = localStorage.getItem("uid");
  const isLiked: boolean = post.likes.some((likeId) => likeId === uid);
  const isBookmarked: boolean = post.bookmarks?.some(
    (bookmarkId) => bookmarkId === uid
  );
  const handleLikes = () => {
    dispatch(likePost({ postId: post.id ?? "", isLiked }));
  };

  const bookmarkHandler = () => {
    dispatch(bookmarkPost({ postId: post.id ?? "", isBookmarked }));
  };
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
            {uid === post.uid && (
              <div className="more-options-wrapper">
                <BsThreeDots
                  className="more-icon"
                  onClick={() => handleMoreOptions()}
                />
                {show && <MoreOptions post={post}></MoreOptions>}
              </div>
            )}
          </div>
          <div className="caption-container">{post.caption}</div>
        </div>
      </div>
      <div className="flex-row justify-between color-white icons-container align-center">
        <div className="flex-row align-center">
          <button
            onClick={handleLikes}
            className="postActions"
            disabled={likePostStatus === "pending"}
          >
            {isLiked ? <BsHeartFill /> : <BsHeart />}
          </button>
          <span className="ml-1 font-xxs">{post.likes.length}</span>
        </div>
        <div className="flex-row align-center">
          <button className="postActions">
            <MdInsertComment />
            <span className="ml-1 font-xxs">{post.comments.length}</span>
          </button>
        </div>
        <button
          onClick={bookmarkHandler}
          className="postActions"
          disabled={bookmarkStatus === "pending"}
        >
          {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
        </button>
      </div>
    </div>
  );
};

export default Post;

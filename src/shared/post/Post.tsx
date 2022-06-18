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
import { useNavigate } from "react-router";;

type PostProps = { post: PostType,children?: React.ReactNode };
const Post = ({ post ,children}: PostProps) => {
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleMoreOptions = () => {
    setShow(!show);
  };
  const { likePostStatus, bookmarkStatus } = useAppSelector((state) => {
    return state.posts;
  });
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  const uid = localStorage.getItem("uid");
  const isLiked: boolean = post.likes.some((likeId) => likeId === uid);
  const isBookmarked: boolean =
    user?.bookmarks?.some((bookmarkId) => bookmarkId === post.id) ?? false;
  const handleLikes = () => {
    dispatch(likePost({ postId: post.id ?? "", isLiked }));
  };

  const bookmarkHandler = () => {
    dispatch(bookmarkPost({ postId: post.id ?? "", isBookmarked }));
  };
  const handleComments = () => {
    navigate(`/comments/${post.id}`,{state : {post}});
  };
  return (
    <div className="flex-col post-container">
      <div className="flex-row">
        <img src={Avatar} className="avatar small-avatar" alt="profile" />
        <div className="flex-col post-header ml-1">
          <div className="flex-row align-center justify-between">
            <h3 className="name mr-2">{post.username}</h3>
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
          <button className="postActions" onClick={handleComments}>
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
      {children}
    </div>
  );
};

export default Post;

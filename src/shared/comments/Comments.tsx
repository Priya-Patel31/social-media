import React from "react";
import Avatar from "../../assets/images/avatar.jpg";
import MoreOptions from "../moreOptions/MoreOptions";
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

const Comments = () => {
  const dispatch = useAppDispatch();
  const handleLikes = () => {
    // dispatch(likePost({ postId: post.id ?? "", isLiked, explore }));
  };

  const bookmarkHandler = () => {
    // dispatch(bookmarkPost({ postId: post.id ?? "", isBookmarked, explore }));
  };
  const uid = localStorage.getItem("uid");
  return (
    <div className="flex-col post-container">
      <div className="flex-row">
        <img src={Avatar} className="avatar small-avatar" alt="profile" />
        <div className="flex-col post-header ml-1">
          <div className="flex-row align-center justify-between">
            <div className="">
              {/* <h3 className="name mr-2">{post.name}</h3>
              <span className="username">{post.username}</span> */}
            </div>
            {/* {uid === post.uid && ( */}
              <div className="more-options-wrapper">
                <BsThreeDots
                  className="more-icon"
                //   onClick={() => handleMoreOptions()}
                />
                {/* {show && (
                  <MoreOptions post={post} explore={explore}></MoreOptions>
                )} */}
              </div>
            {/* )} */}
          </div>
          {/* <div className="caption-container">{post.caption}</div> */}
        </div>
      </div>
      <div className="flex-row justify-between color-white icons-container align-center">
        <div className="flex-row align-center">
          <button
            onClick={handleLikes}
            className="postActions"
            // disabled={likePostStatus === "pending"}
          >
            {/* {isLiked ? <BsHeartFill /> : <BsHeart />} */}
          </button>
          {/* <span className="ml-1 font-xxs">{post.likes.length}</span> */}
        </div>
        <div className="flex-row align-center">
          <button className="postActions">
            <MdInsertComment />
            {/* <span className="ml-1 font-xxs">{post.comments.length}</span> */}
          </button>
        </div>
        <button
          onClick={bookmarkHandler}
          className="postActions"
        //   disabled={bookmarkStatus === "pending"}
        >
          {/* {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />} */}
        </button>
      </div>
      <div className="">
        <div >
          <img src={Avatar} className="avatar small-avatar" alt="profile" />
          <div className="flex-col">
            <input type="text" placeholder="Enter your reply" />
            <div>
              <div></div>
              <button className="button primary-button">Reply</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <img src={Avatar} className="avatar small-avatar" alt="profile" />
          </div>
          <div>
            <h3>annachase</h3>
            <p>Haha, yes definitely !!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;

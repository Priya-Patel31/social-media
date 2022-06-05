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

const Post = () => {
  const [show, setShow] = useState(false);

  const handleMoreOptions = () => {
    setShow(!show);
  };
  return (
    <div className="flex-col post-container">
      <div className="flex-row">
        <img src={Avatar} className="avatar small-avatar" alt="profile" />
        <div className="flex-col post-header ml-1">
          <div className="flex-row align-center justify-between">
            <h3 className="username">Priya Patel</h3>
            <div className="more-options-wrapper">
              <BsThreeDots
                className="more-icon"
                onClick={() => handleMoreOptions()}
              />
              {show && <MoreOptions></MoreOptions>}
            </div>
          </div>
          <div className="caption-container">
            You should never give up on your dreams You should never give up on
            your dreams You should never give up on your dreams.
          </div>
        </div>
      </div>
      <div className="flex-row justify-between color-white icons-container align-center">
        <div className="flex-row align-center">
          <BsHeartFill className="icon"/>
          <span className="ml-1 font-xxs">23</span>
        </div>
        <div className="flex-row align-center">
          <MdInsertComment className="icon"/>
          <span className="ml-1 font-xxs">23</span>
        </div>
        <BsBookmarkFill className="icon"/>
      </div>
    </div>
  );
};

export default Post;

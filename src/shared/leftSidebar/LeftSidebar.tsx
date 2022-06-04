import React from "react";
import "./leftSidebar.css";
import {
  AiFillHome,
  FaUserCircle,
  BsFillBookmarkFill,
  MdExplore,
} from "../../assets/icons/icons";

const LeftSidebar = () => {
  return (
    <aside className="leftSidebar-container">
      <ul className="leftSidebar-list-items list-style-none">
        <li className="leftSidebar-list-item active font-bold">
          <AiFillHome className="leftSidebar-list-icon" />
          <a href="/" className="list-item-label">Home</a>
        </li>
        <li className="leftSidebar-list-item font-bold">
          <MdExplore className="leftSidebar-list-icon" />
          <a href="/" className="list-item-label">Explore</a>
        </li>
        <li className="leftSidebar-list-item font-bold">
          <BsFillBookmarkFill className="leftSidebar-list-icon" />
          <a href="/" className="list-item-label">Bookmarks</a>
        </li>
        <li className="leftSidebar-list-item font-bold">
          <FaUserCircle className="leftSidebar-list-icon" />
          <a href="/" className="list-item-label">Profile</a>
        </li>
      </ul>
      <button className="button primary-button create-post-btn font-bold">
        Create New Post
      </button>
    </aside>
  );
};

export default LeftSidebar;

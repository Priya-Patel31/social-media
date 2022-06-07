import React, { useState } from "react";
import "./leftSidebar.css";
import {
  AiFillHome,
  FaUserCircle,
  BsFillBookmarkFill,
  MdExplore,
} from "../../assets/icons/icons";
import { NavLink } from "react-router-dom";
import Modal from "../modals/Modal";
import CreatePost from "../createPost/CreatePost";

const LeftSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Modal show={showModal} onClick={() => setShowModal(false)}>
        <CreatePost className="responsive-create-post" />
      </Modal>
      <aside className="leftSidebar-container">
        <ul className="leftSidebar-list-items list-style-none">
          <li className="leftSidebar-list-item font-bold">
            <NavLink to="/" className="flex-row align-center">
              <AiFillHome className="leftSidebar-list-icon" />
              <span className="list-item-label">Home</span>
            </NavLink>
          </li>
          <li className="leftSidebar-list-item font-bold">
            <NavLink to="/explore" className="flex-row align-center">
              <MdExplore className="leftSidebar-list-icon" />
              <span className="list-item-label">Explore</span>
            </NavLink>
          </li>
          <li className="leftSidebar-list-item font-bold">
            <NavLink to="/bookmark" className="flex-row align-center">
              <BsFillBookmarkFill className="leftSidebar-list-icon" />
              <span className="list-item-label">Bookmarks</span>
            </NavLink>
          </li>
          <li className="leftSidebar-list-item font-bold">
            <NavLink to="/profile" className="flex-row align-center">
              <FaUserCircle className="leftSidebar-list-icon" />
              <span className="list-item-label">Profile</span>
            </NavLink>
          </li>
        </ul>
        <button
          className="button primary-button create-post-btn font-bold"
          onClick={() => setShowModal(!showModal)}
        >
          Create New Post
        </button>
      </aside>
    </div>
  );
};

export default LeftSidebar;

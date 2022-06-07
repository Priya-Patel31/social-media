
import React, { useState } from "react";
import { BsFillPlusCircleFill, HiPlus } from "../../assets/icons/icons";
import { Outlet } from "react-router-dom";
import "./home.css";
import "../../shared/leftSidebar/leftSidebar.css"
import LeftSidebar from "../../shared/leftSidebar/LeftSidebar";
import RightSidebar from "../../shared/rightSidebar/RightSidebar";
import Modal from "../../shared/modals/Modal";
import CreatePost from "../../shared/createPost/CreatePost";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="home-container">
      <LeftSidebar />
      <div className="main-container">
        <Outlet />
        <div
          className="floating-button-wrapper"
          onClick={() => setShowModal(!showModal)}
        >
          <HiPlus className="plus-icon"/>
        </div>
          <Modal show={showModal} onClick={() => setShowModal(!showModal)}>
            <CreatePost className="responsive-create-post"  />
          </Modal>
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;


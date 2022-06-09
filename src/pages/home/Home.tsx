import React, { useState } from "react";
import { HiPlus } from "../../assets/icons/icons";
import { Outlet } from "react-router-dom";
import "./home.css";
import "../../shared/leftSidebar/leftSidebar.css";
import LeftSidebar from "../../shared/leftSidebar/LeftSidebar";
import RightSidebar from "../../shared/rightSidebar/RightSidebar";
import Modal from "../../shared/modals/Modal";
import CreatePost from "../../shared/createPost/CreatePost";
import Navbar from "../../shared/navbar/Navbar";


const Home = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <LeftSidebar />
        <div className="main-container">
          <Outlet />
          <div
            className="floating-button-wrapper"
            onClick={() => setShowModal(!showModal)}
          >
            <HiPlus className="plus-icon" />
          </div>
          <Modal show={showModal} onClick={() => setShowModal(!showModal)}>
            <CreatePost className="responsive-create-post" />
          </Modal>
        </div>
        <RightSidebar />

      </div>
    </div>
  );
};

export default Home;

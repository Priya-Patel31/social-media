import React from "react";
import { Outlet } from "react-router-dom";
import "./home.css";
import LeftSidebar from "../../shared/leftSidebar/LeftSidebar";
import RightSidebar from "../../shared/rightSidebar/RightSidebar";

const Home = () => {
  return (
    <div className="home-container">
      <LeftSidebar />
      <div className="main-container">
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;


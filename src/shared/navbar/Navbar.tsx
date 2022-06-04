import React from "react";
import "./navbar.css";
import Logo from "../../assets/images/Logo.svg";
import { BiSearch, BsFillSunFill } from "../../assets/icons/icons";

const Navbar = () => {
  return (
    <div className="navbar-container flex-row align-center justify-between flex-wrap">
      <div className="flex-row align-center ">
        <div className="logo-image-container">
          <img src={Logo} alt="logo" className="logo-image" />
        </div>
        <h1 className="flex-row align-center logo-text">
          HOT<span className="logo-sub-text">TALK</span>
        </h1>
      </div>
      <form action="/action_page.php" className="searchbar-form">
        <BiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Enter search text..."
          name="search"
          className="input-field searchbar"
        />
      </form>
      <div className="flex-row align-center">
        <button className="button primary-button font-bold">Login</button>
        <BsFillSunFill className="mr-2 theme-icon"  />
      </div>
    </div>
  );
};

export default Navbar;

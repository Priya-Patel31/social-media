import React from "react";
import "./rightSidebar.css";
import Avatar from "../../assets/images/avatar.jpg"

const RightSidebar = () => {
  return (
    <div className="rightSidebar-container">
      <h3 className="rightSidebar-heading">Who to Follow</h3>
      <ul className="list-style-none rightSidebar-list-items p-1">
        <li className="mb-1">
          <div className="sm-badge flex-row justify-between">
            <img
              className="avatar small-avatar mr-1"
              src={Avatar}
              alt="avatar-image4"
            />
            <div className="flex-col">
              <div className="account-name font-bold">Ankur Gupta</div>
              <div className="account-username">@ankurr3884</div>
            </div>
            <button className="button follow-btn font-bold">Follow</button>
          </div>
        </li>
        <li className="mb-1">
          <div className="sm-badge flex-row justify-between">
            <img
              className="avatar small-avatar mr-1"
              src={Avatar}
              alt="avatar-image4"
            />
            <div className="flex-col">
              <div className="account-name font-bold">Priya Patel</div>
              <div className="account-username">@priya3112</div>
            </div>
            <button className="button follow-btn font-bold">Follow</button>
          </div>
        </li>
        <li>
          <div className="sm-badge flex-row justify-between">
            <img
              className="avatar small-avatar mr-1"
              src={Avatar}
              alt="avatar-image4"
            />
            <div className="flex-col account-details-container">
              <div className="account-name font-bold">Asmit Shrivastava</div>
              <div className="account-username">@asmit1006</div>
            </div>
            <button className="button follow-btn font-bold">Follow</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RightSidebar;

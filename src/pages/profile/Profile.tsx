import React, { useState } from "react";
import { MdModeEdit } from "../../assets/icons/icons";
import Avatar from "../../assets/images/avatar.jpg";
import "./profile.css";
import "../home/home.css";
import EditProfile from "./components/EditProfile/EditProfile";
import Modal from "../../shared/modals/Modal";

const Profile = () => {
  const [editProfile, setEditProfile] = useState(false);
  return (
    <div className="profile-container">
      <div className="profile-image-wrapper">
        <img
          className="avatar large-avatar profile-image"
          src={Avatar}
          alt="avatar"
        />
      </div>
      <div className="profile-details-wrapper">
        <p className="font-bold profile-username">@priyapatel31</p>
        <p className="profile-name">Priya Patel</p>
        <p className="profile-bio px-2">
          “If debugging is the process of removing bugs, then programming must
          be the process of putting them in.”
        </p>
        <button
          className="button primary-button edit-button flex-row align-center"
          onClick={() => setEditProfile(!editProfile)}
        >
          Edit Profile
          <MdModeEdit className="ml-1" />
        </button>
        <Modal onClick={() =>setEditProfile(false)} show={editProfile} >
            <EditProfile/>
        </Modal>
        <div className="flex-row justify-around align-center color-white profile-footer">
          <p>Followers : 0</p>
          <p>Posts : 2</p>
          <p>Following : 3</p>
        </div>
      </div>
      {/* <Post />
      <Post /> */}
    </div>
  );
};

export default Profile;

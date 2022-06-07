import React from "react";
import { RiImageAddFill } from "../../../../assets/icons/icons";
import "./editProfile.css";
import Avatar from "../../../../assets/images/avatar.jpg";

const EditProfile = () => {
  return (
    <div className="editProfile-container">
      <div className="flex-row  justify-between">
        <div className="color-white">
          <h2>Edit Profile</h2>
          <p className="text-left">@priya31</p>
        </div>
        <div className="edit-profile-image-wrapper">
          <img className="avatar medium-avatar" src={Avatar} alt="avatar" />
          <RiImageAddFill className="image-icon" />
        </div>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="first-name" className="form-label">
            First Name<span className="styling-color">*</span>{" "}
          </label>
          <input
            id="first-name"
            className="form-control"
            type="text"
            placeholder="First Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name" className="form-label">
            Last Name
          </label>
          <input
            id="last-name"
            className="form-control"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <input
            id="bio"
            className="form-control"
            type="text"
            placeholder="Bio"
          />
        </div>
        <div className="form-group">
          <label htmlFor="website" className="form-label">
            Website
          </label>
          <input
            id="website"
            className="form-control"
            type="url"
            placeholder="Website"
          />
        </div>
        <button className="button primary-button margin-auto display-block w-100 font-bold">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

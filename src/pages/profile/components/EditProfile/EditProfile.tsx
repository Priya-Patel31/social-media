import React, { Dispatch, SetStateAction, useState } from "react";
import "./editProfile.css";
import Avatar from "../../../../assets/images/avatar.jpg";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { saveUser } from "../../../../features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export type FormDataType = {
  name: string;
  bio: string;
  website: string;
  image_url: string;
};
type propType = {
  closeModal: Dispatch<SetStateAction<boolean>>;
};

const EditProfile = ({ closeModal }: propType) => {
  const { user, saveProfileStatus } = useAppSelector((state) => {
    return state.auth;
  });
  const [formData, setFormData] = useState<FormDataType>({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    website: user?.website ?? "",
    image_url: user?.imageUrl ?? "",
  });

  const disable =
    formData.name === user?.name &&
    formData.bio === user.bio &&
    formData.image_url === user.imageUrl &&
    formData.website === user.website;

  const dispatch = useAppDispatch();
  const formSubmitHandler = async (e: any) => {
    e.preventDefault();
    if (saveProfileStatus === "pending") {
      return;
    }
    try {
      const res = await dispatch(saveUser(formData));
      unwrapResult(res);
      toast.success("Profile Saved");
      closeModal(false);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!!");
    }
  };

  const handleOnChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="editProfile-container">
      <div className="flex-row  justify-between">
        <div className="color-white">
          <h2>Edit Profile</h2>
          <p className="text-left">@{user?.username}</p>
        </div>
        <div className="edit-profile-image-wrapper">
          <img className="avatar small-avatar" src={Avatar} alt="avatar" />
          {/* <RiImageAddFill className="image-icon" /> for future reference */}
        </div>
      </div>
      <form onSubmit={formSubmitHandler}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name<span className="styling-color">*</span>{" "}
          </label>
          <input
            id="name"
            className="form-control"
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleOnChange}
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
            value={formData.bio}
            onChange={handleOnChange}
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
            value={formData.website}
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url" className="form-label">
            Image url
          </label>
          <input
            id="image_url"
            className="form-control"
            type="url"
            placeholder="Enter url"
            value={formData.image_url}
            onChange={handleOnChange}
          />
        </div>
        <button
          type="submit"
          className="button primary-button margin-auto display-block w-100 font-bold"
          disabled={saveProfileStatus === "pending" || disable}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

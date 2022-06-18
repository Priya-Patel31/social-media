import React, { useEffect, useState } from "react";
import { MdModeEdit } from "../../assets/icons/icons";
import Avatar from "../../assets/images/avatar.jpg";
import "./profile.css";
import "../home/home.css";
import EditProfile from "./components/EditProfile/EditProfile";
import Modal from "../../shared/modals/Modal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts } from "../../features/profile/profileSlice";
import Post from "../../shared/post/Post";

const Profile = () => {
  const [editProfile, setEditProfile] = useState(false);
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  const dispatch = useAppDispatch();
  const { fetchProfilePostsStatus, posts } = useAppSelector((state) => {
    return state.profile;
  });
  useEffect(() => {
    if (fetchProfilePostsStatus === "idle" && user?.posts) {
      dispatch(fetchPosts(user?.posts ?? []));
    }
  }, [dispatch, fetchProfilePostsStatus, user?.posts]);
  return (
    <div className="profile-container">
      <div className="profile-image-wrapper">
        <img
          className="avatar large-avatar profile-image"
          src={user?.imageUrl ?? Avatar}
          alt="avatar"
        />
      </div>
      <div className="profile-details-wrapper">
        <p className="font-bold profile-username">@{user?.username}</p>
        <p className="profile-name">{user?.name}</p>
        <p className="profile-bio px-2">“{user?.bio ?? "No bio set"}”</p>
        <button
          className="button primary-button edit-button flex-row align-center"
          onClick={() => setEditProfile(!editProfile)}
        >
          Edit Profile
          <MdModeEdit className="ml-1" />
        </button>
        <Modal onClick={() => setEditProfile(false)} show={editProfile}>
          <EditProfile closeModal={setEditProfile} />
        </Modal>
        <div className="flex-row justify-around align-center color-white profile-footer">
          <p>Followers : {user?.followers.length}</p>
          <p>Posts : {user?.posts.length}</p>
          <p>Following : {user?.following.length}</p>
        </div>
      </div>
      {posts.length === 0 && <div className="empty-posts">You haven't posted anything yet!</div>}

      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
};

export default Profile;

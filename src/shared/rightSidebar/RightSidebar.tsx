import React, { useEffect } from "react";
import "./rightSidebar.css";
import Avatar from "../../assets/images/avatar.jpg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "../../features/users/usersSlice";
import { followUser } from "../../features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const RightSidebar = () => {
  const dispatch = useAppDispatch();
  const { fetchUsersStatus, users } = useAppSelector((state) => {
    return state.users;
  });
  const { user } = useAppSelector((state) => {
    return state.auth;
  });

  const followUserHandler = async (userId: string) => {
    try {
      const res = await dispatch(followUser({ userId, follow: true }));
      unwrapResult(res);
      toast.success("User followed successfully !!");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (fetchUsersStatus === "idle" && user?.following) {
      dispatch(fetchUsers(user?.following ?? []));
    }
  }, [dispatch, fetchUsersStatus,user?.following]);
  console.log(user?.following);
  return (
    <div className="rightSidebar-container">
      <h3 className="rightSidebar-heading">Who to Follow</h3>
      <ul className="list-style-none rightSidebar-list-items p-1">
        {users.map((user) => {
          return (
            <li className="mb-1" key={user.uid}>
              <div className="sm-badge flex-row justify-between">
                <div className="flex-row">
                  <img
                    className="avatar small-avatar mr-1"
                    src={Avatar}
                    alt="avatar-image4"
                  />
                  <div className="flex-col">
                    <div className="account-name font-bold">{user.name}</div>
                    <div className="account-username">@{user.username}</div>
                  </div>
                </div>
                <button
                  className="button follow-btn font-bold"
                  onClick={() => followUserHandler(user.uid)}
                >
                  Follow
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RightSidebar;

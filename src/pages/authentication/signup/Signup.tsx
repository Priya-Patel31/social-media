import React, { useState } from "react";
import {
  FaEnvelope,
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsArrowRight,
} from "../../../assets/icons/icons";
import SignupImage from "../../../assets/images/signup.svg";
import { Link, useNavigate } from "react-router-dom";
import "../authentication.css";
import { signup } from "../../../features/auth/authSlice";
import { signupState } from "../../../features/auth/auth.types";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../../app/hooks";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<signupState>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleOnChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleOnClick: any = async (e: any) => {
    //TO-DO
    e.preventDefault();
    try {
      const res = await dispatch(signup(formData));
      unwrapResult(res);
      toast.success("User successfully registered");
      navigate("/");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use")
        toast.error("email already in use");
      else if (e.code === "auth/weak-password")
        toast.error("Password should be alteast 6 char long");
      else toast.error("Something went wrong");
    }
  };
  return (
    <div className="signup-container">
      <div className="authentication-details-container flex-row mx-2">
        <div className="authentication-image-container">
          <img src={SignupImage} className="signup-image" alt="signup" />
        </div>
        <div className="form-components-container flex-col">
          <div className="wrapper p-2 my-2 flex-col">
            <h2 className="my-2 form-heading text-sm">Signup</h2>
            <form
              className="signup-form-container flex-col"
              onSubmit={handleOnClick}
            >
              <ul>
                <li className="list-style-none text-xs mb-1">
                  <label className="text-xs color-white" htmlFor="name">
                    Name
                  </label>
                  <div className="email-field-container mt-1">
                    <input
                      id="name"
                      className="input-field form-controls text-xs"
                      type="text"
                      placeholder="priya"
                      value={formData.name}
                      onChange={handleOnChange}
                      required
                    />
                  </div>
                </li>
                <li className="list-style-none text-xs mb-1">
                  <label className="text-xs color-white" htmlFor="username">
                    Username
                  </label>
                  <div className="email-field-container mt-1">
                    <input
                      id="username"
                      className="input-field form-controls text-xs"
                      type="text"
                      placeholder="patel"
                      value={formData.username}
                      onChange={handleOnChange}
                      required
                    />
                  </div>
                </li>
                <li className="list-style-none text-xs mb-1">
                  <label className="text-xs color-white" htmlFor="email">
                    Email address
                  </label>
                  <div className="email-field-container mt-1">
                    <input
                      id="email"
                      className="input-field form-controls"
                      type="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      placeholder="priya@gmail.com"
                      required
                    />
                    <FaEnvelope className="email-icon text-xs" />
                  </div>
                </li>
                <li className="list-style-none mb-1">
                  <label className="text-xs color-white" htmlFor="password">
                    Password
                  </label>
                  <div className="password-field-container mt-1">
                    <input
                      id="password"
                      value={formData.password}
                      className="input-field form-controls"
                      type={showPassword ? "text" : "password"}
                      onChange={handleOnChange}
                      placeholder="•••••••••"
                      required
                    />
                    {showPassword ? (
                      <BsFillEyeFill
                        className="password-eye-icon text-xs"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      ></BsFillEyeFill>
                    ) : (
                      <BsFillEyeSlashFill
                        className="password-eye-icon text-xs"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      ></BsFillEyeSlashFill>
                    )}
                  </div>
                </li>
              </ul>
              <button
                className="button primary-button font-medium my-2 text-xs"
                type="submit"
              >
                Create New Account
              </button>
              <div className="mt-2">
                <Link
                  to="/login"
                  className="text-xs color-white flex-row align-center link"
                >
                  Already have an account
                  <span>
                    <BsArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

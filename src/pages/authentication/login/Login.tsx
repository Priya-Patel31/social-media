import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsArrowRight,
} from "../../../assets/icons/icons";
import Signin from "../../../assets/images/signin.svg";
import "../authentication.css";
import { signin } from ".././../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { signinState } from "../../../features/auth/auth.types";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<signinState>({
    email: "",
    password: "",
  });
  const { signinStatus } = useAppSelector((state) => {
    return state.auth;
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleOnChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const loginHandler = async (e: any, email: string, password: string) => {
    e.preventDefault();
    try {
      const res = await dispatch(signin({ email, password }));
      unwrapResult(res);
      navigate("/")
      toast.success("User logged in !!");
    } catch (e: any) {
      if (e.code === "auth/wrong-password") toast.error("Wrong Password !!");
      else if (e.code === "auth/user-not-found") toast.error("User not found !!");
      else if (e.code === "auth/too-many-requests")
        toast.error("Account temporary disabled !!");
        else{
          toast.error("Something went wrong");
        }
    }
  };

  return (
    <div className="signin-container">
      <div className="authentication-details-container flex-row">
        <div className="authentication-image-container">
          <img src={Signin} alt="signin" />
        </div>
        <div className="form-components-container flex-col">
          <div className="wrapper p-2 my-2 flex-col">
            <h2 className="my-2 form-heading text-sm">Signin</h2>
            <form className="signup-form-container flex-col">
              <ul>
                <li className="list-style-none text-xs">
                  <label className="text-xs color-white" htmlFor="email">
                    Email address
                  </label>
                  <div className="email-field-container">
                    <input
                      id="email"
                      className="input-field form-control text-xs"
                      type="email"
                      placeholder="priya@gmail.com"
                      value={formData.email}
                      onChange={handleOnChange}
                      required
                    />
                    <FaEnvelope className="email-icon text-xs" />
                  </div>
                </li>
                <li className="list-style-none mt-2">
                  <label className="text-xs color-white" htmlFor="password">
                    Password
                  </label>
                  <div className="password-field-container">
                    <input
                      id="password"
                      className="input-field form-control text-xs"
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••••"
                      value={formData.password}
                      onChange={handleOnChange}
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
                type="submit"
                className="button primary-button font-medium my-2 text-xs"
                disabled={signinStatus === "pending"} 
                onClick={(e) =>
                  loginHandler(e, formData.email, formData.password)
                }
              >
                {signinStatus === "pending" ? "Logging..." : "Login"}
              </button>
              <button
                className="button primary-outline-button mb-2  mt-2 text-xs"
                disabled={signinStatus === "pending"}
                onClick={(e) => loginHandler(e, "priya@gmail.com", "12345678")}
              >
                Login As Guest
              </button>
              <div className="mt-2">
                <Link to="/signup" className="text-xs color-white link mt-2">
                  Create New Account
                  <span>
                    <BsArrowRight className="fas fa-arrow-right ml-2" />
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

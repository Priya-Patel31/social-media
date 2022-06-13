import React, { useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Feeds from "./pages/feed/Feeds";
import { Signup } from "./pages/authentication/signup/Signup";
import { Login } from "./pages/authentication/login/Login";
import { PrivateRoute } from "./shared/privateRoute/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "./features/auth/authSlice";
import { useAppDispatch } from "./app/hooks";


function App() {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  return (
    <div className="App">
      <ToastContainer theme="colored" />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute path="/">
              <Home />
             </PrivateRoute>
          }
        >
          <Route index element={<Feeds />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;

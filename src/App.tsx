import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Feeds from "./pages/feed/Feeds";
import Navbar from "./shared/navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Feeds />} />
          <Route path="profile" element={<Profile/>}/>
        </Route>
       
      </Routes>
    </div>
  );
}

export default App;

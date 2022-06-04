import React from "react";

import "./App.css";
import Home from "./pages/home/Home";
import Navbar from "./shared/navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home/>
    </div>
  );
}

export default App;

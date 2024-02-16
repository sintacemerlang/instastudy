import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import AddPhoto from "./pages/photo/AddPhoto";
import UpdatePhoto from "./pages/photo/UpdatePhoto";
import { PrivateRoute } from "./utils/privateRoute";
import { PublicRoute } from "./utils/publicRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<AddPhoto />} />
        <Route path="/update/:id" element={<UpdatePhoto />} /> */}

        <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/add" element={<PrivateRoute element={<AddPhoto />} />} />
        <Route path="/update/:id" element={<PrivateRoute element={<UpdatePhoto />} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

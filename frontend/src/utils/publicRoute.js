//publicRoute
import React from "react";
import { Navigate, Route } from "react-router-dom";

//Fungsi untuk public route
export function PublicRoute({ element, ...rest }) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return isLoggedIn ? <Navigate to="/home" replace /> : element;
}

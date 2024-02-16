//privateRoute
import React from "react";
import { Navigate, Route } from "react-router-dom";

//Fungsi untuk private route
export function PrivateRoute({ element, ...rest }) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return isLoggedIn ? element : <Navigate to="/" replace />
}

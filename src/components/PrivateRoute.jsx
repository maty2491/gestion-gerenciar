// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

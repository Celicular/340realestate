import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  // 1️⃣ Check if user is logged in (email is enough)
  if (!userEmail) {
    console.log("❌ No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Check user role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log(
      "❌ User role not allowed:",
      userRole,
      "Required:",
      allowedRoles
    );
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Protected route access granted for role:", userRole);
  return children;
};

export default ProtectedRoute;

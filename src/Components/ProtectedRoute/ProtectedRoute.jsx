import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// 👇 Add your admin email here
const adminEmails = [
  "putin24042005@gmail.com",      // your email
  "admin@shivexalights.com",
];

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly) {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const isAdmin = adminEmails.includes(userEmail);
    if (!isAdmin) {
      console.warn("Access denied – not an admin:", userEmail);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User } from "./context/UserContext";

const ProtectedRoute = () => {
  const { user } = useContext(User);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return user && <Outlet />;
};

export default ProtectedRoute;

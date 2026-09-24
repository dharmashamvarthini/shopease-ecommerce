import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { userInfo, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;

  if (!userInfo) return <Navigate to="/login" replace />;

  if (adminOnly && userInfo.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

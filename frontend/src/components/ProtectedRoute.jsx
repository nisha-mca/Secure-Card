import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function RequireUser({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/user/login" replace />;
}

export function RequireAdmin({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin/login" replace />;
}

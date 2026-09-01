import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import BrandMark from "./BrandMark";

export default function Navbar() {
  const { user, admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <BrandMark />
        SecureCard
      </Link>
      <nav>
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/search">Search</Link>
            <button className="link" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {admin && (
          <>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <button className="link" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!user && !admin && (
          <>
            <Link to="/user/login">User Login</Link>
            <Link to="/admin/login">Admin Login</Link>
            <Link to="/register" className="cta">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import { RequireUser, RequireAdmin } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="main-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/dashboard"
                element={
                  <RequireUser>
                    <Dashboard />
                  </RequireUser>
                }
              />
              <Route
                path="/search"
                element={
                  <RequireUser>
                    <Search />
                  </RequireUser>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
            </Routes>
          </main>
          <footer className="footer">
            SecureCard &mdash; Private Protected Search over Encrypted Cloud Records
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

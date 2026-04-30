import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./components/SnowModeColors.css";
import LandingPage from "./components/LandingPage";
import Portfolio from "./components/Portfolio";
import AdminDashboard from "./components/AdminDashboard";
import ThemeToggle from "./components/ThemeToggle";
import SnowMode from "./components/SnowMode";
import NightSky from "./components/NightSky";
import { apiUrl } from "./config/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [theme, setTheme] = useState("day");
  const [accessMode, setAccessMode] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const mode = localStorage.getItem("accessMode");

    // If no token and no mode, stop loading immediately
    if (!token && !mode) {
      setIsLoading(false);
      return;
    }

    if (token && mode === "admin") {
      verifyToken(token);
    } else if (mode === "guest") {
      setAccessMode("guest");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(apiUrl("/api/auth/verify"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserRole(data.user.role);
        setAccessMode("admin");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("accessMode");
        setIsAuthenticated(false);
        setUserRole(null);
        setAccessMode("guest");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Keep the token and mode on network error (server might be temporarily down)
      setIsAuthenticated(true);
      setUserRole("admin");
      setAccessMode("admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("accessMode", "admin");
    setIsAuthenticated(true);
    setUserRole(user.role);
    setAccessMode("admin");
  };

  const handleGuestAccess = () => {
    localStorage.setItem("accessMode", "guest");
    setAccessMode("guest");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessMode");
    setIsAuthenticated(false);
    setUserRole(null);
    setAccessMode(null);
    // Force reload to landing page
    window.location.reload();
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className={`app theme-${theme}`}>
        {/* Snow Mode Animation */}
        {theme === "snow" && <SnowMode />}

        {/* Night Sky Animation */}
        {theme === "night" && <NightSky />}

        <Routes>
          <Route
            path="/"
            element={
              isLoading ? (
                <div className="loading-screen">Loading...</div>
              ) : !accessMode ? (
                <LandingPage
                  onAdminLogin={handleAdminLogin}
                  onGuestAccess={handleGuestAccess}
                  setIsHovering={setIsHovering}
                  theme={theme}
                  setTheme={setTheme}
                />
              ) : accessMode === "guest" ? (
                <Portfolio
                  isAdmin={false}
                  onLogout={handleLogout}
                  setIsHovering={setIsHovering}
                  theme={theme}
                  setTheme={setTheme}
                />
              ) : (
                <Portfolio
                  isAdmin={userRole === "admin"}
                  onLogout={handleLogout}
                  setIsHovering={setIsHovering}
                  theme={theme}
                  setTheme={setTheme}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && userRole === "admin" ? (
                <AdminDashboard
                  onLogout={handleLogout}
                  setIsHovering={setIsHovering}
                  theme={theme}
                  setTheme={setTheme}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "night" || theme === "snow" ? "dark" : "light"}
        />
      </div>
    </Router>
  );
}

export default App;

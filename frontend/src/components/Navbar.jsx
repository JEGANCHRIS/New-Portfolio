import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { FaUser, FaHandPeace, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ onLogout, userRole, theme, setTheme, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handlePortfolioClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(); // Exit edit mode if in edit mode
    }
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" onClick={handlePortfolioClick} className="nav-logo">
          <span className="logo-text">Meshach Christo</span>
          <span className="logo-badge">AI</span>
        </a>
        <div className="nav-right">
          <ul className="nav-menu">
            <li>
              <a href="/" onClick={handlePortfolioClick}>
                <span>Portfolio</span>
              </a>
            </li>
            {userRole === "admin" && (
              <li>
                <Link to="/admin">
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
          </ul>
          {/* Mode Badge */}
          <div className="mode-badge-nav">
            {userRole === "admin" ? (
              <>
                <FaUser className="mode-icon" />
                <span>Admin Mode</span>
              </>
            ) : (
              <>
                <FaHandPeace className="mode-icon" />
                <span>Guest Mode</span>
              </>
            )}
          </div>
          {/* Logout Button */}
          <button onClick={handleLogout} className="nav-logout">
            <FaSignOutAlt /> {userRole === "admin" ? "Logout" : "Exit"}
          </button>
          {/* Theme Toggle inside Navbar */}
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

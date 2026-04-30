import React from "react";
import { FaSun, FaMoon, FaSnowflake } from "react-icons/fa";
import "./ThemeToggle.css";

const ThemeToggle = ({ theme, setTheme }) => {
  const themes = [
    {
      id: "day",
      icon: FaSun,
      label: "Day Mode",
      gradient: "linear-gradient(135deg, #9600ff 0%, #Aebaf8 100%)",
    },
    {
      id: "night",
      icon: FaMoon,
      label: "Night Mode",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    },
    {
      id: "snow",
      icon: FaSnowflake,
      label: "Snow Mode",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    },
  ];

  return (
    <div className="theme-toggle-modern">
      <div className="theme-toggle-label">Theme</div>
      <div className="theme-buttons-container">
        {themes.map(({ id, icon: Icon, label, gradient }) => (
          <button
            key={id}
            className={`theme-btn-modern ${theme === id ? "active" : ""}`}
            data-theme={id}
            onClick={() => setTheme(id)}
            title={label}
            aria-label={label}
          >
            <Icon className="theme-icon" />
            {theme === id && (
              <span
                className="theme-btn-glow"
                style={{ background: gradient }}
              ></span>
            )}
          </button>
        ))}
      </div>
      <div className="theme-toggle-indicator"></div>
    </div>
  );
};

export default ThemeToggle;

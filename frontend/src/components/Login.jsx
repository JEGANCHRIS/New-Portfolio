import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { apiUrl } from "../config/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.token, data.user);
        navigate("/admin");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleGuest = () => {
    setIsGuest(true);
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Portfolio</h2>
        <div className="login-options">
          {/* Hidden dummy fields to trick browser auto-fill */}
          <div style={{ display: "none" }}>
            <input type="text" id="dummy-username" name="username" />
            <input
              type="password"
              id="dummy-password"
              name="password"
              autoComplete="off"
            />
          </div>

          <form
            onSubmit={handleLogin}
            className="login-form"
            autoComplete="off"
          >
            <div className="form-group">
              <label htmlFor="email-input">Email</label>
              <input
                type="text"
                id="email-input"
                name="emailfield"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <input
                type="password"
                id="password-input"
                name="pwdfield"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Login as Admin
            </button>
          </form>
          <div className="divider">OR</div>
          <button onClick={handleGuest} className="btn btn-secondary">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

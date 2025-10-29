import React, { useState } from "react";
import  App from '../App';
import "./SignupForm.css";

export default function SignupForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ username, password });
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🌸 Alsana</div>
        <div className="nav-links">
          <select className="language-select">
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
          <a href="/signin" className="signin-link">
            Sign in
          </a>
          <span className="home-icon">🏠</span>
        </div>
      </nav>

      {/* Main content */}
      <div className="signup-container">
        <div className="form-section">
          <h1>HEY THERE !</h1>
          <p>
            have a account ?{" "}
            <a style={{ color: "#00bfa6" }} href="/signin">
              Sign in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label>Username</label>
              <input
                className="input"
                type="email"
                placeholder="   youremail@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="  * * * * * * * * * *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label className="labi">Confirm Password</label>
              <input
                className="input"
                type="password"
                placeholder="   * * * * * * * * * *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirm && (
                <span className="error">{errors.confirm}</span>
              )}
            </div>

            <button type="submit" className="btn-otp">
              Sign Up with OTP
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>
            <div>
                <App/>
            </div>
          </form>
        </div>

        <div className="image-section">
          <img
            src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
            alt="signup illustration"
          />
        </div>
      </div>
    </div>
  );
}

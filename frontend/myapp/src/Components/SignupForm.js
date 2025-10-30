import React, { useState } from "react";
import Google from "../google/Google";
import "./SignupForm.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../google/Google";
export default function SignupForm({ onSubmit }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Your submission logic
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      navigate(`/otp-verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="logo">🌸 Alsana</div>
        <div className="nav-links">
          <select className="language-select">
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
          <Link to="/" className="signin-link">
            Sign in
          </Link>
          <span className="home-icon">🏠</span>
        </div>
      </nav>

      <div className="signup-container">
        <div className="form-section">
          <h1>HEY THERE !</h1>
          <p>
            have an account?{" "}
            <Link to="/" style={{ color: "#00bfa6" }}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="* * * * * * * * * *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                className="input"
                type="password"
                placeholder="* * * * * * * * * *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirm && (
                <span className="error">{errors.confirm}</span>
              )}
            </div>

            <button type="submit" className="btn-otp">
              Sign Up 
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div>
              <GoogleLoginButton/>
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
import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import GoogleLoginButton from "../google/Google";

export default function LoginForm({ onSubmit }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (onSubmit) {
      onSubmit({ email, password });
    }
     try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      alert(data.message);
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
          <Link to="/sign" className="signup-link">
              Sign up
            </Link>
          
          <span className="home-icon">🏠</span>
        </div>
      </nav>

      <div className="login-container">
        <div className="form-section">
          <h1>WELCOME BACK !</h1>
          <p>
            Don’t have an account?{" "}
            <Link to="/sign" className="link-teal">
              Sign up
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                className="input"
                type="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              {errors.email && (
                <span className="error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="• • • • • • • •"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="btn-signin">
              Sign In 
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>
            <div>
              <GoogleLoginButton/>
            </div>

            <div className="social-login">
              {/* Social login buttons here */}
            </div>
          </form>
        </div>

        <div className="image-section">
          <img
            src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
            alt="login illustration"
          />
        </div>
      </div>
    </div>
  );
}

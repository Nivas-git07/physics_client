import React, { useState } from "react";
import "./OtpVerify.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "",""]);
  const [error, setError] = useState("");
const location = useLocation();
 const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  const handleback=()=>{
    navigate("/sign");
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(paste)) {
      setOtp(paste.split(""));
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleCheck = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkotp: enteredOtp, email }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/");
        alert("✅ OTP Verified Successfully!");
        setError("");
      } else {
        setError("❌ Invalid OTP! Please try again.");
      }
    } catch {
      setError("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        {/* Left Section */}
        <div className="otp-left">
          <h1 className="otp-logo">Alsana</h1>
          <h2 className="otp-title">VERIFY OTP</h2>
          <label className="otp-label">Enter OTP</label>

          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleBackspace(e, i)}
              />
            ))}
          </div>

          {error && <div className="otp-error">{error}</div>}

          <div className="otp-buttons">
            <button className="check-btn" onClick={handleCheck}>
              Check
            </button>
            <button onClick={handleback} className="back-btn">Back</button>
          </div>
        </div>

        {/* Right Section */}
        <div className="otp-right">
          <img
            src="/otp-illustration.png"
            alt="OTP Illustration"
            className="otp-img"
          />
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;

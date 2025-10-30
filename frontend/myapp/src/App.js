import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/Login";
import OtpVerify  from "./Components/OtpVerify";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign" element={<SignupForm/>}/>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/Otp-verify" element={<OtpVerify/>}/>
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/Login";
import OtpVerify  from "./Components/OtpVerify";
import HomePage from "./Components/Home";
import FooterSection from "./Components/FooterSection";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign" element={<SignupForm/>}/>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/Otp-verify" element={<OtpVerify/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/about" element={<FooterSection/>}/>
      </Routes>
    </Router>
  );
}

export default App;

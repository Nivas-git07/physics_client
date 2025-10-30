import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/Login";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign" element={<SignupForm/>}/>
        <Route path="/login" element={<LoginForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;

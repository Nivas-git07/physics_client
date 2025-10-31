import React from "react";
import "./Home.css";
import profileImg from "../assets/phymam.jpg"; // replace with your actual image
import ResearchSection from "./ResearchSection";
import FooterSection from "./FooterSection";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🌿 Alsana</div>
        <ul className="nav-menu">
          <li>Home</li>
          <li>Form</li>
          <li>About</li>
        </ul>
        <div className="email">fathimkhan12@gmail.com</div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            <span className="growing">Growing</span> <br />
            <span className="seed">Seed to </span>
            <span className="tree">Tree</span> in{" "}
            <span className="physics">Physics</span>
          </h1>
          <p className="subtitle">
            Nurturing curiosity and knowledge from fundamental concepts to
            advanced discoveries.
          </p>
          <button className="join-btn">Join Now</button>
        </div>

        <div className="hero-right">
          <p className="formula">Effective = Achievement / Dedication</p>
          <div className="graph">
            <div className="line"></div>
            <div className="label power">↑ Power</div>
            <div className="label work">Work ↑</div>
            <div className="label time">Time ↓</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-left">
          <h2>
            I'm <span className="highlight">Fathima</span>
          </h2>
          <h3>Professor in Physics</h3>
          <p className="description">
            With a decade of experience in academia, I am passionate about
            making physics accessible and inspiring the next generation of
            scientists and thinkers.
          </p>
        </div>

        <div className="about-center">
          <img src={profileImg} alt="Professor" />
          <p className="watering">Watering</p>
        </div>

        <div className="about-right">
          <h2 className="years">10</h2>
          <p>Years Experience</p>
        </div>
      </section>

      {/* Work Experience */}
      <section className="experience">
        <h2>My Work Experience</h2>
        <div className="underline"></div>
        <div className="work-card">
          <h1 className="phy">Assistant Professor of Physics</h1>
          <div className="colleges">
            <div>🎓 Madonna Arts & Science College</div>
            <div>🎓 Mangayarkarasi College of Arts & Science</div>
            <div>🎓 Sethu Institute of Technology</div>
          </div>
        </div>
      </section>
      <ResearchSection/>
      <FooterSection/>
      {/* <ResearchSection/>
        <FooterSection/> */}
    </div>
  );
};

export default HomePage;

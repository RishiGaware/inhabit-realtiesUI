import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "../../assets/images/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-container">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="landing-logo" />
      </div>
      <h1 className="landing-title">Welcome to the Portal</h1>
      <br />
      <div className="card-wrapper">
        <div className="landing-card tms-card" onClick={() => handleRedirect("/tms")}>
          <h2 className="card-title">Training Management System</h2>
          <p className="card-description">
            Manage employee trainings, schedules, and certifications efficiently.
          </p>
        </div>

        <div className="landing-card dms-card" onClick={() => handleRedirect("/dms")}>
          <h2 className="card-title">Document Management System</h2>
          <p className="card-description">
            Access and organize critical pharma documents with ease and control.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

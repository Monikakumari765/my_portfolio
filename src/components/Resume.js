import React from "react";
import "../stylesheets/Resume.css";

const Resume = () => {
  return (
    <div className="resume-section">
      <h2 className="section-title">Resume</h2>
      <div className="resume-content">
        <div className="download-section">
          <p>View complete resume or download a copy:</p>
          <div className="download-buttons">
            <a
              href="./monika_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              <span className="download-icon"></span> View Full Resume
            </a>
            <a href="./monika_resume.pdf" download className="download-btn">
              <span className="download-icon">⬇</span> Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

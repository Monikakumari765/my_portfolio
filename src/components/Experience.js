import React, { useState } from 'react';
import '../stylesheets/Experience.css';

const Experience = () => {
  const [activeTab, setActiveTab] = useState(0);

  const certifications = [
    {
      company: "J.P. Morgan",
      position: "Quantitative Research Job Simulation",
      description: ["Completed a quantitative research job simulation."],
      technologies: ["Quantitative Research"],
    },
    {
      company: "Cisco Networking Academy",
      position: "Introduction to Modern AI",
      description: ["Completed the Introduction to Modern AI certification."],
      technologies: ["Artificial Intelligence"],
    },
    {
      company: "Forage",
      position: "Job Simulation",
      description: ["Completed a job simulation through Forage."],
      technologies: ["Job Simulation"],
    },
  ];
  

  return (
    <div className="experience-section">
      <h2 className="section-title">Certifications & Job Simulations</h2>
      <div className="experience-container">
        <div className="tabs">
          {certifications.map((certification, index) => (
            <button 
              key={index}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {certification.company}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <h3>{certifications[activeTab].position} <span className="company-highlight">@ {certifications[activeTab].company}</span></h3>
          <ul className="responsibilities">
            {certifications[activeTab].description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="technologies">
            {certifications[activeTab].technologies.map((tech, index) => (
              <span key={index} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

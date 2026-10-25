import React, { useEffect, useState } from "react";
import "../stylesheets/ToolBox.css";
import {
  FaPython,
  FaGlobe,
  FaDatabase,
  FaCode,
  FaGitAlt,
  FaJava,
  FaLaptopCode,
  FaBrain,
} from "react-icons/fa";
import {
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiMysql,
  SiCplusplus,
} from "react-icons/si";

const ToolBox = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skillCategories = [
    {
      name: "Programming Languages",
      icon: <FaCode />,
      skills: [
        { name: "C++", icon: <SiCplusplus /> },
        { name: "Java", icon: <FaJava /> },
        { name: "Python", icon: <FaPython /> },
      ],
    },
    {
      name: "Web Technologies",
      icon: <FaGlobe />,
      skills: [
        { name: "HTML", icon: <SiHtml5 /> },
        { name: "CSS", icon: <SiCss3 /> },
        { name: "JavaScript", icon: <SiJavascript /> },
      ],
    },
    {
      name: "Database",
      icon: <FaDatabase />,
      skills: [
        { name: "SQL", icon: <FaDatabase /> },
        { name: "MySQL", icon: <SiMysql /> },
      ],
    },
    {
      name: "Tools",
      icon: <FaLaptopCode />,
      skills: [
        { name: "Git", icon: <FaGitAlt /> },
        { name: "GitHub", icon: <FaGitAlt /> },
        { name: "VS Code", icon: <FaCode /> },
      ],
    },
    {
      name: "Core Concepts",
      icon: <FaBrain />,
      skills: [
        { name: "Data Structures and Algorithms", icon: <FaCode /> },
        { name: "Object-Oriented Programming", icon: <FaLaptopCode /> },
        { name: "Database Management Systems", icon: <FaDatabase /> },
      ],
    },
  ];

  return (
    <section className="toolbox-section">
      <div
        className={`section-content toolbox-content ${
          isVisible ? "visible" : ""
        }`}
      >
        <h2 className="section-title">My Toolbox</h2>
        <p className="section-subtitle">
          Programming languages, tools, and computer science foundations from my resume
        </p>

        <div className="skills-container">
          {skillCategories.map((category, index) => (
            <div
              className="skill-category"
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
              </div>

              <div className="skills-list">
                {category.skills.map((skill, idx) => (
                  <div className="skill-item minimal" key={idx}>
                    <div className="skill-icon">{skill.icon}</div>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolBox;

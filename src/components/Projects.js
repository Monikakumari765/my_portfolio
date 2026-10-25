import React, { useState } from "react";
import "../stylesheets/Projects.css";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Personal Portfolio Website",
      description:
        "Designed and developed a personal portfolio website to showcase skills, projects, certifications, and contact information.",
      category: "web-dev",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
    {
      id: 2,
      title: "KrishiFleet",
      description:
        "Developed a farming machinery platform concept that helps farmers find suitable agricultural machines, estimate job costs, and book equipment efficiently.",
      category: "web-dev",
      technologies: ["Web Development", "Data-driven Solutions"],
    },
    {
      id: 3,
      title: "Hyper-Personalized Learning Assistant",
      description:
        "Worked on an AI/ML learning assistant concept that adapts learning content to students’ pace, knowledge gaps, and learning needs.",
      category: "ai",
      technologies: ["AI/ML"],
    },
  ];  

  const filters = [
    { id: "all", name: "All Projects" },
    { id: "ai", name: "AI/ML" },
    { id: "web-dev", name: "Web Development" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="projects-section">
      <h2 className="section-title">Featured Projects</h2>

      <div className="project-filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-btn ${
              activeFilter === filter.id ? "active" : ""
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div className="project-card" key={project.id}>
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

import React, { useEffect, useRef } from "react";
import "../stylesheets/About.css";

const ProfileImage= "./images/monika.jpeg" ;

const About = () => {
  const timelineRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const refs = timelineRefs.current;

    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !timelineRefs.current.includes(el)) {
      timelineRefs.current.push(el);
    }
  };

  const timelineEvents = [
    {
      year: "2025",
      title: "Started B.Tech",
      description:
        "Began a B.Tech in Computer Science and Technology at SAGE University, Indore. Coursework includes data structures, algorithms, machine learning, databases, data visualization, Python, and cloud computing.",
    },
    {
      year: "2026",
      title: "Building Projects and DSA Skills",
      description:
        "Designed and shipped three full-stack and AI-driven projects while consistently practicing data structures and algorithms, with 50+ LeetCode problems solved.",
    }
  ];

  return (
    <div className="about-section">
      <h2 className="section-title">About Me</h2>

      <div className="about-content">
        <div className="personal-info">
          <div className="profile-image">
            <img src={ProfileImage} alt="Profile" />
          </div>
          <div className="bio">
            <p>
              I’m a second-year B.Tech Computer Science and Technology student at SAGE University, seeking a Software Engineering internship.
            </p>
            <p>
              I have strong foundations in data structures, algorithms, and object-oriented programming, and have independently designed and shipped three full-stack and AI-driven projects.
            </p>
            <p>
              I’m consistently practicing problem-solving on LeetCode, with 50+ problems solved, and have completed job simulations in quantitative research and modern AI.
            </p>
          </div>
        </div>

        <div className="journey">
          <h3>My Journey</h3>
          <div className="timeline">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                ref={addToRefs}
                className={`timeline-item fade-in ${
                  index % 2 === 0 ? "left" : "right"
                }`}
              >
                <div className="timeline-content">
                  <div className="year">{event.year}</div>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

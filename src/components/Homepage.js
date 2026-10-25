import React, { useEffect, useRef } from 'react';
import '../stylesheets/Homepage.css';

const Homepage = ({ setActiveSection }) => {
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descTitleRef = useRef(null);  // New ref for the h2 title
  const descRef = useRef(null);       // Keep this for the description paragraph
  const ctaRef = useRef(null);

  useEffect(() => {
    // Simple animation effect when component mounts
    const animateElement = (element, delay) => {
      setTimeout(() => {
        if (element.current) {
          element.current.classList.add('visible');
        }
      }, delay);
    };

    animateElement(nameRef, 100);
    animateElement(titleRef, 600);
    animateElement(descTitleRef, 1100);  // Animate the h2
    animateElement(descRef, 1300);       // Animate the description after the h2
    animateElement(ctaRef, 1600);
  }, []);

  return (
    <div className="homepage">
      <div className="home-content">
        <p ref={nameRef} className="greeting fade-in">Hello, my name is</p>
        <h1 ref={titleRef} className="name fade-in">Monika Kumari <span className="cursor">|</span></h1>
        <h2 ref={descTitleRef} className="title fade-in">Software Engineering Intern Candidate</h2>
        <p ref={descRef} className="description fade-in">
          B.Tech CS student with strong foundations in data structures, algorithms, and OOP, building full-stack and AI-driven projects.
        </p>
        <div ref={ctaRef} className="cta-buttons fade-in">
          <a href="#projects" onClick={(e) => {
            e.preventDefault();
            setActiveSection('projects');
          }} className="primary-btn">View My Work</a>
          <a href="#contact" onClick={(e) => {
            e.preventDefault();
            setActiveSection('socials');
          }} className="secondary-btn">Get In Touch</a>
        </div>
      </div>
      <div className="background">
        <div className="particles"></div>
      </div>
    </div>
  );
};

export default Homepage;

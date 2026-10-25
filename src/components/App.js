import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Homepage from './Homepage';
import Experience from './Experience';
import Projects from './Projects';
import Resume from './Resume';
import About from './About';
import Socials from './Socials';
import ToolBox from './ToolBox';
import Chatbot from './Chatbot'
import '../stylesheets/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('homepage');
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#171815' : '#f7f5f0');
  }, [theme]);

  // Map of section ids to their component
  const sections = {
    homepage: <Homepage setActiveSection={setActiveSection} />,
    about: <About />,
    skills: <ToolBox />,
    experience: <Experience />,
    projects: <Projects />,
    resume: <Resume />,
    socials: <Socials />, 
  };

  return (
    <div className="app">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="content">
        {sections[activeSection]}
      </main>
      <Chatbot/>
    </div>
  );
}

export default App;
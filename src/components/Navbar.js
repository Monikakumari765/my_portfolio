import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import '../stylesheets/Navbar.css';

const Navbar = ({ activeSection, setActiveSection, theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { id: 'homepage', label: 'Home', mobileLabel: 'Home' },
    { id: 'about', label: 'About Me', mobileLabel: 'About' },
    { id: 'skills', label: 'Skills', mobileLabel: 'Skills' },
    { id: 'experience', label: 'Experience', mobileLabel: 'Certs' },
    { id: 'projects', label: 'Projects', mobileLabel: 'Work' },
    { id: 'resume', label: 'Resume', mobileLabel: 'Resume' },
    { id: 'socials', label: 'Let\'s Connect', mobileLabel: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-mark">MK</span>
          <span className="logo-copy">MONIKA KUMARI<small>SOFTWARE ENGINEERING</small></span>
        </div>
        
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <span className="nav-label">{item.label}</span>
                <span className="nav-label-mobile">{item.mobileLabel}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-bottom">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
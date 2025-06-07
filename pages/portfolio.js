import React, { useEffect, useState } from 'react';
import { Home, Work, Info, Email } from '@mui/icons-material';

import LandingPage    from '../components/LandingPage';
import ProjectSection from '../components/ProjectSection';
import About          from '../components/About';
import Contact        from '../components/Contact';

const portfolio = () => {
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
  const sections = ['portfolio-home', 'portfolio-projects', 'about', 'contact'];

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-100px 0px 0px 0px' // Offset for fixed navbar height
    }
  );

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);


  const isActive = id => (activeSection === id ? 'active' : '');

  return (
    <div className="portfolioMainDiv">

      <nav className="portfolio-navbar">
        <a href="#portfolio-home" className={`nav-link ${isActive('portfolio-home')}`}>
          <Home className="nav-icon" />
          <span className="nav-text">Home</span>
        </a>
        <a href="#about" className={`nav-link ${isActive('about')}`}>
          <Info className="nav-icon" />
          <span className="nav-text">About</span>
        </a>
        <a href="#portfolio-projects" className={`nav-link ${isActive('portfolio-projects')}`}>
          <Work className="nav-icon" />
          <span className="nav-text">Projects</span>
        </a>       
        <a href="#contact" className={`nav-link ${isActive('contact')}`}>
          <Email className="nav-icon" />
          <span className="nav-text">Contact</span>
        </a>
      </nav>

      <LandingPage />
      
      <About />
      <ProjectSection />
      <Contact />

    </div>
  );
};

export default portfolio;

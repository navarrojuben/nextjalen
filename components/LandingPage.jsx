import React, { useRef, useEffect } from 'react';
import { LinkedIn, Facebook, Google } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import LottieWrapper from './LottieWrapper';
import { motion } from 'framer-motion';

// adjust as needed

const LandingPage = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollTop = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollTop * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.section
      className="landing-section"
      id="portfolio-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 4 }}
    >
      <div className="parallax-bg" ref={bgRef} />

      <div className="landingMainDiv">
        {/* Left side - Lottie */}
        <div className="landingSubDiv landingSubDiv-1">
          <LottieWrapper src="/assets/lottie/developer.json" loop autoplay />
        </div>

        {/* Right side - Content */}
        <div className="landingSubDiv landingSubDiv-2">
          <p className='landingName'>Jalen Navarro</p>
          <div className='landingPosition'>Full Stack Web Developer</div>

          <div className="social-links">
            <IconButton className='landingIcon' href="https://www.linkedin.com/in/jalen-navarro/" target="_blank" rel="noreferrer">
              <LinkedIn fontSize="large" />
            </IconButton>
            <IconButton className='landingIcon' href="https://www.google.com" target="_blank" rel="noreferrer">
              <Google fontSize="large" />
            </IconButton>
            <IconButton className='landingIcon' href="https://www.facebook.com/jalen.nav" target="_blank" rel="noreferrer">
              <Facebook fontSize="large" />
            </IconButton>
          </div>

          <button
            onClick={() =>
              document.getElementById('portfolio-projects').scrollIntoView({ behavior: 'smooth' })
            }
          >
            View my Projects
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default LandingPage;

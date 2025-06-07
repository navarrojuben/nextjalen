import React from 'react';
import { motion } from 'framer-motion';
import LottieComponent from './LottieContainer';


import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const About = () => {
  return (
    <section id="about" className="aboutSection portfolioAboutSection">
      <motion.div
        className="aboutContentWithLottie"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
      >
        {/* Left Column */}
        <div className="text">
          <h2>About Me</h2>
          <p>
            I'm <strong>Jalen Navarro</strong>, a passionate Full Stack Web Developer dedicated to crafting modern,
            responsive, and functional web applications.
          </p>
          <p>
            My journey began with curiosity and evolved into building real-world web solutions that are fast and impactful.
          </p>

          <LottieComponent
            src="https://lottie.host/0616a251-fcb9-4be2-80e2-8166e438814a/nBPCC0n7dJ.lottie"
            maxWidth="300px"
            maxHeight="300px"
          />
        </div>

        {/* Right Column */}
        <motion.div
        className="skillsWithLottie"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        >
        <div>
            <LottieComponent
            src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
            width="400px"
            height="400px"
            />
        </div>

        <div className="skills">
            <h3>Technical Skills</h3>
            <ul>
            <li><CodeIcon fontSize="small" /> <strong>Front-End:</strong> React, HTML5, SCSS, JavaScript</li>
            <li><StorageIcon fontSize="small" /> <strong>Back-End:</strong> Node.js, Express, MongoDB</li>
            <li><BuildIcon fontSize="small" /> <strong>Tools:</strong> Git, REST APIs, Netlify, Railway</li>
            </ul>

            <h3>Soft Skills</h3>
            <ul>
            <li><PsychologyIcon fontSize="small" /> Problem-solving mindset</li>
            <li><ChatIcon fontSize="small" /> Effective communication</li>
            <li><VisibilityIcon fontSize="small" /> Attention to detail</li>
            <li><AutoAwesomeIcon fontSize="small" /> Adaptable and always learning</li>
            </ul>
        </div>
        </motion.div>


      </motion.div>
    </section>
  );
};

export default About;

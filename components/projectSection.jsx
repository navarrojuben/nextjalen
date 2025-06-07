import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // 👈 Framer Motion import

import ProjectCard from './projectCard';
import ProjectModal from './projectModal';
import SkeletonLoader from './skeletonLoader';

    const API_BASE_URL =
    process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
    : process.env.NEXT_PUBLIC_API_URL;

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/projects`)
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  const openModal = (project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedProject]);

  return (
    <section id="portfolio-projects" className="projectSection portfolioProjectSection">
      <motion.div
        className="projectsMotionContainer"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
      >
        <h2 className="projectsSectiontitle">Projects</h2>

        {loading ? (
          <div className="skeletonDiv">
            {Array(3)
              .fill()
              .map((_, i) => (
                <SkeletonLoader key={i} type="card" />
              ))}
          </div>
        ) : (
          <div className="projectsContainer">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ProjectCard
                  project={project}
                  onImageClick={() => openModal(project)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={closeModal} />
        )}
      </motion.div>
    </section>
  );
};

export default ProjectSection;

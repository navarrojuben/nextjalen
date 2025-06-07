import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const ProjectModal = ({ project, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* Close Button - Sticky */}

        
        

        <div className="projectModalHeader">

       
     
        <div
        className="close-button" onClick={onClose}
        >
        <CloseIcon/>
        </div>
        
        </div>

          <h2
          className="projectModalTitle"
          >{project.title}</h2>

        <img src={project.imageUrl} alt={project.title} className="modal-image" />
        
        <p
        className='projectModalDescription'
        >{project.description}</p>

        
        
        <div className="projectCard-techStackDiv projectCardTechStack">
        <strong
        className='projectCardTechStack'
        >Tech Stack:</strong>

        <div className="projectCard-techStackCapsules">
          {project.techStack.map((tech, index) => (
            <span key={index} className="tech-capsule">{tech}</span>
          ))}
        </div>

      </div>
        
        <div className="projectCard-linksDiv">

        <a 
        className="projectCard-gitHubLink"
        href={project.githubUrl} 
        target="_blank" 
        rel="noopener noreferrer">
        GitHub
        </a>
        
        
        <a 
        className="projectCard-liveLink"
        href={project.liveUrl} 
        target="_blank" 
        rel="noopener noreferrer">
        Live
        </a>

        </div>

      </div>
    </div>
  );
};

export default ProjectModal;

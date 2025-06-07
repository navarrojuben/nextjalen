import React from 'react';

const ProjectCard = ({ project, onImageClick }) => {
  const isLong = project.description.length > 150;
  const shortDescription = isLong
    ? project.description.slice(0, 150) + '...'
    : project.description;

  return (
    <div className="projectCard">

     <img
        src={project.imageUrl}
        alt={project.title}
        className='projectCardImage'
        onClick={onImageClick}
      />

      <h3 
      className='projectCardTitle'
      onClick={onImageClick}
      >{project.title}
      </h3>

      <p
      className='projectCardDescription'
      >
        {shortDescription}
        {isLong && (
          <>            
            <span 
            className="projectCard-viewMoreButton"
            onClick={onImageClick}
            >
              View More
            </span>
          </>
        )}
      </p>
      

      <div className="projectCard-techStackDiv">
      <strong>Tech Stack:</strong>

        <div className="projectCard-techStackCapsules">
          {project.techStack.map((tech, index) => (
            <span key={index} className="tech-capsule">{tech}</span>
          ))}
        </div>

      </div>


     <div className="projectCard-linksDiv">

     <a 
      className="projectCard-gitHubLink projectCardLink"
      href={project.githubUrl} 
      target="_blank" 
      rel="noopener noreferrer">
      GitHub
      </a>
      
      
      <a 
      className="projectCard-liveLink projectCardLink"
      href={project.liveUrl} 
      target="_blank" 
      rel="noopener noreferrer">
      Live
      </a>

     </div>

    </div>
  );
};

export default ProjectCard;

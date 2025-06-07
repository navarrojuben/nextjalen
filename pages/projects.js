import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectModal from '../components/projectModal';
import SkeletonLoader from '../components/skeletonLoader';
import AddIcon from '@mui/icons-material/Add';



const projects = () => {

    const API_BASE_URL = 
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [openProjectFormModal, setOpenProjectFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: ''
  });

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

 

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (openProjectFormModal) setOpenProjectFormModal(false);
        if (selectedProject) setSelectedProject(null);
      }
    };
    if (openProjectFormModal || selectedProject) {
      window.addEventListener('keydown', handleEscapeKey);
    }
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [openProjectFormModal, selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map(t => t.trim())
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/projects/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/projects`, payload);
      }
      setForm({
        title: '',
        description: '',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        imageUrl: ''
      });
      setEditingId(null);
      setOpenProjectFormModal(false);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      imageUrl: project.imageUrl
    });
    setEditingId(project._id);
    setOpenProjectFormModal(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      liveUrl: '',
      imageUrl: ''
    });
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectToDelete._id}`);
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleProjectFormClick = () => {
    setOpenProjectFormModal(prev => !prev);
    if (openProjectFormModal) cancelEdit();
  };

  const truncateDescription = (desc, limit = 150) =>
    desc.length > limit ? desc.slice(0, limit) + '' : desc;

  return (
    <div className="dashboardMainDiv protectedDiv">
     
      <div className="subMenuBar">
        <AddIcon className='subMenuBarButton' onClick={handleProjectFormClick} />

        {totalPages > 1 && (
              <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="paginationButton">Prev</button>
                <span className="paginationInfo">{currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="paginationButton">Next</button>
              </div>
            )}
      </div>

      <div className="dashboardSubDiv SubDiv">
        <div className="dashboard">
          <div className='dashboard-content'>
            {openProjectFormModal && (
              <div className="modalOverlay">
                <div className="modalContent">
                  <h2 className='modalTitle'>{editingId ? 'Update Project' : 'Add Project'}</h2>
                   <form 
                  className='modalForm'
                  onSubmit={handleSubmit}>
                  <div
                    className='modalInputDiv'
                    >
                      <label 
                      htmlFor="title"
                      className='modalInputLabel'
                      >Project Title</label>

                      <input
                        type="text"
                        id="title"
                        className='modalInput'
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />

                    </div>

                    <div className="modalInputDiv">
              <label htmlFor="description" className="modalInputLabel">
                Project Description
              </label>

              <div className="modalInputDiv">
                <textarea
                id="description"
                className=" modalTextArea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Type your project description..."
              />
              </div>

              <label className="modalInputLabel">
                Description Preview
              </label>
              <div className="modalPreviewBox">
                {form.description || "Description Preview"}
              </div>
            </div>

                    <div
                    className='modalInputDiv'
                    >
                      <label 
                      htmlFor="techStack"
                      className='modalInputLabel'
                      >Tech Stack</label>

                      <input
                        type="text"
                        id="techStack"
                        className='modalInput'
                        value={form.techStack}
                        onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                      />

                    </div>

                    <div
                    className='modalInputDiv'
                    >            

                      <label           
                      htmlFor="githubUrl"
                      className='modalInputLabel'
                      >GitHub URL</label>
                      <input
                        type="url"            
                        id="githubUrl"
                        className='modalInput'
                        value={form.githubUrl}
                        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                      />
                    </div>

                    <div
                    className='modalInputDiv'
                    >
                      <label 
                      htmlFor="liveUrl"
                      className='modalInputLabel'
                      >Live Project URL</label>

                      <input
                        type="url"
                        id="liveUrl"
                        className='modalInput'
                        value={form.liveUrl}
                        onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                      />          
                    </div>

                    <div
                    className='modalInputDiv'
                    >
                      <label 
                      htmlFor="imageUrl"
                      className='modalInputLabel'
                      >Project Image URL</label>
                      <input
                        type="url"
                        id="imageUrl"
                        className='modalInput'
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      />
                    </div>

                    <div className="modalButtonDiv">

                        <button 
                        className='modalButton modalSubmitButton'
                        type="submit">
                        {editingId ? 'Update Project' : 'Add Project'}
                      
                        </button>

                        <button                                                                                                        
                        className='modalButton modalCancelButton'
                        type="button"
                        onClick={() => {
                            cancelEdit();
                            setOpenProjectFormModal(false);
                        }}         
                        >
                        Cancel
                        </button>

                    </div>

                  </form>
                </div>
              </div>
            )}



          <div className="paginationContainer">


            <div className="projectsContainer">
              {loading
                ? Array(3).fill().map((_, i) => <SkeletonLoader key={i} type="card" />)
                : displayedProjects.map((project) => {
                    const isLong = project.description.length > 150;
                    const shortDescription = truncateDescription(project.description);
                    return (
                       <div className="projectCard" key={project._id}>
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="projectCardImage"
                            onClick={() => setSelectedProject(project)}
                          />

                          <h3
                            className="projectCardTitle"
                            onClick={() => setSelectedProject(project)}
                          >
                            {project.title}
                          </h3>

                          {shortDescription}
                          {isLong && (
                            <div
                              className="projectCard-viewMoreButton"
                              onClick={() => setSelectedProject(project)}
                            >
                              View More
                            </div>
                          )}

                          <div className="projectCard-techStackDiv">
                            <strong>Tech Stack:</strong>
                            <div className="projectCard-techStackCapsules">
                              {project.techStack.map((tech, index) => (
                                <span key={index} className="tech-capsule">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="project-card-footer">
                            <div className="project-links">
                              {project.githubUrl && (
                                <a
                                  className="projectCardLink"
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  GitHub
                                </a>
                              )}
                              {project.liveUrl && (
                                <a
                                  className="projectCardLink"
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Live
                                </a>
                              )}
                            </div>
                            <div className="project-actions">
                              <button onClick={() => handleEdit(project)} title="Edit">
                                <EditIcon fontSize="inherit" />
                              </button>
                              <button onClick={() => handleDeleteClick(project)} title="Delete">
                                <DeleteIcon fontSize="inherit" />
                              </button>
                            </div>
                          </div>
                        </div>
                    );
                  })}

                  
            
            </div>

            
            

          </div>
            


            {selectedProject && (
              <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
            {showDeleteConfirm && (
              <div className="modalOverlay">
                <div className="modalAlertDiv">
                  <div className="modalTitle">Are you sure you want to delete?</div>
                  <strong>{projectToDelete.title}</strong>
                  <div className="modalButtonDiv">
                    <button className='modalButton modalSubmitButton' onClick={confirmDelete}>Delete</button>
                    <button className='modalButton modalCancelButton' onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default projects;

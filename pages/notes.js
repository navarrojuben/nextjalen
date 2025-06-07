import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { ClipLoader } from 'react-spinners';
import { FaPlus, FaEdit, FaTrash, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';

const notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  const [visibleNotes, setVisibleNotes] = useState({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteSearch, setNoteSearch] = useState('');
  const [showFullDescription, setShowFullDescription] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes`);
      const sortedNotes = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(sortedNotes);
      setVisibleNotes(sortedNotes.reduce((acc, note) => ({ ...acc, [note._id]: false }), {}));
    } catch (err) {
      console.error('Failed to fetch notes', err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddOrEditNote = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || note.trim() === '') {
      alert('Title and note cannot be empty!');
      return;
    }

    const newNote = { title, description, note };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/notes/${editNoteId}`, newNote);
      } else {
        await axios.post(`${API_BASE_URL}/api/notes`, newNote);
      }

      fetchNotes();
      resetForm();
      setModalOpen(false);
    } catch (err) {
      console.error('Error adding or editing note', err.response ? err.response.data : err);
    }
  };

  const handleDelete = (id) => {
    setDeleteNoteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${deleteNoteId}`);
      fetchNotes();
      setDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting note', err.response ? err.response.data : err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setNote('');
    setIsEditing(false);
    setEditNoteId(null);
  };

  const handleEdit = (noteObj) => {
    setTitle(noteObj.title);
    setDescription(noteObj.description);
    setNote(noteObj.note);
    setIsEditing(true);
    setEditNoteId(noteObj._id);
    setModalOpen(true);
  };

  const copyToClipboard = (noteObj) => {
    navigator.clipboard.writeText(noteObj.note)
      .then(() => {
        setCopiedNoteId(noteObj._id);
        setTimeout(() => setCopiedNoteId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy!', err);
      });
  };

  const toggleVisibility = (noteId) => {
    setVisibleNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredNotes = notes.filter(noteObj =>
    noteObj.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
    noteObj.note.toLowerCase().includes(noteSearch.toLowerCase()) ||
    noteObj.description.toLowerCase().includes(noteSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const toggleDescription = (noteId) => {
    setShowFullDescription(prev => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  return (
    <div className="dashboardMainDiv protectedDiv">
      <div className="subMenuBar">
        <FaPlus onClick={() => { resetForm(); setModalOpen(true); }} className="subMenuBarButton" />
        <input
          type="text"
          placeholder='Search notes...'
          className="codes-search-input"
          onChange={(e) => setNoteSearch(e.target.value)}
        />
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="paginationButton">Prev</button>
            <span className="paginationInfo">Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="paginationButton">Next</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <span className="codes-close-modal" onClick={() => setModalOpen(false)}>&times;</span>
            <h2 className="modalTitle">{isEditing ? 'Edit Note' : 'Add Note'}</h2>
            <form className="modalForm" onSubmit={handleAddOrEditNote}>
              <div className="modalInputDiv">
                <label className="modalInputLabel">Title<p className="label-require">*</p></label>
                <input
                  className='modalInput'
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
                  maxLength={50}
                />
              </div>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Note<p className="label-require">*</p></label>
                <textarea
                  className='modalTextArea'
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows="5"
                  required
                />
              </div>

              <div className="modalButtonDiv">
                <button type="submit" className="modalButton modalSubmitButton">
                  {isEditing ? 'Save Changes' : 'Add'}
                </button>
                <div className="modalButton modalCancelButton" onClick={() => setModalOpen(false)}>Cancel</div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
        </div>
      ) : paginatedNotes.length === 0 ? (
        <p className="codes-emptySnippets-text"> no notes found </p>
      ) : (
        <>
          {paginatedNotes.map((noteObj) => (
            <div key={noteObj._id} className="codes-code-snippet-container">
              <div className="codes-snippet-header">
                <p className="codes-code-title">{highlightText(noteObj.title, noteSearch)}</p>
              </div>

              <p className="codes-code-desc">
                {showFullDescription[noteObj._id]
                  ? highlightText(noteObj.description, noteSearch)
                  : highlightText(noteObj.description.slice(0, 50) + (noteObj.description.length > 50 ? '...' : ''), noteSearch)}
                {noteObj.description.length > 50 && (
                  <span className="codes-see-more" onClick={() => toggleDescription(noteObj._id)}>
                    {showFullDescription[noteObj._id] ? 'See less' : 'See more'}
                  </span>
                )}
              </p>

              <div className="codes-code-snippet-footer">
                <div onClick={() => toggleVisibility(noteObj._id)} className="codes-toggle-visibility-button">
                  {visibleNotes[noteObj._id] ? <FaEyeSlash /> : <FaEye />}
                </div>
                <div onClick={() => copyToClipboard(noteObj)} className={`codes-code-snippet-copy-button ${copiedNoteId === noteObj._id ? 'codes-copied' : ''}`}>
                  <FaCopy />
                </div>
                <div onClick={() => handleEdit(noteObj)} className="codes-edit-snippet-button">
                  <FaEdit />
                </div>
                <div onClick={() => handleDelete(noteObj._id)} className="codes-delete-snippet-button">
                  <FaTrash />
                </div>
              </div>

              {visibleNotes[noteObj._id] && (
                <pre className="codes-code-snippet-code-block">
                  {noteObj.note}
                </pre>
              )}
            </div>
          ))}
        </>
      )}

      {isDeleteModalOpen && (
        <div className="modalOverlay">
          <div className="modalAlertDiv">
            <div className="modalTitle">Confirm Delete</div>
            <p className="modalText">
              <strong>{notes.find(note => note._id === deleteNoteId)?.title.slice(0, 50) || ''}</strong>
            </p>
            <div className="modalButtonDiv">
              <button onClick={confirmDelete} className="modalButton modalSubmitButton">Delete</button>
              <button onClick={() => setDeleteModalOpen(false)} className="modalButton modalCancelButton">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default notes;

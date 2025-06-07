import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup';
import { ClipLoader } from 'react-spinners';
import { FaPlus, FaEdit, FaTrash, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);

const codes = () => {
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSnippetId, setEditSnippetId] = useState(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const [visibleSnippets, setVisibleSnippets] = useState({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSnippetId, setDeleteSnippetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codeSearch, setCodeSearch] = useState('');
  const [showFullDescription, setShowFullDescription] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL = 
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  const fetchCodeSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/codes`);
      const sortedSnippets = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCodeSnippets(sortedSnippets);
      setVisibleSnippets(
        sortedSnippets.reduce((acc, snippet) => ({ ...acc, [snippet._id]: false }), {})
      );
    } catch (err) {
      console.error('Failed to fetch code snippets', err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchCodeSnippets();
  }, [fetchCodeSnippets]);

  useEffect(() => {
    codeSnippets.forEach(snippet => {
      if (visibleSnippets[snippet._id]) {
        const codeElement = document.querySelector(`#code-block-${snippet._id} code`);
        if (codeElement) {
          Prism.highlightElement(codeElement);
        }
      }
    });
  }, [visibleSnippets, codeSnippets, codeSearch]);

  const handleAddOrEditCode = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || code.trim() === '') {
      alert('Title and code snippet cannot be empty!');
      return;
    }

    const newSnippet = { title, description, code, language };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/codes/${editSnippetId}`, newSnippet);
      } else {
        await axios.post(`${API_BASE_URL}/api/codes`, newSnippet);
      }

      fetchCodeSnippets();
      resetForm();
      setModalOpen(false);
    } catch (err) {
      console.error('Error adding or editing code snippet', err.response ? err.response.data : err);
    }
  };

  const handleDelete = (id) => {
    setDeleteSnippetId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/codes/${deleteSnippetId}`);
      fetchCodeSnippets();
      setDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting code snippet', err.response ? err.response.data : err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('javascript');
    setIsEditing(false);
    setEditSnippetId(null);
  };

  const handleEdit = (snippet) => {
    setTitle(snippet.title);
    setDescription(snippet.description);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setIsEditing(true);
    setEditSnippetId(snippet._id);
    setModalOpen(true);
  };

  const copyToClipboard = (snippet) => {
    navigator.clipboard.writeText(snippet.code)
      .then(() => {
        setCopiedSnippetId(snippet._id);
        setTimeout(() => setCopiedSnippetId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy!', err);
      });
  };

  const toggleVisibility = (snippetId) => {
    setVisibleSnippets((prevVisible) => ({
      ...prevVisible,
      [snippetId]: !prevVisible[snippetId],
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

  const filteredSnippets = codeSnippets.filter(snippet =>
    snippet.title.toLowerCase().includes(codeSearch.toLowerCase()) ||
    snippet.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
    snippet.description.toLowerCase().includes(codeSearch.toLowerCase()) ||
    snippet.language.toLowerCase().includes(codeSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSnippets.length / itemsPerPage);
  const paginatedSnippets = filteredSnippets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const toggleDescription = (snippetId) => {
    setShowFullDescription((prevShow) => ({
      ...prevShow,
      [snippetId]: !prevShow[snippetId],
    }));
  };

  return (
    <div className="dashboardMainDiv protectedDiv">
      <div className="subMenuBar">
        <FaPlus 
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="subMenuBarButton"
        />

        <input
          type="text"
          placeholder='Search'
          className="codes-search-input"
          onChange={(e) => setCodeSearch(e.target.value)}
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
            <h2 className="modalTitle">{isEditing ? 'Edit Code' : 'Add Code'}</h2>
            <form className="modalForm" onSubmit={handleAddOrEditCode}>
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
                <label className="modalInputLabel">Code<p className="label-require">*</p></label>
                <textarea
                  className='modalTextArea'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code here..."
                  rows="5"
                  required
                />
              </div>

              {code && (
                <div className="modalInputDiv">
                  <label className="modalInputLabel">Preview</label>
                  <SyntaxHighlighter language={language || 'javascript'} style={atomOneDark}>
                    {code}
                  </SyntaxHighlighter>
                </div>
              )}

              <div className="modalInputDiv">
                <label className="modalInputLabel">Tags</label>
                <input
                  className='modalInput'
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Tags"
                  maxLength={50}
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
      ) : paginatedSnippets.length === 0 ? (
        <p className="codes-emptySnippets-text"> empty </p>
      ) : (
        <>
          {paginatedSnippets.map((snippet) => (
            <div key={snippet._id} className="codes-code-snippet-container">
              <div className="codes-snippet-header">
                <p className="codes-code-title">{highlightText(snippet.title, codeSearch)}</p>
              </div>

              <p className="codes-code-desc">
                {showFullDescription[snippet._id]
                  ? highlightText(snippet.description, codeSearch)
                  : highlightText(snippet.description.slice(0, 50) + (snippet.description.length > 50 ? '...' : ''), codeSearch)}
                {snippet.description.length > 50 && (
                  <span className="codes-see-more" onClick={() => toggleDescription(snippet._id)}>
                    {showFullDescription[snippet._id] ? 'See less' : 'See more'}
                  </span>
                )}
              </p>

              <div className="codes-snippet-language-label">{snippet.language.toUpperCase()}</div>

              <div className="codes-code-snippet-footer">
                <div onClick={() => toggleVisibility(snippet._id)} className="codes-toggle-visibility-button">
                  {visibleSnippets[snippet._id] ? <FaEyeSlash /> : <FaEye />}
                </div>
                <div onClick={() => copyToClipboard(snippet)} className={`codes-code-snippet-copy-button ${copiedSnippetId === snippet._id ? 'codes-copied' : ''}`}>
                  <FaCopy />
                </div>
                <div onClick={() => handleEdit(snippet)} className="codes-edit-snippet-button">
                  <FaEdit />
                </div>
                <div onClick={() => handleDelete(snippet._id)} className="codes-delete-snippet-button">
                  <FaTrash />
                </div>
              </div>

              {visibleSnippets[snippet._id] && (
                <pre id={`code-block-${snippet._id}`} className="codes-code-snippet-code-block">
                  <SyntaxHighlighter language="javascript" style={atomOneDark}>
                    {snippet.code}
                  </SyntaxHighlighter>
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
              <strong>{codeSnippets.find(snippet => snippet._id === deleteSnippetId)?.title.slice(0, 50) || ''}</strong>
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

export default codes;

'use client'; // Optional in app router if you're using it

import { useState, useEffect, useCallback } from 'react';
import { GrAdd, GrClose } from "react-icons/gr";
import ReactLoading from 'react-loading';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
  : process.env.NEXT_PUBLIC_API_URL;

const LinkDetails = ({ mylink, deleteHandler, updateHandler }) => {
  const [name, setName] = useState(mylink.name);
  const [link, setLink] = useState(mylink.link);
  const [description, setDescription] = useState(mylink.description);
  const [tags, setTags] = useState(mylink.tags);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [thisLink, setThisLink] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    setThisLink(
      mylink.link.toLowerCase().includes("https://")
        ? mylink.link
        : "https://" + mylink.link
    );
  }, [mylink.link]);

  useEffect(() => {
    const handleKeyEvent = (e) => {
      if (e.key === 'Escape') {
        setOpenUpdate(false);
        setOpenDelete(false);
      }
    };
    window.addEventListener('keydown', handleKeyEvent);
    return () => window.removeEventListener('keydown', handleKeyEvent);
  }, []);

  const showUpdate = () => setOpenUpdate((prev) => !prev);
  const showDelete = () => setOpenDelete((prev) => !prev);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    if (!name || !link) {
      setError("Please input all fields");
      setIsUpdating(false);
      return;
    }

    const newlink = { name, link, description, tags };
    const res = await fetch(`${API_BASE_URL}/api/links/${mylink._id}`, {
      method: 'PATCH',
      body: JSON.stringify(newlink),
      headers: { 'Content-Type': 'application/json' }
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
      setIsUpdating(false);
    } else {
      setError(null);
      setEmptyFields([]);
      updateHandler();
      setIsUpdating(false);
      showUpdate();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`${API_BASE_URL}/api/links/${mylink._id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      deleteHandler();
      showDelete();
    }
  };

  return (
    <div className="link-cap">
      <div className="linkRow">
        <a href={thisLink} target="_blank" rel="noopener noreferrer" className="linkNameDiv">
          {mylink.name.length > 60 ? mylink.name.slice(0, 30) + '...' : mylink.name}
        </a>

        <div className="linkButtonDiv">
          <div className="linkButton" onClick={showUpdate}><EditIcon /></div>
          <div className="linkButton" onClick={showDelete}><DeleteIcon /></div>
        </div>
      </div>

      {openUpdate && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h4 className="modalTitle">Update Link</h4>
            <form className="modalForm">
              {['Name', 'Link', 'Description', 'Tags'].map((label, idx) => (
                <div className="modalInputDiv" key={idx}>
                  <label className="modalInputLabel">{label}:</label>
                  {label === 'Description' ? (
                    <textarea
                      className="modalTextArea"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  ) : (
                    <input
                      className="modalInput"
                      type="text"
                      value={{ Name: name, Link: link, Tags: tags }[label]}
                      onChange={(e) => {
                        if (label === 'Name') setName(e.target.value);
                        else if (label === 'Link') setLink(e.target.value);
                        else if (label === 'Tags') setTags(e.target.value);
                      }}
                    />
                  )}
                </div>
              ))}
            </form>
            {error && <div className="modalError">{error}</div>}
            {isUpdating ? (
              <div className="modalLoading"><ReactLoading type={'bubbles'} /></div>
            ) : (
              <div className="modalButtonDiv">
                <div className="modalButton modalSubmitButton" onClick={handleUpdate}>Update</div>
                <div className="modalButton modalCancelButton" onClick={showUpdate}>Cancel</div>
              </div>
            )}
          </div>
        </div>
      )}

      {openDelete && (
        <div className="modalOverlay">
          <div className="modalAlertDiv">
            <div className="modalTitle">Are you sure you want to delete?</div>
            <div className="modalText">{mylink.name.slice(0, 30)}...</div>
            <div className="modalButtonDiv">
              <div className="modalButton modalSubmitButton" onClick={handleDelete}>Delete</div>
              <div className="modalButton modalCancelButton" onClick={showDelete}>Cancel</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const links = () => {
  const [allLinks, setAllLinks] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddLink, setOpenAddLink] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [updateLink, setUpdateLink] = useState(false);
  const [deleteLink, setDeleteLink] = useState(false);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const linksPerPage = 10;

  const fetchLinks = async () => {
    const res = await fetch(`${API_BASE_URL}/api/links`);
    const data = await res.json();
    if (res.ok) {
      setAllLinks(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setAddLink(false);
      setUpdateLink(false);
      setDeleteLink(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setOpenAddLink(false);
    fetchLinks();
  }, [addLink, updateLink, deleteLink]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') setOpenAddLink(prev => !prev);
      if (e.key === 'Escape') setOpenAddLink(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    const newlink = { name, link, description, tags };

    const res = await fetch(`${API_BASE_URL}/api/links`, {
      method: 'POST',
      body: JSON.stringify(newlink),
      headers: { 'Content-Type': 'application/json' }
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setIsAdding(false);
    } else {
      setError(null);
      setName(''); setLink(''); setDescription(''); setTags('');
      setIsAdding(false);
      setAddLink(true);
    }
  };

  const searchHandler = useCallback((e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }, []);

  const filtered = allLinks.filter((l) =>
    [l.name, l.link, l.description, l.tags].some(val =>
      val.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / linksPerPage);
  const displayedLinks = filtered.slice((currentPage - 1) * linksPerPage, currentPage * linksPerPage);

  return (
    <div className="dashboardMainDiv protectedDiv">
      <div className="subMenuBar">
        {openAddLink
          ? <GrClose onClick={() => setOpenAddLink(false)} className="subMenuBarButton" />
          : <GrAdd onClick={() => setOpenAddLink(true)} className="subMenuBarButton" />
        }

        <input
          type="text"
          className="link-searchbar"
          value={searchValue}
          onChange={searchHandler}
          placeholder="Search Link..."
        />

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next</button>
          </div>
        )}
      </div>

      {openAddLink && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form className="modalForm" onSubmit={handleSubmit}>
              <h2 className="modalTitle">Add Link</h2>
              {['Name', 'Link', 'Description', 'Tags'].map((label, idx) => (
                <div className="modalInputDiv" key={idx}>
                  <label className="modalInputLabel">{label}: <p className="label-require">*</p></label>
                  {label === 'Description' ? (
                    <textarea
                      className="modalTextArea"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  ) : (
                    <input
                      className="modalInput"
                      type="text"
                      value={{ Name: name, Link: link, Tags: tags }[label]}
                      onChange={(e) => {
                        if (label === 'Name') setName(e.target.value);
                        else if (label === 'Link') setLink(e.target.value);
                        else if (label === 'Tags') setTags(e.target.value);
                      }}
                    />
                  )}
                </div>
              ))}
              {error && <div className="errorDiv">{error}</div>}
              <div className="modalButtonDiv">
                {isAdding
                  ? <ReactLoading type="bubbles" />
                  : <>
                      <button className="modalButton modalSubmitButton">Add Link</button>
                      <button type="button" className="modalButton modalCancelButton" onClick={() => setOpenAddLink(false)}>Cancel</button>
                    </>
                }
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="linksTable">
        {isLoading ? (
          <div className="loading-linkform-div"><ReactLoading type="bubbles" /></div>
        ) : (
          displayedLinks.length === 0 ? (
            <p className="links-empty-text">empty</p>
          ) : (
            <div className="link-maindiv">
              {displayedLinks.map(link => (
                <LinkDetails
                  key={link._id}
                  mylink={link}
                  deleteHandler={() => setDeleteLink(true)}
                  updateHandler={() => setUpdateLink(true)}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default links;

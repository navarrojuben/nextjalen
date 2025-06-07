import { useState, useEffect, useCallback } from 'react';
import ReactLoading from 'react-loading';
import { GrAdd, GrClose } from 'react-icons/gr';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// ==========================
// CHILD COMPONENT: DateItem
// ==========================
const DateItem = ({ dateItem, deleteHandler, updateHandler }) => {
  const API_BASE_URL = 
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  // console.log("DateItem ENV:", process.env.NODE_ENV);
  // console.log("DateItem API_BASE_URL:", API_BASE_URL);

  const [editData, setEditData] = useState({
    title: dateItem.title,
    date: dateItem.date.slice(0, 10),
    description: dateItem.description,
    classification: dateItem.classification,
    isRecurring: dateItem.isRecurring,
  });

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'classification') {
      setEditData({ ...editData, classification: value, isRecurring: value === 'Birthday' });
    } else {
      setEditData({ ...editData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const response = await fetch(`${API_BASE_URL}/api/dates/${dateItem._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });

    if (response.ok) {
      updateHandler();
      setOpenUpdate(false);
    } else {
      const json = await response.json();
      setError(json.error);
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    await fetch(`${API_BASE_URL}/api/dates/${dateItem._id}`, { method: 'DELETE' });
    deleteHandler();
    setOpenDelete(false);
  };

  return (
    <div className="link-cap">
      <div className="linkRow dateRow">
        <div className="linkNameDiv">
          <em className="dateClassification">{dateItem.classification}</em>
          <strong className="dateTitle">
            {dateItem.title.charAt(0).toUpperCase() + dateItem.title.slice(1)}
          </strong>
          <p className="dateDate">
            {new Date(dateItem.date).toLocaleDateString('en-SG', {
              timeZone: 'Asia/Singapore',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="linkButtonDiv">
          <div className="linkButton" onClick={() => setOpenUpdate(true)}><EditIcon /></div>
          <div className="linkButton" onClick={() => setOpenDelete(true)}><DeleteIcon /></div>
        </div>
      </div>
      <div className="linkMeta">
        <p className="dateDescription">{dateItem.description}</p>
      </div>

      {/* UPDATE MODAL */}
      {openUpdate && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h4 className="modalTitle">Update Date</h4>
            <form className="modalForm">
              <div className="modalInputDiv">
                <label className="modalInputLabel">Title:</label>
                <input className="modalInput" name="title" value={editData.title} onChange={handleChange} />
              </div>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Date:</label>
                <input className="modalInput" type="date" name="date" value={editData.date} onChange={handleChange} />
              </div>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Description:</label>
                <textarea className="modalTextArea" name="description" value={editData.description} onChange={handleChange} />
              </div>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Classification:</label>
                <select className="modalInput" name="classification" value={editData.classification} onChange={handleChange}>
                  <option value="">Select classification</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Event">Event</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {editData.classification !== 'Birthday' && (
                <label>
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={editData.isRecurring}
                    onChange={handleChange}
                  />
                  Recurring?
                </label>
              )}

              {error && <div className="modalError">{error}</div>}

              {isUpdating ? (
                <ReactLoading type="bubbles" />
              ) : (
                <div className="modalButtonDiv">
                  <button type="button" className="modalButton modalSubmitButton" onClick={handleUpdate}>Update</button>
                  <button type="button" className="modalButton modalCancelButton" onClick={() => setOpenUpdate(false)}>Cancel</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {openDelete && (
        <div className="modalOverlay">
          <div className="modalAlertDiv">
            <div className="modalTitle">Are you sure you want to delete?</div>
            <div className="modalText">{dateItem.title}</div>
            <div className="modalButtonDiv">
              <div className="modalButton modalSubmitButton" onClick={handleDelete}>Delete</div>
              <div className="modalButton modalCancelButton" onClick={() => setOpenDelete(false)}>Cancel</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================
// MAIN COMPONENT: Dates
// ==========================
const dates = () => {
  
  const API_BASE_URL = 
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  console.log("Main ENV:", process.env.NODE_ENV);
  console.log("Main API_BASE_URL:", API_BASE_URL);

  const [allDates, setAllDates] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const datesPerPage = 10;

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    classification: '',
    isRecurring: false
  });

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const fetchDates = useCallback(async () => {
  setIsLoading(true);
  const res = await fetch(`${API_BASE_URL}/api/dates`);
  const json = await res.json();

  if (res.ok) {
    const today = new Date();

    const validDates = [];
    const expiredIdsToDelete = [];

    json.forEach(item => {
      const eventDate = new Date(item.date);

      if (item.isRecurring || eventDate >= today) {
        validDates.push(item);
      } else {
        expiredIdsToDelete.push(item._id);
      }
    });

    // Delete expired non-recurring dates
    await Promise.all(
      expiredIdsToDelete.map(id =>
        fetch(`${API_BASE_URL}/api/dates/${id}`, { method: 'DELETE' })
      )
    );

    setAllDates(
      validDates.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  }

  setIsLoading(false);
}, [API_BASE_URL]);


  useEffect(() => { fetchDates(); }, [fetchDates]);

  const filteredDates = allDates.filter(item => {
    const dateObj = new Date(item.date);
    const day = dateObj.getDate().toString();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toLowerCase();
    const year = dateObj.getFullYear().toString();
    const iso = item.date;
    const fullDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toLowerCase();

    const searchable = [
      item.title,
      item.description,
      item.classification,
      fullDate,
      day,
      month,
      year,
      iso
    ];

    return searchable.some(val =>
      val && val.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredDates.length / datesPerPage);
  const displayedDates = filteredDates.slice((currentPage - 1) * datesPerPage, currentPage * datesPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    const res = await fetch(`${API_BASE_URL}/api/dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Something went wrong');
      setIsAdding(false);
      return;
    }

    setFormData({ title: '', date: '', description: '', classification: '', isRecurring: false });
    setError(null);
    setIsAdding(false);
    fetchDates();
    setOpenAdd(false);
  };

  return (
    <div className="dashboardMainDiv protectedDiv">
      {/* === TOP BAR === */}
      <div className="subMenuBar">
        {openAdd ? <GrClose onClick={() => setOpenAdd(false)} className="subMenuBarButton" />
                 : <GrAdd onClick={() => setOpenAdd(true)} className="subMenuBarButton" />}
        <input
          className="link-searchbar"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => { setSearchValue(e.target.value); setCurrentPage(1); }}
        />
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        )}
      </div>

      {/* === ADD MODAL === */}
      {openAdd && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form className="modalForm" onSubmit={handleSubmit}>
              <h2 className="modalTitle">Add Date</h2>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Title:</label>
                <input className="modalInput" name="title" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Classification:</label>
                <select className="modalInput" name="classification" value={formData.classification}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      classification: value,
                      isRecurring: value === 'Birthday'
                    });
                  }}>
                  <option value="">Select classification</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Event">Event</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modalInputDiv">
                <label className="modalInputLabel">Date:</label>
                <input className="modalInput" type="date" name="date" value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>

              {formData.classification !== 'Birthday' && (
                <label>
                  <input type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                  Recurring?
                </label>
              )}

              <div className="modalInputDiv">
                <label className="modalInputLabel">Description:</label>
                <textarea className="modalTextArea" name="description" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              {error && <div className="errorDiv">{error}</div>}
              {isAdding ? <ReactLoading type="bubbles" /> : (
                <div className="modalButtonDiv">
                  <button className="modalButton modalSubmitButton">Add Date</button>
                  <button type="button" className="modalButton modalCancelButton" onClick={() => setOpenAdd(false)}>Cancel</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* === DATE LIST TABLE === */}
      <div className="linksTable">
        {isLoading ? (
          <ReactLoading type="bubbles" />
        ) : (
          displayedDates.length === 0 ? (
            <p className="links-empty-text">No dates found.</p>
          ) : (
            <div className="link-maindiv">
              {displayedDates.map(dateItem => (
                <DateItem
                  key={dateItem._id}
                  dateItem={dateItem}
                  deleteHandler={fetchDates}
                  updateHandler={fetchDates}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default dates;

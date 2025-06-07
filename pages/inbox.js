import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactLoading from 'react-loading';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import VisibilityIcon from '@mui/icons-material/Visibility';

const inbox = () => {

  
      const API_BASE_URL = 
      process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`);
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sorted);
    } catch (err) {
      console.error('Error fetching messages', err);
    }
    setIsLoading(false);
  };

  const requestDelete = (msg) => {
    setMessageToDelete(msg);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${messageToDelete._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete._id));
      }
    } catch (err) {
      console.error('Failed to delete message');
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on search change
  }, [searchValue]);

  const filteredMessagesRaw = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessagesRaw.length / messagesPerPage);
  const filteredMessages = filteredMessagesRaw.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  return (
    <div className="dashboardMainDiv protectedDiv">
      <div className="subMenuBar">
        <input
          type="text"
          className="link-searchbar"
          placeholder="Search Message..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="paginationButton"
            >
              Prev
            </button>
            <span className="paginationInfo">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="paginationButton"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-linkform-div">
          <ReactLoading type="bubbles" />
        </div>
      ) : (
        <div className="link-maindiv">
          {filteredMessages.length === 0 ? (
            <p className="links-empty-text">Inbox is empty</p>
          ) : (
            filteredMessages.map((msg) => (
              <div className="link-cap" key={msg._id}>
                <div className="linkRow">
                  <div
                    className="linkNameDiv messageLinkDiv"
                    onClick={() => setSelectedMessage(msg)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="messageHeader">
                    <div className='messageName'>{msg.name}</div>
                    <span className="messageEmail"> ({msg.email})</span> <br />
                    </div>

                    <span style={{ fontSize: '12px', color: 'gray' , textAlign: 'right'}}>
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="linkButtonDiv">                 
                    <div className="linkButton" onClick={() => requestDelete(msg)}>
                      <DeleteIcon className="linkButton" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="modalOverlay">
          <div className="modalContent">

            <div className="modalTitle">Message from {selectedMessage.name}</div>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Received:</strong> {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}</p>
            <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
              {selectedMessage.message}
            </div>



            <div className="modalButtonDiv">
              <button className="modalButton modalCancelButton" onClick={() => setSelectedMessage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modalOverlay">
          <div className="modalAlertDiv">
            <div className="modalTitle">Are you sure you want to delete</div>
            <strong>{messageToDelete?.name}</strong>
            <div className="modalButtonDiv">
              <button className="modalButton modalSubmitButton" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="modalButton modalCancelButton"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default inbox;

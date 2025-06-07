import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CallIcon from '@mui/icons-material/Call';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LottieWrapper from './LottieWrapper';



const Contact = () => {
  const API_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isInboxFull, setIsInboxFull] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messageLimit = 20;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setStatusMsg('');
    setStatusType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.message.length > 300) {
      setStatusMsg('Message must be 300 characters or fewer.');
      setStatusType('error');
      return;
    }

    try {
      const countRes = await axios.get(`${API_BASE_URL}/api/messages/count`);
      if (countRes.data.count >= messageLimit) {
        setIsInboxFull(true);
        setStatusMsg('Inbox is full. Please try again later.');
        setStatusType('error');
        return;
      }

      await axios.post(`${API_BASE_URL}/api/messages`, formData);
      setStatusMsg('✅ Message sent successfully!');
      setStatusType('success');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => {
        setStatusMsg('');
        setStatusType('');
      }, 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Something went wrong.';
      setStatusMsg(errorMsg);
      setStatusType('error');
    }
  };

  useEffect(() => {
    const checkInboxCount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/messages/count`);
        if (res.data.count >= messageLimit) {
          setIsInboxFull(true);
          setStatusMsg('Inbox is full. Please try again later.');
          setStatusType('error');
        }
      } catch (err) {
        console.error('Failed to fetch inbox count');
      }
    };

    checkInboxCount();
  }, [API_BASE_URL]);

  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollTop = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollTop * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderForm = () => (
    <form className="njForm portfolioContactForm" onSubmit={handleSubmit}>
      <div className="njInputDiv">
        <label className="njLabel">Name:</label>
        <input
          type="text"
          name="name"
          className="njInput"
          required
          disabled={isInboxFull}
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="njInputDiv">
        <label className="njLabel">Email:</label>
        <input
          type="email"
          name="email"
          className="njInput"
          required
          disabled={isInboxFull}
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="njInputDiv">
        <label className="njLabel">Message:</label>
        <p style={{ fontSize: '12px', textAlign: 'right' }}>
          {formData.message.length}/300
        </p>
        <textarea
          name="message"
          className="njTextArea"
          required
          rows="5"
          maxLength={300}
          disabled={isInboxFull}
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      {statusMsg && (
        <div
          style={{
            marginBottom: '10px',
            color: statusType === 'error' ? 'crimson' : 'green',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          {statusMsg}
        </div>
      )}

      <div className="njButtonDiv">
        <button
          type="submit"
          className="njButton njSubmitButton"
          disabled={isInboxFull}
        >
          {isInboxFull ? 'Inbox Full' : 'Submit'}
        </button>

        {isModalOpen && (
          <button
            type="button"
            className="njButton njCancelButton"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        )}
      </div>
    </form>
  );

  return (
    <section id="contact" className="contactSection">
      <div className="parallax-bg-contact" ref={bgRef} />

      <motion.div
        className="contactContainer"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="contactDetailsDiv">
          <p className="contactDetailsTitle">Contact Me</p>

          <div className="contactInfoRow">
            <div className="contactInfoContent">
              <EmailIcon className="contactInfoIcon" />
              <p className="contactInfoText">juben.lnavarro@gmail.com</p>
            </div>
          </div>

          <div className="contactInfoRow">
            <div className="contactInfoContent">
              <LocationOnIcon className="contactInfoIcon" />
              <p className="contactInfoText">Manila, Philippines</p>
            </div>
          </div>

          <div className="contactInfoRow">
            <div className="contactInfoContent">
              <CallIcon className="contactInfoIcon" />
              <p className="contactInfoText">(+63) 945 673 999_</p>
            </div>
          </div>

          <div className="contactIconDiv">
            <a href="https://linkedin.com/in/jalenNavarro" target="_blank" rel="noreferrer">
              <LinkedInIcon className="contactIcon" />
            </a>
            <a href="https://www.facebook.com/NavarroJuben/" target="_blank" rel="noreferrer">
              <FacebookIcon className="contactIcon" />
            </a>
            <a href="https://www.instagram.com/jbnlxsnvrr/" target="_blank" rel="noreferrer">
              <InstagramIcon className="contactIcon" />
            </a>
          </div>

          <div className="lottieButtonWrapper">
            <LottieWrapper src="/assets/lottie/mail.json" loop autoplay />
            <button
              className="njButton lottieButton"
              onClick={() => setIsModalOpen(true)}
            >
              Message Me
            </button>
          </div>
        </div>

        {/* ✅ Only one form rendered at a time */}
        {isModalOpen ? (
          <div className="modalOverlay">
            <div className="modalContent">{renderForm()}</div>
          </div>
        ) : (
          renderForm()
        )}
      </motion.div>
    </section>
  );
};

export default Contact;

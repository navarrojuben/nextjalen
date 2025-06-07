import React, { useState, useEffect } from 'react';
import SkeletonLoader from '../components/skeletonLoader';

const dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  // Only runs in browser
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 600);
  };

  checkMobile(); // initial check
  window.addEventListener('resize', checkMobile);

  return () => window.removeEventListener('resize', checkMobile);
}, []);


  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

    const API_BASE_URL = 
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL;

 

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dates`);
        const data = await res.json();
        if (res.ok) {
          setDates(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dates:', err);
        setLoading(false);
      }
    };
    fetchDates();
  }, [API_BASE_URL]);

  // ✅ Accurate Singapore date generator
  const toSingaporeDate = (inputDate) => {
    const date = new Date(inputDate);
    const formatter = new Intl.DateTimeFormat('en-SG', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(date);

    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;

    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
  };

  const isSameMonthDay = (dateA, dateB) => {
    const a = toSingaporeDate(dateA);
    const b = toSingaporeDate(dateB);
    return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  // ✅ Birthday age calculation
  const getAge = (birthDateStr) => {
    const birthDate = toSingaporeDate(birthDateStr);
    const today = todayDate;

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age -= 1;
    }

    return age;
  };

  // Reference dates
  const todayDate = toSingaporeDate(new Date());
  const nextWeekDate = new Date(todayDate);
  nextWeekDate.setDate(todayDate.getDate() + 7);

  const formatDisplayDate = (d) =>
    toSingaporeDate(d).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // === Today's Events ===
  const todayEvents = dates.filter((d) => {
    const eventDate = toSingaporeDate(d.date);
    const isRecurring = d.isRecurring || d.classification === 'Birthday';

    if (isRecurring) {
      return isSameMonthDay(eventDate, todayDate);
    }

    return eventDate.toDateString() === todayDate.toDateString();
  });

  // === Upcoming (Next 7 Days) ===
  const upcomingEvents = dates
    .filter((d) => {
      const eventDate = toSingaporeDate(d.date);
      const isRecurring = d.isRecurring || d.classification === 'Birthday';

      if (isRecurring) {
        const recurringThisYear = new Date(
          todayDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate()
        );
        return recurringThisYear > todayDate && recurringThisYear <= nextWeekDate;
      }

      return eventDate > todayDate && eventDate <= nextWeekDate;
    })
    .sort((a, b) => toSingaporeDate(a.date) - toSingaporeDate(b.date));

    return (
      <div className="protectedDiv dashboardDiv">
        {isMobile && (
          <div className="useBigScreenDiv">
            USE WIDER SCREEN... <br />
            (Above 600px)
          </div>
        )}
    
        <div className="dashboardContent">
          {/* === LEFT: Main Section === */}
          <div className="dashboardMainDiv">
            {loading ? (
              <div className="skeletonDiv">
                {Array(3)
                  .fill()
                  .map((_, i) => (
                    <SkeletonLoader key={i} type="card" />
                  ))}
              </div>
            ) : (
              <div className='dashboardMainContent'>
                <div className="skeletonDiv">
                {Array(3)
                  .fill()
                  .map((_, i) => (
                    <SkeletonLoader key={i} type="card" />
                  ))}
              </div>
                {/* put your main dashboard content here */}
              </div>
            )}
          </div>
    
          {/* === RIGHT: Sidebar always visible === */}
          <div className="dashboardRightSideBar">
            {/* === Current Date Display === */}
            <div className="currentDateDisplay">
              <h3 className="eventSectionTitle">
                📅 Today is: <span className="dateToday">{formatDisplayDate(todayDate)}</span>
              </h3>
            </div>
    
            {/* === TODAY EVENTS === */}
            <div className="eventSection">
              <h2>🎯 Today's Events</h2>
              {todayEvents.length === 0 ? (
                <p>No events today.</p>
              ) : (
                todayEvents.map((event) => (
                  <div key={event._id} className="eventCard">
                    <strong>{event.title}</strong> — {event.classification}
                    {event.classification === 'Birthday' ? ` (${getAge(event.date)})` : ''}
                  </div>
                ))
              )}
            </div>
    
            {/* === UPCOMING EVENTS === */}
            <div className="eventSection">
              <h2>📆 Upcoming Events</h2>
              {upcomingEvents.length === 0 ? (
                <p>No upcoming events.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event._id} className="eventCard">
                    <strong>{event.title}</strong> — {event.classification}
                    {/* {event.classification === 'Birthday' ? ` (${getAge(event.date)})` : ''} */}
                    <br />
                    On {formatDisplayDate(event.date)}
                    <br />
                    {event.description}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
    
};

export default dashboard;

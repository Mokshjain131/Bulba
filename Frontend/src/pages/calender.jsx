import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/calender.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
    setShowEventForm(true);
  };

  // Add new event
  const addEvent = () => {
    if (newEvent.trim() === "" || !selectedDate) return;
    
    const dateKey = selectedDate.toDateString();
    const updatedEvents = { ...events };
    
    if (!updatedEvents[dateKey]) {
      updatedEvents[dateKey] = [];
    }
    
    updatedEvents[dateKey].push({
      id: Date.now(),
      title: newEvent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    setEvents(updatedEvents);
    setNewEvent("");
    setShowEventForm(false);
  };

  // Delete event
  const deleteEvent = (dateKey, eventId) => {
    const updatedEvents = { ...events };
    updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event.id !== eventId);
    
    if (updatedEvents[dateKey].length === 0) {
      delete updatedEvents[dateKey];
    }
    
    setEvents(updatedEvents);
  };

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toDateString();
      const hasEvents = events[dateKey] && events[dateKey].length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${hasEvents ? 'has-events' : ''} ${selectedDate && selectedDate.getDate() === day ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasEvents && (
            <div className="event-indicator">
              <span className="event-dot"></span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Format month and year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="calendar-page">
      <Navbar />
      
      <div className="calendar-container">
        <div className="calendar-header">
          <h1>Event Calendar</h1>
          <p>Manage your appointments and schedule</p>
        </div>
        
        <div className="calendar-wrapper">
          <div className="calendar-navigation">
            <button onClick={prevMonth} className="nav-button">&lt;</button>
            <h2>{formatMonthYear(currentDate)}</h2>
            <button onClick={nextMonth} className="nav-button">&gt;</button>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>
        </div>
        
        {selectedDate && (
          <div className="events-section">
            <h3>{selectedDate.toDateString()}</h3>
            
            {showEventForm ? (
              <div className="event-form">
                <input
                  type="text"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  placeholder="Enter event details"
                  className="event-input"
                />
                <div className="event-buttons">
                  <button onClick={addEvent} className="add-button">Add Event</button>
                  <button onClick={() => setShowEventForm(false)} className="cancel-button">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowEventForm(true)} className="new-event-button">
                + New Event
              </button>
            )}
            
            <div className="events-list">
              {events[selectedDate.toDateString()] && events[selectedDate.toDateString()].map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-details">
                    <span className="event-time">{event.time}</span>
                    <span className="event-title">{event.title}</span>
                  </div>
                  <button 
                    onClick={() => deleteEvent(selectedDate.toDateString(), event.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {(!events[selectedDate.toDateString()] || events[selectedDate.toDateString()].length === 0) && !showEventForm && (
                <p className="no-events">No events scheduled for this day.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Calendar;

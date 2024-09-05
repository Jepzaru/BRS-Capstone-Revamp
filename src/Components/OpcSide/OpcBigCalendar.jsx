import React, { useState, useEffect } from 'react';
import '../../CSS/OpcCss/OpcBigCalendar.css'; // Import CSS for styling
import SideNavbar from './OpcNavbar';
import Header from '../../Components/UserSide/Header';
import { MdEvent } from 'react-icons/md';
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from 'react-icons/md';


const OpcBigCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState([]); // Store fetched events

  // Assuming the token is stored in localStorage after login
  const token = localStorage.getItem('token');

  // Fetch events when the component mounts or the current month changes
  useEffect(() => {
    fetchEventsForMonth();
  }, [currentDate]);

  const fetchEventsForMonth = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opc/events/getAll`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (response.ok) {
        const result = await response.json();
        setEvents(result); // Store events
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDays = () => {
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Fill the initial empty days for the first week
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Fill the days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const deleteEvent = async (eventId) => {
    try {
      // Send delete request to the backend (this performs the soft delete by setting isDeleted flag)
      const response = await fetch(`http://localhost:8080/opc/events/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      if (response.ok) {
        // After soft delete, remove the event from the frontend state
        setEvents(events.filter(event => event.eventId !== eventId));
        
        // Show an alert message after successful deletion
        alert('Event deleted successfully!');
      } else {
        console.error('Failed to delete event');
        alert('Failed to delete event.');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event.');
    }
  };
  

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }
  };

  const handleEventSubmit = async () => {
    if (!eventTitle || !eventDescription) {
      alert('Please fill in the event title and description');
      return;
    }

    const eventData = {
      eventDate: selectedDate,
      eventTitle: eventTitle,
      eventDescription: eventDescription,
    };

    try {
      const response = await fetch('http://localhost:8080/opc/events/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Event added successfully!');
        setShowAddEvent(false); // Hide the modal
        setEventTitle(''); // Clear input fields
        setEventDescription('');
        fetchEventsForMonth(); // Refresh events after adding
      } else {
        alert('Failed to add event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the event.');
    }
  };

  const renderDays = () => {
    return generateDays().map((day, index) => {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter(
        event => new Date(event.eventDate).toDateString() === dayDate.toDateString()
      ); // Get events for this day

      return (
        <div
          key={index}
          className={`calendar-day${day ? '' : ' empty'}${selectedDate && selectedDate.getDate() === day ? ' selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="day-number">{day}</div>
        </div>
      );
    });
  };

  const renderEvents = () => {
    if (!selectedDate) return null;
  
    const dayEvents = events.filter(
      (event) => new Date(event.eventDate).toDateString() === selectedDate.toDateString()
    );
  
    return (
        <div className="big-calendar-events-content">
        <h2>Events on {selectedDate.toDateString()}</h2>
        {dayEvents.length > 0 ? (
          dayEvents.map((event, index) => (
            <div key={index} className="event-item">
              {/* Wrap title and description together */}
              <div className="event-details">
                <div className="event-title">{event.eventTitle}</div>
                <div className="event-description">{event.eventDescription}</div>
              </div>
              {/* Add delete button separately */}
              <MdDelete
                className="delete-icon"
                style={{ cursor: 'pointer', color: 'red' }} 
                onClick={() => deleteEvent(event.eventId)} 
              />
            </div>
          ))
        ) : (
          <p>No events for this day.</p>
        )}
        
        <button className='event-btn' onClick={() => setShowAddEvent(true)}>
          <IoMdAddCircle style={{ marginBottom: "-2px", marginRight: "10px" }} /> Add Event
        </button>
      </div>
    );
  };

  return (
    <div className="opc-big-calendar-container">
        <h1>
            <MdEvent style={{ color: '#782324' }} />Events
        </h1>
    <div className="opc-big-calendar">
      <Header />
      <SideNavbar />
      <div className="big-calendar">
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          <div className="calendar-day-name">Sun</div>
          <div className="calendar-day-name">Mon</div>
          <div className="calendar-day-name">Tue</div>
          <div className="calendar-day-name">Wed</div>
          <div className="calendar-day-name">Thu</div>
          <div className="calendar-day-name">Fri</div>
          <div className="calendar-day-name">Sat</div>
          {renderDays()}
        </div>
      </div>
      {renderEvents()}
      {showAddEvent && (
        <div className="add-event-modal">
          <h3>Add Event</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <textarea
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          ></textarea>
          <button onClick={handleEventSubmit}>Add Event</button>
          <button onClick={() => setShowAddEvent(false)}>Cancel</button>
        </div>
       )}
     </div>
    </div>
  );
};

export default OpcBigCalendar;
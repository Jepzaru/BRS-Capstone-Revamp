import React, { useState, useEffect } from 'react';
import '../../CSS/OpcCss/OpcBigCalendar.css'; 
import SideNavbar from './OpcNavbar';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import Header from '../../Components/UserSide/Header';
import { MdEvent, MdDelete, MdEdit } from 'react-icons/md';
import { IoMdAddCircle } from "react-icons/io";

const OpcBigCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [approvedReservations, setApprovedReservations] = useState([]);
  const [approvedReturn, setApprovedReturn] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const token = localStorage.getItem('token');
 


  useEffect(() => {
    fetchEventsForMonth();
    fetchApprovedReservationsForMonth();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchEventsForMonth();
      fetchApprovedReservationsForMonth(); 
    }
  }, [selectedDate]);

  const fetchEventsForMonth = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opc/events/getAll`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setEvents(result);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchApprovedReservationsForMonth = async () => {
    try {
      const response = await fetch(`http://localhost:8080/reservations/opc-approved`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setApprovedReservations(result);
        setApprovedReturn(result);
      } else {
        console.error('Failed to fetch approved reservations');
      }
    } catch (error) {
      console.error('Error fetching approved reservations:', error);
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

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/opc/events/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEvents(events.filter(event => event.eventId !== eventId));
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert('Event added successfully!');
        setShowAddEvent(false);
        setEventTitle('');
        setEventDescription('');
        fetchEventsForMonth();
      } else {
        alert('Failed to add event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the event.');
    }
  };

  const handleEditEvent = async () => {
    if (!editTitle || !editDescription) {
      alert('Please fill in the event title and description');
      return;
    }

    const updatedEvent = {
      ...editingEvent,
      eventTitle: editTitle,
      eventDescription: editDescription,
    };

    try {
      const response = await fetch(`http://localhost:8080/opc/events/update/${editingEvent.eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        alert('Event updated successfully!');
        setEvents(events.map(event =>
          event.eventId === updatedEvent.eventId ? updatedEvent : event
        ));
        setEditingEvent(null);
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('An error occurred while updating the event.');
    }
  };

  const renderDays = () => {
    return generateDays().map((day, index) => {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      const hasEvent = events.some(event => new Date(event.eventDate).toDateString() === dayDate.toDateString());
      const hasApprovedReservation = approvedReservations.some(res => new Date(res.schedule).toDateString() === dayDate.toDateString());
      const hasApprovedReturn = approvedReturn.some(res => new Date(res.returnSchedule).toDateString() === dayDate.toDateString());
      

      const dayClass = hasEvent || hasApprovedReservation || hasApprovedReturn ? ' highlighted' : '';
      
      return (
        <div
          key={index}
          className={`opc-big-calendar-day${day ? dayClass : ' empty'}${selectedDate && selectedDate.getDate() === day ? ' selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="opc-big-calendar-day-number">{day}</div>
        </div>
      );
    });
};

  const renderEvents = () => {
    if (!selectedDate) return null;

    const dayEvents = events.filter(
      (event) => new Date(event.eventDate).toDateString() === selectedDate.toDateString()
    );

    const dayApprovedReservations = approvedReservations.filter(
      (res) => new Date(res.schedule).toDateString() === selectedDate.toDateString()
    );

    const dayApprovedReturn = approvedReturn.filter(
      (res) => new Date(res.returnSchedule).toDateString() === selectedDate.toDateString()
    );

    return (
      <div className="opc-big-calendar-events-content">
        <div className="opc-big-calendar-events-content-header">
          <h2>Events on {selectedDate.toDateString()}   
            <button className='opc-big-calendar-event-btn' onClick={() => setShowAddEvent(true)}>
              <IoMdAddCircle style={{ marginBottom: "-2px", marginRight: "10px" }} /> Add New Event
            </button>
          </h2>
        </div>
        {dayEvents.length > 0 ? (
          dayEvents.map((event, index) => (
            <div key={index} className="opc-big-calendar-event-item">
              <div className="opc-big-calendar-event-details">
                <div className="opc-big-calendar-event-title">🚩 {event.eventTitle}</div>
                <div className="opc-big-calendar-event-description">
                  {event.eventDescription}
                </div>
              </div>
              <div className="opc-big-calendar-event-actions">
                <MdEdit
                  className="opc-big-calendar-edit-icon"
                  style={{ cursor: 'pointer', color: '#ffcc00' }}
                  onClick={() => {
                    setEditingEvent(event);
                    setEditTitle(event.eventTitle);
                    setEditDescription(event.eventDescription);
                  }}
                />
                <MdDelete
                  className="opc-big-calendar-delete-icon"
                  style={{ cursor: 'pointer', color: '#782324' }}
                  onClick={() => deleteEvent(event.eventId)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No events for this day.</p>
        )}

        {dayApprovedReservations.length > 0 || dayApprovedReturn.length > 0 ? (
          <>
            {dayApprovedReservations.map((res, index) => (
              <div key={index} className="opc-big-calendar-event-item">
                <div className="opc-big-calendar-event-details">
                  <div className="opc-big-calendar-event-title">🚩 {res.reason} (Departure)</div>
                  <div className="opc-big-calendar-event-description">
                    <p><strong>Date:</strong> {new Date(res.schedule).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(res.schedule).toLocaleTimeString()}</p>
                    <p><strong>Reason:</strong> {res.reason}</p>
                  </div>
                </div>
              </div>
            ))}
            {dayApprovedReturn.map((res, index) => (
              <div key={index} className="opc-big-calendar-event-item">
                <div className="opc-big-calendar-event-details">
                  <div className="opc-big-calendar-event-title">🚩 {res.reason} (Pick Up)</div>
                  <div className="opc-big-calendar-event-description">
                    <p><strong>Date:</strong> {new Date(res.returnSchedule).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(res.returnSchedule).toLocaleTimeString()}</p>
                    <p><strong>Reason:</strong> {res.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No approved reservations for this day.</p>
        )}
      </div>
    );
  };

  return (
    <div className="opc-big-calendar-container">
      <h1>
        <MdEvent style={{ color: '#782324', marginBottom: '-3px', marginRight: '8px' }} /> Calendar Events
      </h1>
      <div className="opc-big-calendar">
        <Header />
        <SideNavbar />
        <div className="big-calendar">
          <div className="opc-big-calendar-header">
            <button className='opc-big-calendar-previous' onClick={prevMonth}><BiSolidLeftArrow style={{marginBottom: '-2px'}}/></button>
            <h2>
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h2>
            <button className='opc-big-calendar-next' onClick={nextMonth}><BiSolidRightArrow  style={{marginBottom: '-2px'}}/></button>
          </div>
          <div className="opc-big-calendar-grid">
            <div className="opc-big-calendar-day-name">Sun</div>
            <div className="opc-big-calendar-day-name">Mon</div>
            <div className="opc-big-calendar-day-name">Tue</div>
            <div className="opc-big-calendar-day-name">Wed</div>
            <div className="opc-big-calendar-day-name">Thu</div>
            <div className="opc-big-calendar-day-name">Fri</div>
            <div className="opc-big-calendar-day-name">Sat</div>
            {renderDays()}
          </div>
        </div>
        {renderEvents()}
        {showAddEvent && (
          <div className="event-modal-overlay">
          <div className="opc-big-calendar-edit-event-modal">
            <h3>Add New Event</h3>
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
            <button onClick={handleEventSubmit} style={{backgroundColor: "#782324"}}>Add New Event</button>
            <button onClick={() => setShowAddEvent(false)}>Cancel</button>
          </div>
          </div>
        )}
        {editingEvent && (
          <div className="event-modal-overlay">
          <div className="opc-big-calendar-edit-event-modal">
            <h3>Edit Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              placeholder="Event Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            ></textarea>
            <button onClick={handleEditEvent} style={{backgroundColor: "#782324"}}>Update Event</button>
            <button onClick={() => setEditingEvent(null)}>Cancel</button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpcBigCalendar;

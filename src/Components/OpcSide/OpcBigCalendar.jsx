import React, { useState, useEffect } from 'react';
import '../../CSS/OpcCss/OpcBigCalendar.css';
import SideNavbar from './OpcNavbar';
import logoImage1 from "../../Images/citbglogo.png";
import { BiSolidRightArrow, BiSolidLeftArrow, BiSolidMessageAltDetail } from "react-icons/bi";
import Header from '../../Components/UserSide/Header';
import { MdEvent, MdDelete, MdEdit } from 'react-icons/md';
import { IoMdAddCircle } from "react-icons/io";
import { IoTime } from "react-icons/io5";
import { FaCalendarDay, FaBus } from "react-icons/fa";

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
  const isPastDate = selectedDate < new Date();

  useEffect(() => {
    fetchEventsForMonth();
    fetchApprovedReservationsForMonth();
  }, [currentDate]);

  const fetchEventsForMonth = async () => {
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/opc/events/getAll`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await fetch(`https://citumovebackend.up.railway.app/reservations/opc-approved`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const generateDays = () => {
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: firstDay }).fill(null);

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
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
      eventTitle,
      eventDescription,
    };

    try {
      const response = await fetch('https://citumovebackend.up.railway.app/opc/events/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
      console.error('Error adding event:', error);
      alert('An error occurred while adding the event.');
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
          <button 
            className='opc-big-calendar-event-btn' 
            onClick={() => setShowAddEvent(true)} 
            disabled={isPastDate} 
            style={{ 
              opacity: isPastDate ? 0.5 : 1,
              cursor: isPastDate ? 'not-allowed' : 'pointer' 
            }}
          >
            <IoMdAddCircle style={{ marginBottom: "-2px", marginRight: "10px" }} /> 
            Add New Event
          </button>
          </h2>
        </div>
        {dayEvents.length > 0 ? (
          dayEvents.map((event, index) => (
            <div key={index} className="opc-big-calendar-event-item">
              <div className="opc-big-calendar-event-details">
                <div className="opc-big-calendar-event-title">📅  {event.eventTitle}</div>
                <div className="opc-big-calendar-event-description">
                  <span style={{fontWeight: "600"}}>Description:</span> {event.eventDescription}
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
                  <div className="opc-big-calendar-event-title1">🚩 {res.reason} (Departure)</div>
                  <div className="opc-big-calendar-event-description1">
                    <p><strong><FaCalendarDay style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Date:</strong> {new Date(res.schedule).toLocaleDateString()}</p>
                    <p><strong><IoTime style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Time:</strong> {new Date(res.schedule).toLocaleTimeString()}</p>
                    <p><strong><BiSolidMessageAltDetail style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Reason:</strong> {res.reason}</p>
                    <p><strong><FaBus style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Vehicle:</strong> {res.vehicleType} - {res.plateNumber}</p>
                    <p><strong><FaBus style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Added Vehicle:</strong> 
                    {res.reservedVehicles && res.reservedVehicles.length > 0 ? (
                        <ul style={{ paddingLeft: "45px", marginTop: "10px" }}>
                          {res.reservedVehicles.map((vehicle, index) => (
                            <li key={index}>{vehicle.vehicleType} - {vehicle.plateNumber}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No Vehicles Added</p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {dayApprovedReturn.map((res, index) => (
              <div key={index} className="opc-big-calendar-event-item">
                <div className="opc-big-calendar-event-details">
                  <div className="opc-big-calendar-event-title1">🚩 {res.reason} (Pick Up)</div>
                  <div className="opc-big-calendar-event-description1">
                    <p><strong><FaCalendarDay style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Date:</strong> {new Date(res.returnSchedule).toLocaleDateString()}</p>
                    <p><strong><IoTime style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Time:</strong> {new Date(res.returnSchedule).toLocaleTimeString()}</p>
                    <p><strong><BiSolidMessageAltDetail style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Reason:</strong> {res.reason}</p>
                    <p><strong><FaBus style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Vehicle:</strong> {res.vehicleType} - {res.plateNumber}</p>
                    <p><strong><FaBus style={{color: "#782324", marginRight: "10px", marginBottom: "-2px"}}/>Added Vehicle:</strong> 
                    {res.reservedVehicles && res.reservedVehicles.length > 0 ? (
                        <ul style={{ paddingLeft: "45px", marginTop: "10px" }}>
                          {res.reservedVehicles.map((vehicle, index) => (
                            <li key={index}>{vehicle.vehicleType} - {vehicle.plateNumber}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No Vehicles Added</p>
                      )}
                    </p>
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
      <img src={logoImage1} alt="Logo" className="driver-logo-image" />
    </div>
  );
};

export default OpcBigCalendar;

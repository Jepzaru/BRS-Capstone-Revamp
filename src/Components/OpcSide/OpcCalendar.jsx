import React, { useState, useEffect } from 'react';
import '../../CSS/OpcCss/OpcCalendar.css';
import { BsCalendar2EventFill } from "react-icons/bs";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const OpcCalendar = () => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [events, setEvents] = useState([]); // General events
  const [reservations, setReservations] = useState([]); // Approved reservations
  const [expandedEvent, setExpandedEvent] = useState(null);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    const today = new Date(currentYear, currentMonth, currentDate.getDate());

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', selected: false, disabled: true });
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date < today;
      const isSelected = selectedDay === i && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      days.push({ day: i, selected: isSelected, disabled: isPast, isPast });
    }

    return days;
  };

  // Fetch approved reservations
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/reservations/opc-approved`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error('Failed to fetch approved reservations:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch general events
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/opc/events/getAll`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data); // Store general events
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchReservations(); // Fetch approved reservations on load
    fetchEvents();       // Fetch general events on load
  }, []);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const toggleDescription = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const getEventsForSelectedDate = () => {
    const selectedDate = new Date(currentYear, currentMonth, selectedDay).toLocaleDateString();

    // Filter reservations for the selected date (Departure)
    const reservationEvents = reservations.filter(res => {
      const departureDate = new Date(res.schedule).toLocaleDateString();
      return departureDate === selectedDate;
    });

    // Filter reservations for the return date
    const returnEvents = reservations.filter(res => {
      if (res.tripType === 'roundTrip') {
        const returnDate = new Date(res.returnSchedule).toLocaleDateString();
        return returnDate === selectedDate;
      }
      return false;
    });

    // Filter general events for the selected date
    const generalEvents = events.filter(event => {
      const eventDate = new Date(event.eventDate).toLocaleDateString();
      return eventDate === selectedDate;
    });

    return { reservationEvents, returnEvents, generalEvents };
  };

  const { reservationEvents, returnEvents, generalEvents } = getEventsForSelectedDate();

  return (
    <div className="opc-calendar">
      <div className="opc-calendar-nav">
        <button className='previous' onClick={prevMonth}>
          <BiSolidLeftArrow />
        </button>
        <div className="opc-calendar-month">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button className='next' onClick={nextMonth}>
          <BiSolidRightArrow />
        </button>
      </div>
      <div className="opc-calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="opc-calendar-day-name">{day}</div>
        ))}
        {generateDays().map((item, index) => (
          <div
            key={index}
            className={`opc-calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.isPast ? ' past' : ''}`}
            onClick={() => !item.disabled && handleDayClick(item.day)}
          >
            {item.day}
          </div>
        ))}
      </div>

      {/* Calendar Events Section */}
      <div className='calendar-events'>
        <h2>
          <BsCalendar2EventFill style={{ marginBottom: "-2px", marginRight: "10px" }} /> Calendar Events
        </h2>
        <div className='calendar-events-content'>
          {/* Show general events for the selected date */}
          {generalEvents.length > 0 && (
            <>
              <h3>General Events</h3>
              {generalEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <h4 onClick={() => toggleDescription(event.eventId)}>
                    📅 {event.eventTitle} 
                  </h4>
                  {expandedEvent === event.eventId && (
                    <div className="event-description">
                      <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(event.eventDate).toLocaleTimeString()}</p>
                      <p><strong>Description:</strong> {event.eventDescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Show reservations for selected date */}
          {(reservationEvents.length > 0 || returnEvents.length > 0) && (
            <>
              <h3>Approved Reservations</h3>
              {reservationEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <h4 onClick={() => toggleDescription(event.eventId)}>
                    🚩 {event.reason} (Departure)
                  </h4>
                  {expandedEvent === event.eventId && (
                    <div className="event-description">
                      <p><strong>Date:</strong> {new Date(event.schedule).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(event.schedule).toLocaleTimeString()}</p>
                      <p><strong>Reason:</strong> {event.reason}</p>
                    </div>
                  )}
                </div>
              ))}
              {returnEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <h4 onClick={() => toggleDescription(event.eventId)}>
                    🚩 {event.reason} (Return)
                  </h4>
                  {expandedEvent === event.eventId && (
                    <div className="event-description">
                      <p><strong>Return Date:</strong> {new Date(event.returnSchedule).toLocaleDateString()}</p>
                      <p><strong>Pickup Time:</strong> {new Date(event.returnSchedule).toLocaleTimeString()}</p>
                      <p><strong>Reason:</strong> {event.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {generalEvents.length === 0 && reservationEvents.length === 0 && returnEvents.length === 0 && (
            <p>No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpcCalendar;

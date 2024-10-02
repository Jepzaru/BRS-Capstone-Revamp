import React, { useState, useEffect } from 'react';
import '../../CSS/OpcCss/OpcCalendar.css';
import { BsCalendar2EventFill } from "react-icons/bs";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const OpcCalendar = () => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [events, setEvents] = useState([]); 
  const [reservations, setReservations] = useState([]); 
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [highlightedDates, setHighlightedDates] = useState(new Set());

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(1); 
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(1);
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', selected: false, disabled: true, isHighlighted: false });
    }
  
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const formattedDate = date.toLocaleDateString();
      const isPast = date < today;
      const isSelected = selectedDay === i && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isHighlighted = highlightedDates.has(formattedDate);
  
      days.push({
        day: i,
        selected: isSelected,
        disabled: false,
        isPast,
        isHighlighted
      });
    }
  
    return days;
  };
  
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
        setEvents(data);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchReservations(); 
    fetchEvents();      
  }, []);

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  const toggleDescription = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const getEventsForSelectedDate = () => {
    const selectedDate = new Date(currentYear, currentMonth, selectedDay).toLocaleDateString();

    const reservationEvents = reservations.filter(res => {
      const departureDate = new Date(res.schedule).toLocaleDateString();
      return departureDate === selectedDate;
    });

    const returnEvents = reservations.filter(res => {
      if (res.tripType === 'roundTrip') {
        const returnDate = new Date(res.returnSchedule).toLocaleDateString();
        return returnDate === selectedDate;
      }
      return false;
    });

    const generalEvents = events.filter(event => {
      const eventDate = new Date(event.eventDate).toLocaleDateString();
      return eventDate === selectedDate;
    });

    return { reservationEvents, returnEvents, generalEvents };
  };

  const { reservationEvents, returnEvents, generalEvents } = getEventsForSelectedDate();

  useEffect(() => {
    const fetchReservationsAndEvents = async () => {
      await fetchReservations();
      await fetchEvents();
  
      const newHighlightedDates = new Set();
  
      reservations.forEach(res => {
        const departureDate = new Date(res.schedule).toLocaleDateString();
        newHighlightedDates.add(departureDate);
  
        if (res.tripType === 'roundTrip') {
          const returnDate = new Date(res.returnSchedule).toLocaleDateString();
          newHighlightedDates.add(returnDate);
        }
      });
  
      events.forEach(event => {
        const eventDate = new Date(event.eventDate).toLocaleDateString();
        newHighlightedDates.add(eventDate);
      });
  
      setHighlightedDates(newHighlightedDates);
    };
  
    fetchReservationsAndEvents();
  }, [reservations, events]);
  

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
              className={`opc-calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.isPast ? ' past' : ''}${item.isHighlighted ? ' highlighted' : ''}`}
              onClick={() => !item.disabled && handleDayClick(item.day)}
            >
              {item.day}
            </div>
          ))}
      </div>

      <div className='calendar-events'>
        <h2>
          <BsCalendar2EventFill style={{ marginBottom: "-2px", marginRight: "10px", color: "#782324" }} /> Calendar Events
        </h2>
        <div className='calendar-events-content'>
      
          {generalEvents.length > 0 && (
            <>
              <h3 style={{marginLeft: '15px'}}>📅 General Events</h3>
              {generalEvents.map((event, index) => (
                <div key={index} className="event-item" onClick={() => toggleDescription(event.eventId)}>
                  <h4 style={{marginLeft: '10px'}}>
                    Event Title: {event.eventTitle} 
                  </h4>
                  {expandedEvent === event.eventId && (
                    <div className="event-description">
                      <p style={{marginLeft: '15px'}}><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                      <p style={{marginLeft: '15px'}}><strong>Time:</strong> {new Date(event.eventDate).toLocaleTimeString()}</p>
                      <p style={{marginLeft: '15px'}}><strong>Description:</strong> {event.eventDescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          
          {(reservationEvents.length > 0 || returnEvents.length > 0) && (
            <>
              <h3 style={{marginLeft: '15px'}}>🚩 Approved Reservations</h3>
              {reservationEvents.map((event, index) => (
                <div key={index} className="event-item" onClick={() => toggleDescription(event.eventId)}>
                  <h4 style={{marginLeft: '15px'}}>
                     Reason: {event.reason} <span style={{color: 'maroon'}}>(Departure)</span>
                  </h4>
                  {expandedEvent === event.eventId && (
                    <div className="event-description">
                      <p style={{marginLeft: '15px'}}><strong>Date:</strong> {new Date(event.schedule).toLocaleDateString()}</p>
                      <p style={{marginLeft: '15px'}}><strong>Time:</strong> {new Date(event.schedule).toLocaleTimeString()}</p>
                      <p style={{marginLeft: '15px'}}><strong>Reason:</strong> {event.reason}</p>
                    </div>
                  )}
                </div>
              ))}
              {returnEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <h4 onClick={() => toggleDescription(event.eventId)}>
                     {event.reason} (Return)
                  </h4>
                  {expandedEvent === event.eventId && (
                    <div className="event-description">
                      <p style={{marginLeft: '15px'}}><strong>Return Date:</strong> {new Date(event.returnSchedule).toLocaleDateString()}</p>
                      <p style={{marginLeft: '15px'}}><strong>Pickup Time:</strong> {new Date(event.returnSchedule).toLocaleTimeString()}</p>
                      <p style={{marginLeft: '15px'}}><strong>Reason:</strong> {event.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {generalEvents.length === 0 && reservationEvents.length === 0 && returnEvents.length === 0 && (
            <p style={{marginLeft: '15px'}}>No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpcCalendar;
import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/calendar.css';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const DriverManagementCalendar = ({ onDateSelect, minDate, returnDate}) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const [events, setEvents] = useState([]); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://citumovebackend.up.railway.app/reservations/opc-approved`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.ok) {
          const data = await response.json(); 
    
          setReservedDates(data.map(reservation => ({
            schedule: new Date(reservation.schedule),
            returnSchedule: reservation.returnSchedule ? new Date(reservation.returnSchedule) : null
          })));
        } else {
          console.error('Failed to fetch approved reservations:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
        

    const fetchEvents = async () => {
      try {
        const response = await fetch('https://citumovebackend.up.railway.app/opc/events/getAll', {
          headers: { "Authorization": `Bearer ${token}` },
        });
    
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
        const data = await response.json();
    
  
        setEvents(data.map(event => new Date(event.eventDate))); 
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchReservations();
    fetchEvents(); 
  }, [token]);

  const generateDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
  
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', selected: false, disabled: true, reserved: false, highlight: false });
    }
  
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date < currentDate; 
      const isBeforeMinDate = minDate && date < minDate;
  
      const reservedInfo = reservedDates.find(res =>
        res.schedule.toDateString() === date.toDateString() ||
        (res.returnSchedule && res.returnSchedule.toDateString() === date.toDateString())
      );
  
      const isReserved = reservedInfo !== undefined;
      const hasEvent = events.some(event => event.toDateString() === date.toDateString());
  
      const isHighlighted = hasEvent; 
  
      days.push({
        day: i,
        selected: selectedDay === i,
        disabled: isPast || isBeforeMinDate || isHighlighted || isReserved,
        reserved: isReserved,
        highlight: isHighlighted 
      });
    }
    return days;
  };

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

  const handleDayClick = (day) => {
    const date = new Date(currentYear, currentMonth, day, 12, 0, 0);
  
    if (returnDate && date < returnDate) {
      return; 
    }
  
    setSelectedDay(day);
    
    const reservedInfo = reservedDates.find(res =>
      res.schedule.getFullYear() === date.getFullYear() &&
      res.schedule.getMonth() === date.getMonth() &&
      res.schedule.getDate() === date.getDate()
    );
  
    if (reservedInfo) {
      const times = [reservedInfo.pickUpTime, reservedInfo.departureTime];
      onDateSelect(date, times);
    } else {
      onDateSelect(date, []);
    }
  };
  
  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className='previous' onClick={prevMonth} disabled={currentMonth === new Date().getMonth()}><BiSolidLeftArrow /></button>
        <div className="calendar-month">{new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <button className='next' onClick={nextMonth}><BiSolidRightArrow /></button>
      </div>
      <div className="calendar-indicator">
        <p>🟡 Booked &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 Holiday or Events</p>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
        {generateDays().map((item, index) => (
          <div
            key={index}
            className={`calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.reserved ? ' reserved' : ''}${item.highlight ? ' highlight' : ''}`} 
            onClick={() => !item.disabled && handleDayClick(item.day)}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverManagementCalendar;

import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/calendar.css';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const Calendar = ({ onDateSelect, minDate, returnDate }) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await fetch('http://localhost:8080/reservations/reserved-dates', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setReservedDates(data.map(d => ({
          schedule: new Date(d.schedule),
          returnSchedule: d.returnSchedule ? new Date(d.returnSchedule) : null,
          status: d.status
        })));
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };
  
    fetchReservedDates();
  }, [token]);

  useEffect(() => {
    if (minDate) {
      const minDay = minDate.getDate();
      if (selectedDay && new Date(currentYear, currentMonth, selectedDay) < minDate) {
        setSelectedDay(null);
      }
    }
  }, [minDate, currentMonth, currentYear]);

  const generateDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
  
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', selected: false, disabled: true, reserved: false, status: '' });
    }
  
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i); 
      const isPast = date < currentDate;
      const isBeforeMinDate = minDate && date < minDate;
      const isAfterReturnDate = returnDate && date > returnDate;
  
      const reservedInfo = reservedDates.find(res =>
        (res.schedule.getFullYear() === date.getFullYear() &&
        res.schedule.getMonth() === date.getMonth() &&
        res.schedule.getDate() === date.getDate()) ||
        (res.returnSchedule && res.returnSchedule.getFullYear() === date.getFullYear() &&
        res.returnSchedule.getMonth() === date.getMonth() &&
        res.returnSchedule.getDate() === date.getDate())
      );
  
      const isReserved = reservedInfo !== undefined;
      const status = isReserved ? reservedInfo.status : '';
  
      days.push({ 
        day: i, 
        selected: selectedDay === i, 
        disabled: isPast || isBeforeMinDate || isAfterReturnDate, 
        isPast,
        reserved: isReserved,
        status 
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
    if (!date) return;
    setSelectedDay(day);   
    onDateSelect(date);
  };

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className='previous' onClick={prevMonth} disabled={currentMonth === new Date().getMonth()}><BiSolidLeftArrow /></button>
        <div className="calendar-month">{new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <button className='next' onClick={nextMonth}><BiSolidRightArrow /></button>
      </div>
      <div className="calendar-indicator">
        <p>🟡 Pending</p>
        <p>🔴 Fully booked</p>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
        {generateDays().map((item, index) => (
          <div
            key={index}
            className={`calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.isPast ? ' past' : ''}${item.reserved ? ' reserved' : ''}${item.status === 'approved' ? ' approved' : ''}`}
            onClick={() => !item.disabled && handleDayClick(item.day)}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
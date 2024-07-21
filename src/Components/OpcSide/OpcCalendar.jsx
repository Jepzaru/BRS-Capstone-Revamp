import React, { useState } from 'react';
import '../../CSS/OpcCss/OpcCalendar.css';
import { BsCalendar2EventFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const OpcCalendar = ({ onDateSelect }) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentDay] = useState(currentDate.getDate());
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const prevMonth = () => {
    if (currentMonth === 0) {
      return;
    }
    setCurrentMonth(currentMonth - 1);
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

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', selected: false, disabled: true });
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date < currentDate && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
      days.push({ day: i, selected: selectedDay === i, disabled: isPast, isPast });
    }

    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    onDateSelect(new Date(currentYear, currentMonth, day));
  };

  return (
    <div className="opc-calendar">
      <div className="opc-calendar-nav">
        <button className='previous' onClick={prevMonth} disabled={currentMonth === currentDate.getMonth()}><BiSolidLeftArrow /></button>
        <div className="opc-calendar-month">{new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <button className='next' onClick={nextMonth}><BiSolidRightArrow /></button>
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
      <div className='calendar-events'>
        <h2><BsCalendar2EventFill style={{marginBottom: "-2px", marginRight: "10px"}} /> Calendar Events 
        <button className='event-btn'>
        <IoMdAddCircle  style={{marginBottom: "-2px", marginRight: "10px"}}/> Add Event</button></h2>
        <div className='calendar-events-content'>

        </div>
      </div>
    </div>
  );
};

export default OpcCalendar;

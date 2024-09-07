import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/calendar.css';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const Calendar = ({ onDateSelect, minDate, returnDate, plateNumber }) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const [reservedTimes, setReservedTimes] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await fetch(`http://localhost:8080/reservations/vehicle-availability?plateNumber=${encodeURIComponent(plateNumber)}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Expected data to be an array");
        }

        const parsedDates = data.map(d => ({
          schedule: new Date(d.schedule),
          returnSchedule: d.returnSchedule ? new Date(d.returnSchedule) : null,
          pickUpTime: d.pickUpTime,
          departureTime: d.departureTime,
          status: d.status,
        }));

        setReservedDates(parsedDates);
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    if (plateNumber) {
      fetchReservedDates();
    }
  }, [plateNumber, token]);

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
        res.schedule.toDateString() === date.toDateString() ||
        (res.returnSchedule && res.returnSchedule.toDateString() === date.toDateString())
      );

      const isReserved = reservedInfo !== undefined;
      const status = isReserved ? reservedInfo.status : '';

      days.push({
        day: i,
        selected: selectedDay === i,
        disabled: isPast || isBeforeMinDate || isAfterReturnDate,
        isPast,
        reserved: isReserved,
        status,
        pickUpTime: isReserved ? reservedInfo.pickUpTime : '',
        departureTime: isReserved ? reservedInfo.departureTime : ''
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
    setSelectedDay(day);

    const reservedInfo = reservedDates.find(res =>
      res.schedule.getFullYear() === date.getFullYear() &&
      res.schedule.getMonth() === date.getMonth() &&
      res.schedule.getDate() === date.getDate()
    );

    if (reservedInfo) {
      setReservedTimes([reservedInfo.pickUpTime, reservedInfo.departureTime]);
      console.log(`Reserved times for ${date.toDateString()}:`);
      console.log(`Pick-up Time: ${reservedInfo.pickUpTime}`);
      console.log(`Departure Time: ${reservedInfo.departureTime}`);
    } else {
      setReservedTimes([]);
      console.log(`No reservations for ${date.toDateString()}`);
    }

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
            className={`calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.isPast ? ' past' : ''}${item.reserved ? ' reserved' : ''}${item.status === 'Approved' ? ' approved' : ''}`}
            onClick={() => !item.disabled && handleDayClick(item.day)}
          >
            {item.day}
            {item.selected && item.reserved && reservedTimes.length > 0 && (
              <div className="reserved-times">
                {reservedTimes.map((time, idx) => (
                  <div key={idx} className="reserved-time" style={{ color: 'red' }}>
                    {formatTime(time)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const formatTime = (time) => {
  if (!time || time === "N/A") return '';
  const [hours, minutes] = time.split(':');
  const formattedHours = (parseInt(hours, 10) % 12) || 12;
  const amPm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${minutes} ${amPm}`;
};

export default Calendar;
import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/calendar.css';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const Calendar = ({ onDateSelect, minDate, returnDate, plateNumber }) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReservedDates = async () => {
      if (!plateNumber) return;

      try {
        const responses = await Promise.all([
          fetch(`http://localhost:8080/reservations/vehicle-availability?plateNumber=${encodeURIComponent(plateNumber)}`, {
            headers: { "Authorization": `Bearer ${token}` },
          }),
          fetch(`http://localhost:8080/reservations/multiple-vehicle-availability?plateNumber=${encodeURIComponent(plateNumber)}`, {
            headers: { "Authorization": `Bearer ${token}` },
          })
        ]);

        const dataPromises = responses.map(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        });

        const [data1, data2] = await Promise.all(dataPromises);
        const combinedData = [...data1, ...data2];

        const parsedDates = combinedData.map(d => ({
          schedule: new Date(d.schedule),
          returnSchedule: d.returnSchedule ? new Date(d.returnSchedule) : null,
          pickUpTime: d.pickUpTime,
          departureTime: d.departureTime,
          status: d.status,
        }));

        // Remove duplicate dates
        const uniqueDates = Array.from(new Set(parsedDates.map(a => a.schedule.getTime())))
          .map(time => {
            return parsedDates.find(a => a.schedule.getTime() === time);
          });

        setReservedDates(uniqueDates);
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    fetchReservedDates();
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
      days.push({ day: '', selected: false, disabled: true, reserved: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date < currentDate;
      const isBeforeMinDate = minDate && date < minDate;
      const isAfterReturnDate = returnDate && date >= returnDate;

      const reservedInfo = reservedDates.find(res =>
        res.schedule.toDateString() === date.toDateString() ||
        (res.returnSchedule && res.returnSchedule.toDateString() === date.toDateString())
      );

      const isReserved = reservedInfo !== undefined;

      days.push({
        day: i,
        selected: selectedDay === i,
        disabled: isPast || isBeforeMinDate,
        reserved: isReserved,
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

    // Allow selecting the same date for both 'Schedule' and 'Return Schedule'
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
            className={`calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.reserved ? ' reserved' : ''}`}
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

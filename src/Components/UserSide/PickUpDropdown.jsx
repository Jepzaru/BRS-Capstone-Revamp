// PickUpDropdown.jsx

import React, { useEffect, useState } from 'react';
import '../../CSS/UserCss/TimeDropdown.css'; 

const PickUpDropdown = ({ selectedTime, onChange, name, disabled, plateNumber, date, token }) => {
  const [reservedTimes, setReservedTimes] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const formatFetchedTime = (time) => {
    if (!time) return null;
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'PM' ? String(+hours + 12).padStart(2, '0') : String(hours).padStart(2, '0');
    }
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchReservedTimes = async () => {
      if (plateNumber && date && token) {
        const formattedDate = formatDate(date);
        try {
          const response = await fetch(`http://localhost:8080/reservations/by-plate-and-date?plateNumber=${plateNumber}&date=${formattedDate}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setReservedTimes(data.map(item => ({
            departureTime: formatFetchedTime(item.departureTime),
            pickUpTime: formatFetchedTime(item.pickUpTime),
          })));
        } catch (error) {
          console.error('Error fetching reserved pick-up times:', error);
        }
      }
    };

    fetchReservedTimes();
  }, [plateNumber, date, token]);

  const isReserved = (time) => {
    const formattedTime = time.replace(':', '');
    return reservedTimes.some(({ pickUpTime }) => {
      const formattedPickUp = pickUpTime?.replace(':', '') || '';
      const timeInMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const checkBuffer = (t, isAfter) => {
        const buffer = 120; // 2 hours
        const formattedTime = timeInMinutes(time);
        const reservedTime = timeInMinutes(t);
        if (isAfter) {
          return formattedTime >= reservedTime && formattedTime <= timeInMinutes(addMinutes(t, buffer));
        } else {
          return formattedTime <= reservedTime && formattedTime >= timeInMinutes(subtractMinutes(t, buffer));
        }
      };
      return (pickUpTime && checkBuffer(pickUpTime, false));
    });
  };

  const generateTimes = () => {
    const times = [];
    const start = 0;
    const end = 24;
    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;
        const time = `${formattedHour}:${formattedMinute}`;
        times.push(time);
      }
    }
    return times;
  };

  const times = generateTimes();

  return (
    <div className="custom-dropdown">
      <select
        id={name}
        name={name}
        value={selectedTime}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="" disabled>Select Pick-up Time</option>
        {times.map(time => (
          <option
            key={time}
            value={time}
            style={{ color: isReserved(time) ? 'red' : 'black', fontWeight: '700' }}
            disabled={isReserved(time)}
          >
            {formatTime(time)}
          </option>
        ))}
      </select>
    </div>
  );
};

const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const formattedHours = (hours % 12) || 12;
  const amPm = hours >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${minutes} ${amPm}`;
};

const addMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins);
  date.setMinutes(date.getMinutes() + minutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const subtractMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins);
  date.setMinutes(date.getMinutes() - minutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default PickUpDropdown;

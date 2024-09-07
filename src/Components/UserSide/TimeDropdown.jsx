import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/TimeDropdown.css'; 

const TimeDropdown = ({ times, selectedTime, onChange, isReserved, name, plateNumber }) => {
  const token = localStorage.getItem('token')

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
  
        console.log('Fetched Reserved Dates:', parsedDates);
  
        setReservedDates(parsedDates);
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };
  
    if (plateNumber) {
      fetchReservedDates();
    }
  }, [plateNumber, token]); 


  return (
    <div className="custom-dropdown">
      <select
        id={name}
        name={name}
        value={selectedTime}
        onChange={onChange}
      >
        <option value="" disabled>Select {name === "departureTime" ? 'Departure' : 'Pick-up'} Time</option>
        {times.map(time => (
          <option
            key={time}
            value={time}
            className={isReserved(time) ? 'reserved' : ''}
            style={isReserved(time) ? { color: 'red' } : {}}
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

export default TimeDropdown;
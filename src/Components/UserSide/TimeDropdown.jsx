import React from 'react';
import '../../CSS/UserCss/TimeDropdown.css'; 

const TimeDropdown = ({ times, selectedTime, onChange, reservedTimes = [], name }) => {
  
  const formatTimeForComparison = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const formattedHours = (hours % 12) || 12;
    const amPm = hours >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${amPm}`;
  };

  const isReserved = (time) => reservedTimes.includes(formatTimeForComparison(time));

  return (
    <div className="custom-dropdown">
      <select
        id={name}
        name={name}
        value={selectedTime}
        onChange={onChange}
      >
        <option value="" disabled>Select {name === "departureTime" ? 'Departure' : 'Pick-up'} Time</option>
        {times.map(time => {
          const reserved = isReserved(time);
          return (
            <option
              key={time}
              value={time}
              className={reserved ? 'reserved' : ''}
              disabled={reserved}
            >
              {formatTime(time)}
            </option>
          );
        })}
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

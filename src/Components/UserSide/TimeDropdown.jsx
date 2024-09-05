import React from 'react';
import '../../CSS/UserCss/TimeDropdown.css'; 

const TimeDropdown = ({ times, selectedTime, onChange, isReserved }) => {
  return (
    <div className="custom-dropdown">
      <select
        id="departureTime"
        name="departureTime"
        value={selectedTime}
        onChange={onChange}
      >
        <option value="" disabled>Select Departure Time</option>
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

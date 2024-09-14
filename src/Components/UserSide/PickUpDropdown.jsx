import React, { useEffect, useState } from 'react';
import '../../CSS/UserCss/TimeDropdown.css'; 

const PickUpDropdown = ({ selectedTime, onChange, name, disabled, plateNumber, date, token }) => {
  console.log('PickUpDropdown - Received plateNumber:', plateNumber);
  console.log('PickUpDropdown - Received date:', date);

  const [reservedTimes, setReservedTimes] = useState([]);

  // Function to format date to "YYYY-MM-DD"
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2); // Add leading zero to month
    const day = (`0${d.getDate()}`).slice(-2);       // Add leading zero to day
    return `${year}-${month}-${day}`;  // Use hyphens instead of slashes
  };

  // Function to format fetched time (like "1:30 PM") into "HH:MM" (24-hour format)
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

  // Function to fetch reserved times
  useEffect(() => {
    const fetchReservedTimes = async () => {
      if (plateNumber && date && token) {
        const formattedDate = formatDate(date); // Format the date to "YYYY-MM-DD"
        console.log('Formatted date:', formattedDate); // Log the formatted date
        
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
  
          console.log('Successfully fetched reserved times:', data);
        } catch (error) {
          console.error('Error fetching reserved times:', error);
        }
      }
    };
  
    fetchReservedTimes();
  }, [plateNumber, date, token]);

  // Function to check if a time is reserved (either departure or pick-up time)
  const isReserved = (time) => {
    const formattedTime = time.replace(':', ''); // Convert "HH:MM" to "HHMM"
    const reserved = reservedTimes.some(({ departureTime, pickUpTime }) => {
      const formattedDeparture = departureTime?.replace(':', '') || ''; // Convert "HH:MM" to "HHMM"
      const formattedPickUp = pickUpTime?.replace(':', '') || ''; // Convert "HH:MM" to "HHMM"
      
      console.log(`Checking time: ${formattedTime} against departure: ${formattedDeparture} and pickup: ${formattedPickUp}`);
      
      return formattedTime === formattedDeparture || formattedTime === formattedPickUp;
    });
    return reserved;
  };

  // Generate time options with 30-minute intervals
  const generateTimes = () => {
    const times = [];
    const start = 0; // Start at midnight
    const end = 24;  // End at midnight of the next day

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

  // Generate the list of times
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
        <option value="" disabled>Select Time</option>
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

// Function to format time as 12-hour clock
const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const formattedHours = (hours % 12) || 12;
  const amPm = hours >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${minutes} ${amPm}`;
};

export default PickUpDropdown;

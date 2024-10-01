import React, { useEffect, useState } from 'react';
import '../../CSS/UserCss/TimeDropdown.css';

const PickUpDropdown = ({ selectedTime, onChange, name, disabled, plateNumber, addedPlateNumbers, date, token }) => {
  const [reservedTimes, setReservedTimes] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchReservedTimes = async () => {
      if (!date || !token) return;

      const plates = addedPlateNumbers.length > 0 ? addedPlateNumbers.join(',') : plateNumber;
      const formattedDate = formatDate(date);
      const urls = [
        `http://localhost:8080/reservations/by-plate-and-date?plateNumber=${plateNumber}&date=${formattedDate}`,
        `http://localhost:8080/multiple/reservations/by-plate-and-date?plateNumber=${plates}&date=${formattedDate}`,
      ];

      try {
        const responses = await Promise.all(urls.map(url =>
          fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ));

        const dataPromises = responses.map(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        });

        const allReservedTimes = await Promise.all(dataPromises);
        const combinedReservedTimes = [].concat(...allReservedTimes);

        setReservedTimes(combinedReservedTimes.map(item => ({
          departureTime: formatFetchedTime(item.departureTime),
          pickUpTime: formatFetchedTime(item.pickUpTime),
        })));
      } catch (error) {
        console.error('Error fetching reserved times:', error);
      }
    };

    fetchReservedTimes();
  }, [plateNumber, addedPlateNumbers, date, token]);

  const formatFetchedTime = (time) => {
    if (!time) return null;
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (modifier === 'PM' && hours !== '12') {
      hours = String(+hours + 12).padStart(2, '0');
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours}:${minutes}`;
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

  const isReserved = (time) => {
    return reservedTimes.some(({ departureTime, pickUpTime }) => {
      const timeInMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };

      const checkBuffer = (t, isAfter) => {
        const buffer = 120;
        const formattedTime = timeInMinutes(time);
        const reservedTime = timeInMinutes(t);
        if (isAfter) {
          return formattedTime >= reservedTime && formattedTime <= timeInMinutes(addMinutes(t, buffer));
        } else {
          return formattedTime <= reservedTime && formattedTime >= timeInMinutes(subtractMinutes(t, buffer));
        }
      };

      return (
        (departureTime && checkBuffer(departureTime, true)) ||
        (pickUpTime && checkBuffer(pickUpTime, false))
      );
    });
  };

  const generateTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;
        times.push(`${formattedHour}:${formattedMinute}`);
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
        <option value="" disabled>Select Pick Up Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
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

export default PickUpDropdown;

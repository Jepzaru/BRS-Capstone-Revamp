import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/AddVehicleModal.css';
import { IoMdCloseCircle } from "react-icons/io";

const AddVehicleModal = ({ isOpen, onClose, onAdd, selectedPlateNumber, addedVehiclePlates, schedule, returnSchedule }) => {
  const [vehicles, setVehicles] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
      fetchMainVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
        
        const vehicleResponse = await fetch('http://localhost:8080/vehicle/getAll', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!vehicleResponse.ok) {
            throw new Error(`HTTP error! Status: ${vehicleResponse.status}`);
        }

        const allVehicles = await vehicleResponse.json();

     
        const formattedSchedule = new Date(schedule).toISOString().split('T')[0];
        const formattedReturnSchedule = new Date(returnSchedule).toISOString().split('T')[0];

    
        let reservedPlateUrl = `http://localhost:8080/reservations/multiple-reserved/plate-numbers?schedule=${formattedSchedule}`;
        
        if (returnSchedule) {
            reservedPlateUrl += `&returnSchedule=${formattedReturnSchedule}`; 
        }

        const reservedPlateResponse = await fetch(reservedPlateUrl, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!reservedPlateResponse.ok) {
            throw new Error(`HTTP error! Status: ${reservedPlateResponse.status}`);
        }

        const reservedPlateNumbers = await reservedPlateResponse.json();
        const reservedPlateNumberList = reservedPlateNumbers.map(item => item.plateNumber);
        const filteredVehicles = allVehicles.filter(vehicle =>
            vehicle.plateNumber !== selectedPlateNumber && 
            !addedVehiclePlates.includes(vehicle.plateNumber) && 
            !reservedPlateNumberList.includes(vehicle.plateNumber)
        );
      
        setVehicles(filteredVehicles);

    } catch (error) {
        console.error('Failed to fetch vehicles:', error);
    }
};

const fetchMainVehicles = async () => {
  try {
      
      const vehicleResponse = await fetch('http://localhost:8080/vehicle/getAll', {
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });

      if (!vehicleResponse.ok) {
          throw new Error(`HTTP error! Status: ${vehicleResponse.status}`);
      }

      const allVehicles = await vehicleResponse.json();
      const formattedSchedule = new Date(schedule).toISOString().split('T')[0];
      const formattedReturnSchedule = new Date(returnSchedule).toISOString().split('T')[0];

      let reservedPlateUrl = `http://localhost:8080/reservations/main-plate-numbers?schedule=${formattedSchedule}`;
      
      if (returnSchedule) {
          reservedPlateUrl += `&returnSchedule=${formattedReturnSchedule}`; 
      }

      const reservedPlateResponse = await fetch(reservedPlateUrl, {
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });

      if (!reservedPlateResponse.ok) {
          throw new Error(`HTTP error! Status: ${reservedPlateResponse.status}`);
      }

      const reservedPlateNumbers = await reservedPlateResponse.json();
      const reservedPlateNumberList = reservedPlateNumbers.map(item => item.plateNumber);
      const filteredVehicles = allVehicles.filter(vehicle =>
          vehicle.plateNumber !== selectedPlateNumber && 
          !addedVehiclePlates.includes(vehicle.plateNumber) && 
          !reservedPlateNumberList.includes(vehicle.plateNumber)
      );

    
      setVehicles(filteredVehicles);

  } catch (error) {
      console.error('Failed to fetch vehicles:', error);
  }
};

  const handleSelectVehicle = (vehicle) => {
    onAdd(vehicle); 
    onClose(); 
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Reserved':
        return 'status-reserved';
      default:
        return '';
    }
  };

 
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="addvehicle-overlay">
      <div className="addvehicle-content">
        <h2>
          Select Vehicle
          <button className="addvehicle-close" onClick={onClose}>
            <IoMdCloseCircle />
          </button>
        </h2>

  
        <div className="schedule-info">
          <p><strong>Schedule:</strong> {formatDate(schedule)}</p>
          <p><strong>Return Schedule:</strong> {formatDate(returnSchedule)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Vehicle Type</th>
              <th>Plate Number</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.plateNumber}</td>
                  <td>{vehicle.capacity}</td>
                  <td className={getStatusClass(vehicle.status)}>{vehicle.status}</td>
                  <td>
                    <button
                      className='addvehicle-select-btn'
                      onClick={() => handleSelectVehicle(vehicle)}
                    >
                      Select vehicle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No available vehicles on the dates selected
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddVehicleModal;

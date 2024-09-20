import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/AddVehicleModal.css';
import { IoMdCloseCircle } from "react-icons/io";

const AddVehicleModal = ({ isOpen, onClose, onAdd, selectedPlateNumber, addedVehiclePlates }) => {
  const [vehicles, setVehicles] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:8080/vehicle/getAll', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      // Filter out the vehicle with the selected plate number
      const filteredVehicles = data.filter(vehicle => 
        vehicle.plateNumber !== selectedPlateNumber && !addedVehiclePlates.includes(vehicle.plateNumber)
      );
      setVehicles(filteredVehicles);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const handleSelectVehicle = (vehicle) => {
    onAdd(vehicle); // Pass the selected vehicle to the parent component
    onClose(); // Close the modal
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
            {vehicles.map(vehicle => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddVehicleModal;
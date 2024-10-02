import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/AddVehicleModal.css';
import { IoMdCloseCircle } from "react-icons/io";

const ResendVehicleModal = ({ isOpen, onClose, onSubmit, onUpdateRequest  }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
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
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle); 
  };

  const handleSubmit = () => {
    if (selectedVehicle) {
      onSubmit(selectedVehicle); 
      onClose();
    } else {
      alert("Please select a vehicle before submitting.");
    }
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>
          Select Vehicle
          <button className="modal-close" onClick={onClose}>
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
                    className={`select-btn ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                    onClick={() => handleSelectVehicle(vehicle)}
                  >
                    {selectedVehicle?.id === vehicle.id ? 'Selected' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-footer">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ResendVehicleModal;

import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaBus, FaRegTrashAlt, FaSortAlphaDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdAddCircle } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineSystemUpdateAlt, MdOutlineRadioButtonChecked } from "react-icons/md";
import { PiNumberSquareZeroFill } from "react-icons/pi";
import { FaUserGroup } from "react-icons/fa6";
import { RiAlarmWarningFill } from "react-icons/ri";
import '../../CSS/OpcCss/VehicleManagement.css';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const plateNumberPattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;
  const [updateVehicleType, setUpdateVehicleType] = useState('');
  const [updatePlateNumber, setUpdatePlateNumber] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateCapacity, setUpdateCapacity] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('vehicleType'); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:8080/vehicle/getAll', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, [token]);


  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        if (isAddModalOpen) closeAddModal();
        if (isUpdateModalOpen) closeUpdateModal();
        if (isDeleteModalOpen) closeDeleteModal();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, isAddModalOpen, isUpdateModalOpen, isDeleteModalOpen]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setIsClosing(false);
  };

  const closeAddModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsAddModalOpen(false);
    }, 300);
  };

  const openUpdateModal = (vehicle) => {
    if (!vehicle) {
      console.error('Vehicle object is missing');
      return;
    }
    setUpdateVehicleType(vehicle.vehicleType);
    setUpdatePlateNumber(vehicle.plateNumber);
    setUpdateCapacity(vehicle.capacity);
    setUpdateStatus(vehicle.status);
    setSelectedVehicleId(vehicle.id);
    setIsUpdateModalOpen(true);
    setIsClosing(false);
  };  
  
  const closeUpdateModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsUpdateModalOpen(false);
    }, 300);
  };

  const openDeleteModal = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedVehicleId(null);
  };

  const validatePlateNumber = (plateNumber) => {
    return plateNumberPattern.test(plateNumber);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    
    // Validate plate number format first
    if (!validatePlateNumber(plateNumber)) {
      setErrorMessage('Invalid plate number format. Please use the format "TGR-6GT".');
      return;
    }
  
    // Fetch all vehicles to check if the plate number exists
    try {
      const response = await fetch('http://localhost:8080/vehicle/getAll', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
  
      // Check if the plate number already exists in the fetched vehicles
      const existingVehicle = data.find(vehicle => vehicle.plateNumber === plateNumber);
      if (existingVehicle) {
        setErrorMessage(`A vehicle with plate number ${plateNumber} already exists.`);
        return; // Stop execution here to prevent modal closing
      }
  
      // If plate number is unique, proceed to add the new vehicle
      const vehicleData = { vehicleType, plateNumber, capacity: Number(capacity) };
      const addResponse = await fetch('http://localhost:8080/opc/vehicle/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });
  
      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        throw new Error('Failed to add vehicle: ' + errorText);
      }
  
      const newVehicle = await addResponse.json();
      setVehicles([newVehicle, ...vehicles]);
      setSuccessMessage('Vehicle added successfully!');
      setVehicleType('');
      setPlateNumber('');
      setCapacity('');
  
     
      closeAddModal();
  
    } catch (error) {
      setErrorMessage('Error adding vehicle: ' + error.message);
    }
  };
  
  
  const handleUpdateVehicle = async () => {
    if (!validatePlateNumber(updatePlateNumber)) {
      setErrorMessage('Invalid plate number format. Please use the format "TGR-6GT".');
      return;
    }
    const capacityNumber = Number(updateCapacity);
    if (isNaN(capacityNumber) || capacityNumber < 0) {
      setErrorMessage('Capacity must be a non-negative number');
      return;
    }
    try {
      const requestData = {
        vehicleType: updateVehicleType,
        plateNumber: updatePlateNumber,
        capacity: capacityNumber,
        status: updateStatus
      };
  
      const response = await fetch(`http://localhost:8080/opc/vehicle/update/${selectedVehicleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(requestData), 
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to update vehicle: ' + errorText);
      }
      setSuccessMessage('Vehicle updated successfully!');
      closeUpdateModal();
  
      const updatedVehicles = await fetch('http://localhost:8080/opc/vehicle/getAll', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!updatedVehicles.ok) {
        throw new Error('Failed to fetch updated vehicle list');
      }
      const data = await updatedVehicles.json();
      setVehicles(data);
  
    } catch (error) {
      setErrorMessage('Error updating vehicle: ' + error.message);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicleId) return;
    try {
      const response = await fetch(`http://localhost:8080/opc/vehicle/delete/${selectedVehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to delete vehicle: ' + errorText);
      }
      setSuccessMessage('Vehicle deleted successfully!');
      closeDeleteModal();
      const updatedVehicles = await fetch('http://localhost:8080/opc/vehicle/getAll', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await updatedVehicles.json();
      setVehicles(data);
    } catch (error) {
      setErrorMessage('Error deleting vehicle: ' + error.message);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  

  return (
    <div className="vehiclemanage">
      <Header />
      <div className={`vehicle-manage-content1 ${isAddModalOpen ? 'dimmed' : ''}`}>
        <SideNavbar />
        <div className="vehicle1">
          <div className="header-container">
            <h1><FaBus style={{ marginRight: "15px", color: "#782324" }} />Vehicle Management</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Vehicle"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /> Search</button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select value={sortOption} onChange={handleSortChange} className="sort-dropdown">
                <option value="vehicleType">Vehicle Type</option>
                <option value="plateNumber">Plate Number</option>
                <option value="capacity">Capacity</option>
              </select>
              <button className='add-vehicle-btn' onClick={openAddModal}><MdAddCircle style={{ marginRight: "10px", marginBottom: "-2px" }} />Add new Vehicle</button>
            </div>
          </div>
          <div className='vehicle-list-container'>
            <table className="vehicle-table">
              <thead>
                <tr>
                  <th><FaBus style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Vehicle Type</th>
                  <th><PiNumberSquareZeroFill  style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Plate Number</th>
                  <th><FaUserGroup style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Maximum Capacity</th>
                  <th><RiAlarmWarningFill style={{color: 'maroon', marginRight: '5px'}}/>  Status</th>
                  <th><MdOutlineRadioButtonChecked style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.vehicleType}</td>
                      <td>{vehicle.plateNumber}</td>
                      <td>{vehicle.capacity}</td>
                      <td style={{ fontWeight: '700',color: vehicle.status === 'Available' ? 'green' : vehicle.status === 'Reserved' ? 'red' : 'orange' }}>
                      {vehicle.status}
                      </td>
                      <td className='td-action'>
                        <button className="update-button" onClick={() => openUpdateModal(vehicle)}><MdOutlineSystemUpdateAlt style={{marginBottom: "-2px", marginRight: "5px"}}/> Update</button>
                        <button className="delete-button" onClick={() => openDeleteModal(vehicle.id)}><FaRegTrashAlt style={{marginBottom: "-2px", marginRight: "5px"}}/> Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No Vehicle Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="vehicle-logo-image" />
        </div>
      </div>
      {isAddModalOpen && (
        <div className={`vehicle-modal-overlay ${isClosing ? 'vehicle-modal-closing' : ''}`}>
          <form action="" onSubmit={handleAddVehicle}>
            <div className={`vehicle-modal ${isClosing ? 'vehicle-modal-closing' : ''}`}>
              <h2>Add New Vehicle <button className="close-vehicle-btn" onClick={closeAddModal}><IoIosCloseCircle style={{fontSize: "32px", marginBottom: "-8px"}}/></button></h2>
              <div className='add-vehicle-input'>
                <label htmlFor='vehicle-name'>Vehicle Name</label>
                <input
                  type="text"
                  placeholder="Ex. Coaster"
                  value={vehicleType}
                  required
                  onChange={(e) => setVehicleType(e.target.value)}
                />
                <label htmlFor='vehicle-plate-number'>Plate Number</label>
                <input
                  type="text"
                  placeholder="Ex. TRS-123"
                  value={plateNumber}
                  required
                  onChange={(e) => setPlateNumber(e.target.value)}
                />
                <label htmlFor='vehicle-capacity'>Maximum Capacity</label>
                <input
                  type="number"
                  placeholder="Ex. 30"
                  value={capacity}
                  required
                  min="1"
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className='add-vehicle-buttons'>
                <button className='add-vehicle-submit-btn'>Add Vehicle</button>
              </div>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </form>
        </div>
      )}
      {isUpdateModalOpen && (
        <div className={`vehicle-modal-overlay ${isClosing ? 'vehicle-modal-closing' : ''}`}>
          <form action="" onSubmit={handleUpdateVehicle}>
            <div className={`vehicle-modal ${isClosing ? 'vehicle-modal-closing' : ''}`}>
              <h2>Update Vehicle 
                <button className="close-vehicle-btn" onClick={closeUpdateModal}>
                  <IoIosCloseCircle style={{fontSize: "32px", marginBottom: "-8px"}}/>
                </button>
              </h2>
              <div className='add-vehicle-input'>
                <label htmlFor='vehicle-name'>Vehicle Name</label>
                <input
                  type="text"
                  placeholder="Vehicle Type"
                  value={updateVehicleType}
                  onChange={(e) => setUpdateVehicleType(e.target.value)}
                  required
                />
                <label htmlFor='vehicle-plate-number'>Plate Number</label>
                <input
                  type="text"
                  placeholder="Plate Number"
                  value={updatePlateNumber}
                  onChange={(e) => setUpdatePlateNumber(e.target.value)}
                  required
                />
                <label htmlFor='vehicle-capacity'>Maximum Capacity</label>
                <input
                  type="number"
                  placeholder="Maximum Capacity"
                  value={updateCapacity}
                  min="1"
                  onChange={(e) => setUpdateCapacity(e.target.value)}
                  required
                />
                 <label htmlFor='vehicle-status'>Status</label>
                <input
                  type="text"
                  placeholder="Status"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  required
                />
              </div>
              <div className='add-vehicle-buttons'>
                <button className="add-vehicle-submit-btn" >Update Vehicle</button>
              </div>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </form>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Are you sure you want to delete this vehicle?</h2>
            <div className="delete-modal-buttons">
              <button className="cancel-button" onClick={closeDeleteModal}>Cancel</button>
              <button className="delete-button-confirm" onClick={() => handleDeleteVehicle(selectedVehicleId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;

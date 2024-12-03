import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../../Components/UserSide/Header';
import VehicleManagementCalendar from './VehicleManagementCalendar';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaBus, FaRegTrashAlt, FaSortAlphaDown, FaTools } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdAddCircle } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineSystemUpdateAlt, MdOutlineRadioButtonChecked } from "react-icons/md";
import { PiNumberSquareZeroFill } from "react-icons/pi";
import { FaUserGroup, FaCircleCheck } from "react-icons/fa6";
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
  const [updateMaintenanceStartDate, setUpdateMaintenanceStartDate] = useState('');
  const [updateMaintenanceEndDate, setUpdateMaintenanceEndDate] = useState('');
  const [filterType, setFilterType] = useState("all");
  const [vehicleSchedList, setVehicleSchedList] = useState([]);
  const [maintenanceFilterType, setMaintenanceFilterType] = useState('all');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [vehicleToComplete, setVehicleToComplete] = useState(null);
  const [updateMaintenanceDetails, setUpdateMaintenanceDetails] = useState('');
  const [maintenanceDetails, setMaintenanceDetails] = useState([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('https://citumovebackend.up.railway.app/vehicle/getAll', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const data = await response.json();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, [token]);

  useEffect(() => {
    const fetchMaintenanceDetails = async () => {
      try {
        const response = await fetch('https://citumovebackend.up.railway.app/opc/vehicle/maintenance-details', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch maintenance details');
        const data = await response.json();
        setMaintenanceDetails(data); 
      } catch (error) {
        console.error('Error fetching maintenance details:', error);
      }
    };
    fetchMaintenanceDetails();
  }, [token]);
  
  const completeMaintenance = async (vehicleId) => {
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/opc/vehicle/maintenance-status/${vehicleId}?isCompleted=true`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      if (response.ok) {
        const updatedVehicle = await response.json();
  
        setVehicles((prevVehicles) => 
          prevVehicles.map((vehicle) => 
            vehicle.id === vehicleId ? { ...vehicle, status: 'Completed' } : vehicle
          )
        );
  
        fetchMaintenanceDetails(); 
        setIsConfirmModalOpen(false);
      } else {
        console.error('Failed to update maintenance status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSortChange = useCallback((event) => {
    setSortOption(event.target.value);
  }, []);

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

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
    setIsClosing(false);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => setIsAddModalOpen(false), 300);
  }, []);

  const openUpdateModal = useCallback((vehicle) => {
    setUpdateVehicleType(vehicle.vehicleType);
    setUpdatePlateNumber(vehicle.plateNumber);
    setUpdateCapacity(vehicle.capacity);
    setUpdateStatus(vehicle.status);
    setUpdateMaintenanceStartDate(vehicle.maintenanceStartDate || '');
    setUpdateMaintenanceEndDate(vehicle.maintenanceEndDate || '');
    setSelectedVehicleId(vehicle.id);
    setIsUpdateModalOpen(true);
    setIsClosing(false);
  }, []);

  const closeUpdateModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => setIsUpdateModalOpen(false), 300);
  }, []);

  const openDeleteModal = useCallback((vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedVehicleId(null);
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://citumovebackend.up.railway.app/vehicle/getAll', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.find(vehicle => vehicle.plateNumber === plateNumber)) {
        setErrorMessage(`A vehicle with plate number ${plateNumber} already exists.`);
        return;
      }
      const vehicleData = { vehicleType, plateNumber, capacity: Number(capacity) };
      const addResponse = await fetch('https://citumovebackend.up.railway.app/opc/vehicle/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });
      if (!addResponse.ok) throw new Error('Failed to add vehicle');
      const newVehicle = await addResponse.json();
      setVehicles((prevVehicles) => [newVehicle, ...prevVehicles]);
      setSuccessMessage('Vehicle added successfully!');
      setVehicleType('');
      setPlateNumber('');
      setCapacity('');
      closeAddModal();
    } catch (error) {
      setErrorMessage('Error adding vehicle: ' + error.message);
    }
  };
  

  const handleUpdateVehicle = async (e, vehicleId = selectedVehicleId) => {
    e.preventDefault();
    if (updateStatus === 'Maintenance' && (!updateMaintenanceStartDate || !updateMaintenanceEndDate)) {
      setErrorMessage('Please provide both start and end dates for maintenance.');
      return;
    }
    const requestData = {
      vehicleType: updateVehicleType,
      plateNumber: updatePlateNumber,
      capacity: Number(updateCapacity),
      status: updateStatus,
      maintenanceStartDate: updateStatus === 'Maintenance' ? updateMaintenanceStartDate : null,
      maintenanceEndDate: updateStatus === 'Maintenance' ? updateMaintenanceEndDate : null,
      maintenanceDetails: updateStatus === 'Maintenance' ? updateMaintenanceDetails : null,
    };
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/opc/vehicle/update/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error('Failed to update vehicle');
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...requestData } : vehicle))
      );
      setSuccessMessage('Vehicle updated successfully!');
      closeUpdateModal();
    } catch (error) {
      setErrorMessage('Error updating vehicle: ' + error.message);
    }
  };
  

  const handleDeleteVehicle = async (vehicleId = selectedVehicleId) => {
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/opc/vehicle/delete/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
      setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.id !== vehicleId));
      setSuccessMessage('Vehicle deleted successfully!');
      closeDeleteModal();
    } catch (error) {
      setErrorMessage('Error deleting vehicle: ' + error.message);
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredVehicles = useMemo(() => {
    let sortedVehicles = vehicles;
    if (filterType !== 'all') sortedVehicles = sortedVehicles.filter((vehicle) => vehicle.status === filterType);
    if (sortOption === 'vehicleType') sortedVehicles = sortedVehicles.sort((a, b) => a.vehicleType.localeCompare(b.vehicleType));
    return sortedVehicles.filter((vehicle) =>
      vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(vehicle.capacity).includes(searchTerm)
    );
  }, [vehicles, searchTerm, sortOption, filterType]);

  useEffect(() => {
  const filteredSchedList = vehicles.filter(vehicle => 
    filterType === 'all' || vehicle.vehicleType === filterType
  );
  setVehicleSchedList(filteredSchedList);
}, [filterType, vehicles]);


const handleDateSelect = (date) => {
  if (isSelectingStartDate) {
    setUpdateMaintenanceStartDate(date);
  } else {
    setUpdateMaintenanceEndDate(date);
  }
  setShowCalendar(false);
};


const handleCloseCalendar = () => {
  setShowCalendar(false); 
  setSelectedVehicle(null); 
};

const openCalendarForStartDate = () => {
  setIsSelectingStartDate(true);
  setShowCalendar(true);
};

const openCalendarForEndDate = () => {
  setIsSelectingStartDate(false);
  setShowCalendar(true);
};

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
          <div class="vehicle-management-wrapper">
            <div className='vehicle-list-container'>
            <div className="vehicle-schedlist">
                <h3><FaBus style={{ color: "#782324", marginRight: "10px", marginBottom: "-2px" }} />Vehicle List</h3>
              </div>
            <div className='vehicle-table-container'>
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
                        <td style={{ fontWeight: '700',color: vehicle.status === 'Available' ? 'green' : vehicle.status === 'Unavailable' ? 'red' : 'orange' }}>
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
            </div>
            
    <div className="vehicle-reservations">
      <div className="vehicle-schedlist2">
        <h3><FaTools style={{ color: "#782324", marginRight: "10px", marginBottom: "-2px" }} />Vehicle Maintenance</h3>
        <FaBus style={{ color: "#782324", marginLeft: "120px", marginBottom: "-2px" }} />
                <select
          className="reservation-filter"
          onChange={(e) => setMaintenanceFilterType(e.target.value)}
          value={maintenanceFilterType}
        >
          <option value="all">All Vehicles</option>
          {[...new Set(vehicles.map(vehicle => vehicle.vehicleType))].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className='vehicle-table-container'>
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Scheduled Dates</th>
            <th>Maintenance Details</th>
            <th>Action</th>
          </tr>
        </thead>
                <tbody>
          {maintenanceDetails
            .filter(detail => maintenanceFilterType === 'all' || detail.vehicleType === maintenanceFilterType)
            .map(detail => {
              const startDate = detail.maintenanceStartDate
                ? new Date(detail.maintenanceStartDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : 'N/A';

              const endDate = detail.maintenanceEndDate
                ? new Date(detail.maintenanceEndDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : 'N/A';

              return (
                <tr key={detail.id}>
                  <td>{detail.vehicleType}</td>
                  <td><span style={{ color: "#782324", fontWeight: "700"}}>{startDate}</span> - <span style={{ color: "green", fontWeight: "700"}}>{endDate}</span></td>
                  <td>{detail.maintenanceDetails}</td>
                  <td style={{textAlign:"center"}}>
                    {detail.isCompleted === true ? ( 
                      <span style={{ color: "green", fontWeight: "bold" }}>{detail.status}</span>
                    ) : (
                      <button 
                        className="complete-btn" 
                        onClick={() => {
                          setVehicleToComplete(detail.id); 
                          setIsConfirmModalOpen(true);
                        }}
                      >
                        <FaCircleCheck style={{ marginBottom: "-2px", marginRight: "10px" }} />Complete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
          </div>
        </div>
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
          <button className="close-vehicle-btn" onClick={(e) => {
            e.preventDefault(); 
            closeUpdateModal();
          }}>
            <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
          </button>
        </h2>
        <div className='add-vehicle-input'>
          <label htmlFor='vehicle-name'>Vehicle Name</label>
          <input
            type="text"
            id='vehicle-name' 
            placeholder="Vehicle Type"
            value={updateVehicleType}
            onChange={(e) => setUpdateVehicleType(e.target.value)}
            required
          />
          <label htmlFor='vehicle-plate-number'>Plate Number</label>
          <input
            type="text"
            id='vehicle-plate-number' 
            placeholder="Plate Number"
            value={updatePlateNumber}
            onChange={(e) => setUpdatePlateNumber(e.target.value)}
            required
          />
          <label htmlFor='vehicle-capacity'>Maximum Capacity</label>
          <input
            type="number"
            id='vehicle-capacity' 
            placeholder="Maximum Capacity"
            value={updateCapacity}
            min="1"
            onChange={(e) => setUpdateCapacity(Number(e.target.value))} 
            required
          />
          <label htmlFor='vehicle-status'>Status</label>
          <select
            className="vehicle-input"
            value={updateStatus}
            onChange={(e) => {
              setUpdateStatus(e.target.value);
              if (e.target.value !== 'Maintenance') {
                setUpdateMaintenanceStartDate('');
                setUpdateMaintenanceEndDate('');
              }
            }}
            required
          >
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {updateStatus === 'Maintenance' && (
            <div className='add-vehicle-input'>
              <label htmlFor='maintenance-details'>Maintenance Details</label>
              <input
                type="text"
                id="maintenance-details"
                placeholder="Enter Maintenance Details"
                value={updateMaintenanceDetails} 
                onChange={(e) => setUpdateMaintenanceDetails(e.target.value)} 
                required
              />
            </div>
          )}

          {updateStatus === 'Maintenance' && (
            <div className="maintenance-date-container">
              <div>
                <label htmlFor='maintenance-start-date'>Maintenance Start Date</label>
                <input
                  type="text"
                  id="maintenance-start-date"
                  name="maintenance-start-date"
                  value={updateMaintenanceStartDate ? new Date(updateMaintenanceStartDate).toLocaleDateString('en-US') : ''}
                  onClick={openCalendarForStartDate}
                  placeholder='Select Start Date'
                  readOnly
                  required
                />
              </div>
              <div>
                <label htmlFor='maintenance-end-date'>Maintenance End Date</label>
                <input
                  type="text"
                  id="maintenance-end-date"
                  name="maintenance-end-date"
                  value={updateMaintenanceEndDate ? new Date(updateMaintenanceEndDate).toLocaleDateString('en-US') : ''}
                  onClick={openCalendarForEndDate}
                  placeholder='Select End Date'
                  readOnly
                  required
                />
              </div>
            </div>
          )}
          
        </div>
        <div className='add-vehicle-buttons'>
          <button className="add-vehicle-submit-btn">Update Vehicle</button>
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

{isConfirmModalOpen && (
  <div className="confirm-modal-overlay">
    <div className="confirm-modal-content">
      <h2>Are you sure you want to complete the maintenance?</h2>
      <div className="confirm-modal-buttons">
        <button className="cancel-button" onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
        <button 
          className="confirm-button" 
          onClick={() => {
            completeMaintenance(vehicleToComplete); 
            setIsConfirmModalOpen(false); 
            setSuccessMessage("Maintenance completed successfully!");
            setVehicles((prevVehicles) =>
              prevVehicles.map((vehicle) => 
                vehicle.id === vehicleToComplete.id 
                ? { ...vehicle, status: "Completed" } 
                : vehicle
              )
            );
          }}
        >
          Complete
        </button>
      </div>
    </div>
  </div>
)}

{showCalendar && (
  <div className="calendar-modal">
    <div className="user-calendar-modal-content">
      <VehicleManagementCalendar
        onDateSelect={handleDateSelect}
        plateNumber={updatePlateNumber} 
        minDate={updateMaintenanceStartDate} 
      />
      <button className="close-button" style={{marginTop: '10px'}} onClick={handleCloseCalendar}>
        <span style={{fontWeight: "700", fontSize: "16px"}}>Close</span>
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default VehicleManagement;
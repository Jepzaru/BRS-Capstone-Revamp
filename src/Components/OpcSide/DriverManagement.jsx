import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown, FaPhoneAlt, FaCalendarDay, FaCalendarMinus } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { PiSteeringWheelFill } from "react-icons/pi";
import { IoIosCloseCircle, IoMdPerson } from "react-icons/io";
import { MdOutlineSystemUpdateAlt, MdOutlineRadioButtonChecked } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiAlarmWarningFill } from "react-icons/ri";
import '../../CSS/OpcCss/DriverManagement.css';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const minDate = getCurrentDate(); 

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [updateDriverName, setUpdateDriverName] = useState('');
  const [updateDriverStatus, setUpdateDriverStatus] = useState('');
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState('');
  const [updateLeaveStartDate, setUpdateLeaveStartDate] = useState('');
  const [updateLeaveEndDate, setUpdateLeaveEndDate] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const minDate = getCurrentDate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/opc/driver/getAll", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch driver details", error);
      }
    }
    fetchDriverDetails();
  }, [token]);

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
    setDriverName('');
    setPhoneNumber('');
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  const openUpdateModal = (driver) => {
    setUpdateDriverName(driver.driverName);
    setUpdateDriverStatus(driver.status);
    setUpdatePhoneNumber(driver.contactNumber);
    setUpdateLeaveStartDate(driver.leaveStartDate || '');
    setUpdateLeaveEndDate(driver.leaveEndDate || '');
    setSelectedDriverId(driver.id);
    setIsUpdateModalOpen(true);
    setIsClosing(false);
  };

  const closeUpdateModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsUpdateModalOpen(false);
    }, 300);
  };

  const openDeleteModal = (driverId) => {
    setSelectedDriverId(driverId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDriverId(null);
  };

  const handleAddDriver = async () => {
    try {
      const response = await fetch("http://localhost:8080/opc/driver/post", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ driverName, contactNumber: phoneNumber })
      });
      if (response.ok) {
        const newDriver = await response.json();
        setDrivers([newDriver, ...drivers]);
        closeModal();
      } else {
        throw new Error('Failed to add driver');
      }
    } catch (error) {
      console.error("Failed to add driver", error);
    }
  };
  
  const handleUpdateDriver = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opc/driver/update/${selectedDriverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          driverName: updateDriverName,
          contactNumber: updatePhoneNumber,
          status: updateDriverStatus,
          leaveStartDate: updateLeaveStartDate,
          leaveEndDate: updateLeaveEndDate
        })
      });
      if (response.ok) {
        const updatedDriver = await response.json();
        setDrivers(drivers.map(driver => driver.id === selectedDriverId ? updatedDriver : driver));
        closeUpdateModal();
      } else {
        throw new Error('Failed to update driver');
      }
    } catch (error) {
      console.error("Failed to update driver", error);
    }
  };

  const handleDeleteDriver = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opc/driver/delete/${selectedDriverId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setDrivers(drivers.filter(driver => driver.id !== selectedDriverId));
        closeDeleteModal();
      } else {
        throw new Error('Failed to delete driver');
      }
    } catch (error) {
      console.error("Failed to delete driver.", error);
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    switch (sortOption) {
      case 'alphabetical':
        return a.driverName.localeCompare(b.driverName);
      case 'ascending':
        return a.contactNumber.localeCompare(b.contactNumber);
      case 'descending':
        return b.contactNumber.localeCompare(a.contactNumber);
      default:
        return 0;
    }
  });
  
  const filteredDrivers = sortedDrivers.filter(driver =>
    driver.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.contactNumber.includes(searchQuery)
  );

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  }; 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };
  
  return (
    <div className="drivermanage">
      <Header />
      <div className={`driver-manage-content1 ${isModalOpen || isUpdateModalOpen ? 'dimmed' : ''}`}>
        <SideNavbar />
        <div className="driver1">
          <div className="header-container">
            <h1><PiSteeringWheelFill style={{ marginRight: "15px", color: "#782324", marginBottom: "-3px", fontSize: "36px" }} />Driver Management</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Driver"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <button className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /></button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Phone Number Ascending</option>
                <option value="descending">Phone Number Descending</option>
              </select>
              <button className='add-driver-btn' onClick={openModal}><BsPersonFillAdd style={{ marginRight: "10px", marginBottom: "-2px" }} />Add new Driver</button>
            </div>
          </div>
          <div className='driver-list-container'>
            <table className="driver-table">
              <thead>
                <tr>
                  <th><IoMdPerson style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Driver Name</th> 
                  <th> <FaPhoneAlt style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Phone Number</th>
                  <th> <RiAlarmWarningFill style={{color: 'maroon', marginRight: '5px'}}/> Status</th>
                  <th> <FaCalendarDay style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Start Leave Date</th>
                  <th> <FaCalendarMinus style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> End Leave Date</th>
                  <th> <MdOutlineRadioButtonChecked style={{color: 'maroon', marginBottom: '-2px', marginRight: '5px'}}/> Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-driver">
                      <PiSteeringWheelFill style={{ fontSize: "24px", marginBottom: "-2px" }} /> No Driver Registered
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.driverName}</td>
                      <td>{driver.contactNumber}</td>
                      <td style={{ 
                          fontWeight: '700', 
                          color: driver.status === 'Available' ? 'green' : driver.status === "Unavailable" ? 'red' : 'orange' 
                        }}>
                          {driver.status}
                      </td>
                      <td>{driver.leaveStartDate ? formatDate(driver.leaveStartDate) : 'N/A'}</td>
                      <td>{driver.leaveEndDate ?formatDate(driver.leaveEndDate) : 'N/A'}</td>
                      <td className='td-action'>
                        <button className="update-button" onClick={() => openUpdateModal(driver)}>
                          <MdOutlineSystemUpdateAlt style={{ marginBottom: "-2px", marginRight: "5px" }} /> Update
                        </button>
                        <button className="delete-button" onClick={() => openDeleteModal(driver.id)}>
                          <FaRegTrashAlt style={{ marginBottom: "-2px", marginRight: "5px" }} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="driver-logo-image" />
        </div>
      </div>
      {isModalOpen && (
        <div className={`driver-modal-overlay ${isClosing ? 'driver-modal-closing' : ''}`}>
          <div className={`driver-modal ${isClosing ? 'driver-modal-closing' : ''}`}>
            <h2>Add New Driver 
              <button className="close-driver-btn" onClick={closeModal}>
                <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
              </button>
            </h2>
            <form action="" onSubmit={handleAddDriver}>
              <div className='add-driver-input'>
                <label htmlFor='driver-name'>Driver Name</label>
                <input
                  type="text"
                  placeholder="Ex. John Doe"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="driver-input"
                  required
                />
                
                <label htmlFor='phone number'>Phone Number</label>
                <input
                  type="text"
                  placeholder="Ex. 09*********"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(value);
                  }}
                  pattern="\d{11}"
                  title="Phone number should be exactly 11 digits"
                  maxLength="11"
                  className="driver-input"
                  required
                />
                <button className="add-driver-btn-modal">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
  <div className={`driver-modal-overlay ${isClosing ? 'driver-modal-closing' : ''}`}>
    <div className={`driver-modal ${isClosing ? 'driver-modal-closing' : ''}`}>
      <h2>Update Driver 
        <button className="close-driver-btn" onClick={closeUpdateModal}>
          <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
        </button>
      </h2>
      <form action="" onSubmit={handleUpdateDriver}>
        <div className='add-driver-input'>
          <label htmlFor='driver-name'>Driver Name</label>
          <input
            type="text"
            placeholder="Ex. John Doe"
            value={updateDriverName}
            required
            onChange={(e) => setUpdateDriverName(e.target.value)}
            className="driver-input"
          />
          
          <label htmlFor='phone number'>Phone Number</label>
          <input
            type="text"
            placeholder="Ex. 09363882526"
            value={updatePhoneNumber}
            required
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setUpdatePhoneNumber(value);
            }}
            pattern="\d{11}"
            title="Phone number should be exactly 11 digits"
            maxLength="11"
            className="driver-input"
          />

          <label htmlFor='driver-status'>Status</label>
          <select
            id="updateStatus"
            value={updateDriverStatus}
            onChange={(e) => {
              setUpdateDriverStatus(e.target.value);
              if (e.target.value !== 'On leave') {
                setUpdateLeaveStartDate('');
                setUpdateLeaveEndDate('');
              }
            }}
            className="driver-input"
            required
            style={{
              color: updateDriverStatus === 'Available' ? 'green' 
                : updateDriverStatus === 'On leave' ? 'orange' 
                : updateDriverStatus === 'Unavailable' ? 'red' 
                : 'black', 
              fontWeight: '700' 
            }}
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="On leave">On leave</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {updateDriverStatus === 'On leave' && (
          <div className="leave-date-container">
            <div>
              <label htmlFor='leave-start-date'>Start Leave Date</label>
              <input
                type="date"
                id="leave-start-date"
                value={updateLeaveStartDate}
                onChange={(e) => setUpdateLeaveStartDate(e.target.value)}
                className="driver-input"
                min={minDate}
                required
              />
            </div>
            <div>
              <label htmlFor='leave-end-date'>End Leave Date</label>
              <input
                type="date"
                id="leave-end-date"
                value={updateLeaveEndDate}
                onChange={(e) => setUpdateLeaveEndDate(e.target.value)}
                className="driver-input"
                min={minDate}
                required
              />
            </div>
          </div>
        )}

          <button className="add-driver-btn-modal">Update Driver</button>
        </div>
      </form>
    </div>
  </div>
)}

      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Are you sure you want to delete this vehicle?</h2>
            <div className="delete-modal-buttons">
              <button className="cancel-button" onClick={closeDeleteModal}>Cancel</button>
              <button className="delete-button-confirm" onClick={() => handleDeleteDriver(selectedDriverId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;

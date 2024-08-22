import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { PiSteeringWheelFill } from "react-icons/pi";
import { IoIosCloseCircle } from "react-icons/io";
import '../../CSS/OpcCss/DriverManagement.css';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State for driver fields
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // State for update fields
  const [updateDriverName, setUpdateDriverName] = useState('');
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  // Fetch drivers from the backend
  useEffect(() => {
    fetch('http://localhost:8080/driver/drivers')
      .then(response => response.json())
      .then(data => setDrivers(data))
      .catch(error => console.error('Error fetching drivers:', error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {};

  const handleSortChange = (event) => {
    // Logic for sorting if needed
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);

    // Reset the form fields
    setDriverName('');
    setPhoneNumber('');
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300); // Match the duration of the slide-down animation
  };

  const openUpdateModal = (driver) => {
    setUpdateDriverName(driver.driverName);
    setUpdatePhoneNumber(driver.contactNumber);
    setSelectedDriverId(driver.id);
    setIsUpdateModalOpen(true);
    setIsClosing(false);
  };

  const closeUpdateModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsUpdateModalOpen(false);
    }, 300); // Match the duration of the slide-down animation
  };

  const validateForm = () => {
    if (!driverName.trim()) {
      alert('Driver name is required.');
      return false;
    }

    const phoneNumberPattern = /^\d{11}$/;
    if (!phoneNumber.trim()) {
      alert('Phone number is required.');
      return false;
    } else if (!phoneNumberPattern.test(phoneNumber)) {
      alert('Phone number must be exactly 11 digits.');
      return false;
    }

    return true;
  };

  const handleAddDriver = () => {
    if (validateForm()) {
      const newDriver = { driverName, contactNumber: phoneNumber, status: "Available" };
      
      // Send the new driver to the backend
      fetch('http://localhost:8080/driver/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDriver),
      })
        .then(response => response.json())
        .then(data => {
          setDrivers([...drivers, data]); // Update the driver list with the new driver
          closeModal();
        })
        .catch(error => console.error('Error adding driver:', error));
    }
  };

  const handleUpdateDriver = () => {
    if (!updateDriverName.trim()) {
      alert('Driver name is required.');
      return;
    }
  
    const phoneNumberPattern = /^\d{11}$/;
    if (!updatePhoneNumber.trim()) {
      alert('Phone number is required.');
      return;
    } else if (!phoneNumberPattern.test(updatePhoneNumber)) {
      alert('Phone number must be exactly 11 digits.');
      return;
    }
  
    const updatedDriver = { driverName: updateDriverName, contactNumber: updatePhoneNumber, status: "Available" };
    
    // Send update request to the backend
    fetch(`http://localhost:8080/driver/update/${selectedDriverId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDriver),
    })
      .then(response => response.json())
      .then(() => {
        // Update the local state with the new driver data
        setDrivers(drivers.map(driver =>
          driver.id === selectedDriverId ? { ...driver, ...updatedDriver } : driver
        ));
        setSuccessMessage('Driver details updated successfully!');
        closeUpdateModal();
        setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
      })
      .catch(error => console.error('Error updating driver:', error));
  };
  
  const handleDeleteDriver = (id) => {
    // Send delete request to the backend
    fetch(`http://localhost:8080/driver/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the deleted driver from the state
        setDrivers(drivers.filter(driver => driver.id !== id));
      })
      .catch(error => console.error('Error deleting driver:', error));
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
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /></button>
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
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          <div className='driver-list-container'>
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-driver"><PiSteeringWheelFill style={{ fontSize: "24px", marginBottom: "-2px" }} /> No Driver Registered</td>
                  </tr>
                ) : (
                  drivers.map((driver, index) => (
                    <tr key={index}>
                      <td>{driver.driverName}</td>
                      <td>{driver.contactNumber}</td>
                      <td>{driver.status}</td>
                      <td>
                        <button className="update-button" onClick={() => openUpdateModal(driver)}>Update</button>
                        <button className="delete-button" onClick={() => handleDeleteDriver(driver.id)}>Delete</button>
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

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className={`driver-modal-overlay ${isClosing ? 'driver-modal-closing' : ''}`}>
          <div className={`driver-modal ${isClosing ? 'driver-modal-closing' : ''}`}>
            <h2>Add New Driver 
              <button className="close-driver-btn" onClick={closeModal}>
                <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
              </button>
            </h2>
            <div className='add-driver-input'>
              <label htmlFor='driver-name'>Driver Name</label>
              <input
                type="text"
                placeholder="Ex. John Doe"
                value={driverName}
                required
                onChange={(e) => setDriverName(e.target.value)}
                className="driver-input"
              />
              
              <label htmlFor='phone number'>Phone Number</label>
              <input
                type="text"
                placeholder="Ex. 09363882526"
                value={phoneNumber}
                required
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhoneNumber(value);
                }}
                pattern="\d{11}"
                title="Phone number should be exactly 11 digits"
                maxLength="11"
                className="driver-input"
              />
              
              <button className="add-driver-btn-modal" onClick={handleAddDriver}>Add Driver</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Driver Modal */}
      {isUpdateModalOpen && (
        <div className={`driver-modal-overlay ${isClosing ? 'driver-modal-closing' : ''}`}>
          <div className={`driver-modal ${isClosing ? 'driver-modal-closing' : ''}`}>
            <h2>Update Driver 
              <button className="close-driver-btn" onClick={closeUpdateModal}>
                <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
              </button>
            </h2>
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
              
              <button className="add-driver-btn-modal" onClick={handleUpdateDriver}>Update Driver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;

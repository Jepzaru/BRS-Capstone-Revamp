import React, { useState } from 'react';
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
  const drivers = [];
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // State for driver fields
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {};

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);

    // Reset the form fields
    setDriverName('');
    setPhoneNumber('');
    setAddress('');
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300); // Match the duration of the slide-down animation
  };

  const validateForm = () => {
    if (!driverName.trim()) {
      alert('Driver name is required.');
      return false;
    }

    // Validate phone number format
    const phoneNumberPattern = /^\d{11}$/;
    if (!phoneNumber.trim()) {
      alert('Phone number is required.');
      return false;
    } else if (!phoneNumberPattern.test(phoneNumber)) {
      alert('Phone number must be exactly 11 digits.');
      return false;
    }

    if (!address.trim()) {
      alert('Address is required.');
      return false;
    }

    return true;
  };

  const handleAddDriver = () => {
    if (validateForm()) {
      // Handle adding the new driver here
      console.log({ driverName, phoneNumber, address });
      closeModal();
    }
  };

  return (
    <div className="drivermanage">
      <Header />
      <div className={`driver-manage-content1 ${isModalOpen ? 'dimmed' : ''}`}>
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
          <div className='driver-list-container'>
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-driver"><PiSteeringWheelFill style={{ fontSize: "24px", marginBottom: "-2px" }} /> No Driver Registered</td>
                  </tr>
                ) : (
                  drivers.map((driver, index) => (
                    <tr key={index}>
                      <td>{driver.name}</td>
                      <td>{driver.phoneNumber}</td>
                      <td>{driver.address}</td>
                      <td>
                        <button className="update-button">Update</button>
                        <button className="delete-button">Delete</button>
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
            <h2>Add New Driver <button className="close-driver-btn" onClick={closeModal}><IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} /></button></h2>
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
                  // Allow only digits and set the value
                  const value = e.target.value.replace(/\D/g, '');
                  setPhoneNumber(value);
                }}
                pattern="\d{11}" // Validate for exactly 11 digits
                title="Phone number should be exactly 11 digits"
                maxLength="11" // Restrict to 11 characters
                className="driver-input"
              />
              
              <label htmlFor='address'>Address</label>
              <input
                type="text"
                placeholder="Ex. 123 Street, City"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className="driver-input"
              />
              
              <button className="add-driver-btn-modal" onClick={handleAddDriver}>Add Driver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;

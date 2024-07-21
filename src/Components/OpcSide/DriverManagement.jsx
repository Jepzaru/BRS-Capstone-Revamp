import React, { useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { PiSteeringWheelFill } from "react-icons/pi";

import '../../CSS/OpcCss/DriverManagement.css';

const DriverManagement = () => {
  const drivers = []; 
  const [searchTerm, setSearchTerm] = useState("");

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    // You can add any additional logic for search click here if needed
  };
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortDrivers = (drivers) => {
    switch (sortOption) {
      case "alphabetical":
        return requests.sort((a, b) => a.reason.localeCompare(b.reason));
      case "ascending":
        return requests.sort((a, b) => a.capacity - b.capacity);
      case "descending":
        return requests.sort((a, b) => b.capacity - a.capacity);
      default:
        return requests;
    }
  };

  return (
    <div className="drivermanage">
      <Header />
      <div className="driver-manage-content1">
        <SideNavbar />
        <div className="driver1">
        <div className="header-container">
          <h1><PiSteeringWheelFill style={{marginRight: "15px", color: "#782324", marginBottom: "-3px", fontSize: "36px"}}/>Driver Management</h1>
          <div className="search-container">
              <input
                type="text"
                placeholder="Search Driver"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{marginBottom: "-3px"}}/></button>
              <FaSortAlphaDown style={{color: "#782324"}}/>
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
              <button className='add-driver-btn'><BsPersonFillAdd style={{ marginRight: "10px", marginBottom: "-2px" }} />Add new Driver</button>
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
                    <td colSpan="5" className="no-driver"><PiSteeringWheelFill style={{fontSize: "24px", marginBottom: "-2px"}}/> No Driver Registered</td>
                  </tr>
                ) : (
                  drivers.map((driver, index) => (
                    <tr key={index}>
                      <td>{driver.name}</td>
                      <td>{driver.plateNumber}</td>
                      <td>{driver.capacity}</td>
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
    </div>
  );
};

export default DriverManagement;

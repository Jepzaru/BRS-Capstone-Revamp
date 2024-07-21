import React, { useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaBus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import '../../CSS/OpcCss/VehicleManagement.css';

const VehicleManagement = () => {
  const vehicles = []; 
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

  const sortVehicle = (requests) => {
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
    <div className="vehiclemanage">
      <Header />
      <div className="vehicle-manage-content1">
        <SideNavbar />
        <div className="vehicle1">
        <div className="header-container">
          <h1><FaBus style={{marginRight: "15px", color: "#782324"}}/>Vehicle Management</h1>
          <div className="search-container">
              <input
                type="text"
                placeholder="Search Vehicle"
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
            </div>
            </div>
          <img src={logoImage1} alt="Logo" className="vehicle-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;

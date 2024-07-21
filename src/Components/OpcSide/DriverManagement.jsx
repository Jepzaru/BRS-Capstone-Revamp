import React, { useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { GiCarSeat } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
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

  const sortDrivers = (requests) => {
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
          <h1><GiCarSeat style={{marginRight: "15px", color: "#782324"}}/>Driver Management</h1>
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
            </div>
            </div>
          <img src={logoImage1} alt="Logo" className="driver-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;

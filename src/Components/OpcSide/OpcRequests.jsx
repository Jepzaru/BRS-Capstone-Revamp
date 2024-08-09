import React, { useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import '../../CSS/OpcCss/OpcRequests.css';

const OpcRequests = () => {
  const requests = []; 
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

  const sortRequests = (requests) => {
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
    <div className="opcrequest">
      <Header />
      <div className="opc-request-content1">
        <SideNavbar />
        <div className="opc1">
        <div className="header-container">
          <h1><FaSwatchbook style={{marginRight: "15px", color: "#782324"}}/>Requests</h1>
          <div className="search-container">
              <input
                type="text"
                placeholder="Search Reason"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{marginBottom: "-3px"}}/> Search</button>
              <FaSortAlphaDown style={{color: "#782324"}}/>
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
            </div>
            </div>
          <div className='opc-request-container1'>
            <table className="opc-requests-table">
              <thead>
                <tr>
                  <th>Requestor Name</th>
                  <th>Type of Trip</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Capacity</th>
                  <th>Vehicle Type</th>
                  <th>Schedule</th>
                  <th>Departure Time</th>
                  <th>Pick Up Time</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="no-requests">No Requests Available</td>
                  </tr>
                ) : (
                  requests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.typeOfTrip}</td>
                      <td>{request.from}</td>
                      <td>{request.to}</td>
                      <td>{request.capacity}</td>
                      <td>{request.vehicleType}</td>
                      <td>{request.schedule}</td>
                      <td>{request.departureTime}</td>
                      <td>{request.pickUpTime}</td>
                      <td>{request.department}</td>
                      <td>{request.reason}</td>
                      <td>{request.status}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="approve-button">Approve</button>
                          <button className="reject-button">Reject</button>
                          <button className="view-file-button">View Attached File</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="opc-request-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default OpcRequests;

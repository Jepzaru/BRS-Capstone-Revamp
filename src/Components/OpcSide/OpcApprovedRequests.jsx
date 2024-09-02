import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa6";
import '../../CSS/OpcCss/OpcRequests.css';

const OpcApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await fetch('http://localhost:8080/reservations/opc-approved', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        const approvedRequests = data.filter(request => request.opcIsApproved === true);
        setRequests(approvedRequests);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      }
    };
    fetchApprovedRequests();
  }, [token]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortRequests = (requests) => {
    const filteredRequests = requests.filter(request => request.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    switch (sortOption) {
      case "alphabetical":
        return filteredRequests.sort((a, b) => a.reason.localeCompare(b.reason));
      case "ascending":
        return filteredRequests.sort((a, b) => a.capacity - b.capacity);
      case "descending":
        return filteredRequests.sort((a, b) => b.capacity - a.capacity);
      default:
        return filteredRequests;
    }
  };

  const sortedRequests = sortRequests(requests);

  return (
    <div className="opcrequest">
      <Header />
      <div className="opc-request-content1">
        <SideNavbar />
        <div className="opc1">
          <div className="header-container">
            <h1><FaClipboardCheck style={{ marginRight: "15px", color: "#782324" }} />Approved Requests</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Reason"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /> Search</button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
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
                    <td colSpan="11" className="no-requests">No Requests Available</td>
                  </tr>
                ) : (
                  sortedRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.userName}</td>
                      <td>{request.typeOfTrip}</td>
                      <td>{request.destinationFrom}</td>
                      <td>{request.destinationTo}</td>
                      <td>{request.capacity}</td>
                      <td>{request.vehicleType}</td>
                      <td>{request.schedule}</td>
                      <td>{request.departureTime}</td>
                      <td>{request.pickUpTime}</td>
                      <td>{request.reason}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="approve-button">Export to Excel</button>
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

export default OpcApprovedRequests;

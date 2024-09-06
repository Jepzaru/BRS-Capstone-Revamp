import React, { useEffect, useState } from 'react';
import { FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import '../../CSS/UserCss/ManageRequest.css';
import logoImage1 from "../../Images/citbglogo.png";
import Header from './Header';
import SideNavbar from './SideNavbar';

const ManageRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const localPart = email.split('@')[0];
  const [firstName, lastName] = localPart.split('.');
  const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const username = formatName(firstName) + " " + formatName(lastName);

  const fetchUsersRequests = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/reservations/${username}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch user's requests.", error);
    }
  };

  useEffect(() => {
    fetchUsersRequests();
  }, [token]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchClick = () => {
  };

  const sortRequests = (requests) => {
    switch (sortOption) {
      case "status":
        return requests.sort((a, b) => a.status.localeCompare(b.status));
      case "schedule":
        return requests.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
      case "typeOfTrip":
        return requests.sort((a, b) => a.typeOfTrip.localeCompare(b.typeOfTrip));
      case "department":
        return requests.sort((a, b) => a.department.localeCompare(b.department));
      default:
        return requests;
    }
  };  

  const sortedRequests = sortRequests(requests);

  const filteredRequests = sortedRequests.filter(request =>
    request.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getApprovalStatus = (request) => {
    const statuses = [];
  
    if (request.headIsApproved) {
      statuses.push(<span className="mr-status-approved">Approved (Head)</span>);
    } else if (!request.headIsApproved && request.status === 'Pending') {
      statuses.push(<span className="mr-status-pending">Pending (Head)</span>);
    } else if  (request.rejected) {
      statuses.push(<span className="mr-status-rejected">Rejected (Head)</span>);
    }
  
    if (request.opcIsApproved) {
      statuses.push(<span className="mr-status-approved">Approved (OPC)</span>);
    } else if (!request.opcIsApproved && request.status === 'Pending') {
      statuses.push(<span className="mr-status-pending">Pending (OPC)</span>);
    } else if (request.rejected) {
      statuses.push(<span className="mr-status-rejected">Rejected (OPC)</span>);
    }
  
    return statuses;
  };
  


  return (
    <div className="app1">
      <Header />
      <div className="main-content1">
        <SideNavbar />
        <div className="content1">
          <div className="header-container">
            <h1><FaSwatchbook style={{ marginRight: "15px", color: "#782324" }} />Manage Requests</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Reason"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /></button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="status">Status</option>
                <option value="schedule">Schedule</option>
                <option value="typeOfTrip">Type of Trip</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
          <div className='container1'>
            <div className='table-container'>
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type of Trip</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Capacity</th>
                  <th>Vehicle</th>
                  <th>Plate Number</th>
                  <th>Schedule</th>
                  <th>Return Schedule</th>
                  <th>Departure Time</th>
                  <th>Pick Up Time</th>
                  <th>Department</th>
                  <th className="reason-column">Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="no-requests">No Requests Made</td>
                    </tr>
                  ) : (
                    filteredRequests.reverse().map(request => (
                      <tr key={request.id}>
                        <td>{request.transactionId}</td>
                        <td>{request.typeOfTrip}</td>
                        <td>{request.destinationFrom}</td>
                        <td>{request.destinationTo}</td>
                        <td>{request.capacity}</td>
                        <td>{request.vehicleType}-{request.plateNumber}</td>
                        <td>{request.schedule}</td>
                        <td>{request.returnSchedule}</td>
                        <td>{request.departureTime}</td>
                        <td>{request.pickUpTime}</td>
                        <td>{request.department}</td>
                        <td className="reason-column">{request.reason}</td>
                        <td>
                          {getApprovalStatus(request).map((status, index) => (
                            <div key={index}>{status}</div>
                          ))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
            </table>
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="logo-image2" />
        </div>
      </div>
    </div>
  );
};

export default ManageRequest;

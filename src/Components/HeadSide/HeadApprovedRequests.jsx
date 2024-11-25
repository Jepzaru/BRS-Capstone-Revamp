import React, { useEffect, useState, useMemo } from 'react';  
import Header from '../UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './HeadNavbar';
import { FaFileCircleCheck } from "react-icons/fa6";
import '../../CSS/HeadCss/HeadApprovedRequests.css';

const HeadApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const department = localStorage.getItem('department'); 

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchApprovedRequests = async () => {
    setLoading(true); 
    try {
      const response = await fetch("https://citumovebackend.up.railway.app/reservations/head-approved", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const approvedReservations = data.filter(reservation => 
        reservation.department === department && reservation.headIsApproved
      );
      
      setRequests(approvedReservations.reverse()); 
    } catch (error) {
      console.error("Failed to fetch approved requests.", error);
      setError(error.message); 
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchApprovedRequests();
  }, [token, department]); 

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const getDisplayedRequests = () => {
    let filteredRequests = requests;
  
    if (searchTerm.trim() !== "") {
      filteredRequests = filteredRequests.filter(request => 
        request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    if (sortOption === "alphabetical") {
      filteredRequests.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortOption === "ascending") {
      filteredRequests.sort((a, b) => a.capacity - b.capacity);
    } else if (sortOption === "descending") {
      filteredRequests.sort((a, b) => b.capacity - a.capacity);
    }
  
    return filteredRequests;
  };

  const filteredRequests = getDisplayedRequests(); 

  const totalPages = Math.ceil(filteredRequests.length / recordsPerPage);

  const paginatedRequests = useMemo(() => 
    filteredRequests.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage),
    [filteredRequests, currentPage, recordsPerPage]
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    <div className="approved">
      <Header />
      <div className="approved-content1">
        <SideNavbar />
        <div className="approved1">
        <div className="title-search-container">
            <h1>
              <FaFileCircleCheck style={{ marginRight: "15px", color: "#782324" }} />
              Approved Requests
            </h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by Reason or Name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={() => {}} className="search-button">
                <FaFileCircleCheck style={{ marginBottom: "-3px" }} />
              </button>
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
            </div>
          </div>
          <div className="approved-container1">
            
              <div className="table-container">
              {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div> 
          </div>
        ) : (
              <table className="approved-requests-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Requestor Name</th>
                    <th>Type of Trip</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Capacity</th>
                    <th>Vehicle</th>
                    <th>Added Vehicle</th>
                    <th>Schedule</th>
                    <th>Return Schedule</th>
                    <th>Departure Time</th>
                    <th>Pick Up Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan="14" className="no-requests">No Approved Requests Available</td>
                    </tr>
                  ) : (
                    paginatedRequests.map((request, index) => (
                      <tr key={request.id || index}>
                        <td>{request.transactionId}</td>
                        <td>{request.userName}</td>
                        <td>{request.typeOfTrip}</td>
                        <td>{request.destinationFrom}</td>
                        <td>{request.destinationTo}</td>
                        <td>{request.capacity}</td>
                        <td><span style={{color: "#782324", fontWeight: "700"}}>{request.vehicleType} : </span><span style={{color: "green", fontWeight: "700"}}>{request.plateNumber}</span> </td>
                        <td>
                          {request.reservedVehicles.length > 0 ? (
                            request.reservedVehicles.map((vehicle, index) => (
                              <div key={index}>
                               <span style={{color: "#782324", fontWeight: "700"}}>{vehicle.vehicleType} : </span><span style={{color: "green", fontWeight: "700"}}>{vehicle.plateNumber}</span> 
                              </div>
                            ))
                          ) : (
                            <div>No Vehicles Added</div>
                          )}
                        </td>
                        <td>{request.schedule ? formatDate(request.schedule) : 'N/A'}</td>
                        <td>{request.returnSchedule && request.returnSchedule !== "0001-01-01" ? formatDate(request.returnSchedule) : 'N/A'}</td>
                        <td>{request.departureTime}</td>
                        <td>{request.pickUpTime === '0001-01-01' ? 'N/A' : request.pickUpTime || 'N/A'}</td>
                        <td>{request.reason}</td>
                        <td className={request.status === 'Pending' ? 'status-pending' : request.status === 'Approved' ? 'status-approved' : request.status === 'Completed' ? 'status-approved' :  request.status === 'Rejected' ? 'status-rejected' : ''}>
                        {request.status} by OPC
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
        )}
              <div className="pagination">
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                      </button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                      </button>
                    </div>
              </div>
          </div>
          <img src={logoImage1} alt="Logo" className="approved-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default HeadApprovedRequests;

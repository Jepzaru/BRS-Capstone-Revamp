import React, { useEffect, useState } from 'react';
import Header from '../UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './HeadNavbar';
import { FaFileCircleCheck } from "react-icons/fa6";
import '../../CSS/HeadCss/HeadApprovedRequests.css';

const HeadApprovedRequests = () => {
  // State to hold approved reservations
  const [requests, setRequests] = useState([]);
  // State to handle loading and error states (optional)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve token and department from localStorage
  const token = localStorage.getItem('token');
  const department = localStorage.getItem('department'); 

  // Function to fetch approved reservations
  const fetchApprovedRequests = async () => {
    try {
      const response = await fetch("http://localhost:8080/reservations/getAll", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Filter reservations to include only those approved by the head and matching the department
      const approvedReservations = data.filter(reservation => 
        reservation.department === department && reservation.headIsApproved
      );

      console.log("Approved Reservations:", approvedReservations);

      setRequests(approvedReservations); 
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch approved requests.", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch approved reservations on component mount
  useEffect(() => {
    fetchApprovedRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, department]); // Include department if it can change

  // Optional: Implement search and sort functionalities
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle sort option change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Function to get filtered and sorted requests
  const getDisplayedRequests = () => {
    let filteredRequests = requests;

    // Filter by search term if provided
    if (searchTerm.trim() !== "") {
      filteredRequests = filteredRequests.filter(request => 
        request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on sortOption
    if (sortOption === "alphabetical") {
      filteredRequests.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortOption === "ascending") {
      filteredRequests.sort((a, b) => a.capacity - b.capacity);
    } else if (sortOption === "descending") {
      filteredRequests.sort((a, b) => b.capacity - a.capacity);
    }

    return filteredRequests;
  };

  return (
    <div className="approved">
      <Header />
      <div className="approved-content1">
        <SideNavbar />
        <div className="approved1">
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
            {/* <FaSortAlphaDown style={{ color: "#782324", marginLeft: "10px" }} /> */}
            <select onChange={handleSortChange} className="sort-dropdown">
              <option value="">Sort By</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="ascending">Capacity Ascending</option>
              <option value="descending">Capacity Descending</option>
            </select>
          </div>
          <div className="approved-container1">
            {loading ? (
              <p>Loading approved requests...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : (
              <table className="approved-requests-table">
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getDisplayedRequests().length === 0 ? (
                    <tr>
                      <td colSpan="11" className="no-requests">No Approved Requests Available</td>
                    </tr>
                  ) : (
                    getDisplayedRequests().map((request, index) => (
                      <tr key={request.id || index}>
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
                        <td>{request.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          <img src={logoImage1} alt="Logo" className="approved-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default HeadApprovedRequests;

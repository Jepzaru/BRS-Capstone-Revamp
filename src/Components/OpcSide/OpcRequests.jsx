import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import '../../CSS/OpcCss/OpcRequests.css';

const OpcRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [feedback, setFeedback] = useState('');

  const token = localStorage.getItem('token');

  const fetchHeadIsApprovedRequests = async () => {
    try {
      const response = await fetch("http://localhost:8080/reservations/head-approved", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const filteredRequests = data.filter(request => 
          !request.opcIsApproved && !request.rejected
        );
        setRequests(filteredRequests);
      } else {
        console.error("Unexpected data format:", data);
        setRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch requests.", error);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchHeadIsApprovedRequests();
  }, []);

  useEffect(() => {
    if (modalAction === 'approve') {
      fetchDrivers();
    }
  }, [modalAction]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:8080/opc/driver/getAll", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      setDrivers(data); // Removed the filter for 'available' status
    } catch (error) {
      console.error("Failed to fetch drivers.", error);
      setDrivers([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const getFilteredAndSortedRequests = () => {
    const filteredRequests = requests.filter(request =>
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

  const handleOpenModal = (request, action) => {
    setSelectedRequest({
      ...request,
      schedule: request.schedule,
      returnSchedule: request.returnSchedule,
    });
    setModalAction(action);
    setShowModal(true);
    if (action === 'reject') {
      setFeedback('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalAction('');
    setSelectedDriver(null);
    setFeedback('');
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback.');
      return;
    }

    const reservationData = {
      rejected: true,
      status: 'Rejected',
      feedback: feedback
    };

    const formData = new FormData();
    formData.append("reservation", JSON.stringify(reservationData));

    try {
      const response = await fetch(`http://localhost:8080/reservations/update/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Reservation rejected successfully.");
        fetchHeadIsApprovedRequests();
        handleCloseModal();
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to reject the request.", error);
      alert(`An error occurred while rejecting the request: ${error.message}`);
    }
  };

  const handleApprove = async () => {
    if (!selectedDriver) {
      alert('Please select a driver.');
      return;
    }

    const reservationData = {
      opcIsApproved: true,
      driverId: selectedDriver.id,
      driverName: selectedDriver.driverName,
      status: 'Approved'
    };

    const formData = new FormData();
    formData.append("reservation", JSON.stringify(reservationData));

    try {
      const response = await fetch(`http://localhost:8080/reservations/update/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Reservation approved successfully.");
        fetchHeadIsApprovedRequests();
        handleCloseModal();
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to approve the request.", error);
      alert(`An error occurred while approving the request: ${error.message}`);
    }
  };

  // Helper function to filter out drivers based on leave dates
  const filterDriversByLeaveDates = (drivers, requestSchedule, returnSchedule) => {
    return drivers.filter(driver => {
      const { leaveStartDate, leaveEndDate } = driver;
  
      if (!leaveStartDate || !leaveEndDate) {
        return true; // Driver has no leave dates
      }
  
      const leaveStart = new Date(leaveStartDate);
      const leaveEnd = new Date(leaveEndDate);
      const schedule = new Date(requestSchedule);
      const returnDate = returnSchedule === "0001-01-01" ? null : new Date(returnSchedule);
  
      // If returnDate is null, only check the schedule
      if (!returnDate) {
        return (schedule > leaveEnd || schedule < leaveStart);
      }
  
      // Check if request schedule or return schedule overlaps with leave dates
      return (schedule > leaveEnd || returnDate < leaveStart);
    });
  };
  

  return (
    <div className="opcrequest">
      <Header />
      <div className="opc-request-content1">
        <SideNavbar />
        <div className="opc1">
          <div className="header-container">
            <h1><FaSwatchbook style={{ marginRight: "15px", color: "#782324" }} />Requests</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Reason"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button className="search-button">
                <IoSearch style={{ marginBottom: "-3px" }} /> Search
              </button>
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
            <div className="table-container">
              <table className="opc-requests-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Requestor Name</th>
                    <th>Department</th>
                    <th>Type of Trip</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Capacity</th>
                    <th>Vehicle</th>
                    <th>Schedule</th>
                    <th>Return Schedule</th>
                    <th>Departure Time</th>
                    <th>Pick Up Time</th>
                    <th className="reason-column">Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedRequests().length === 0 ? (
                    <tr>
                      <td colSpan="16" className="no-requests">No Requests Available</td>
                    </tr>
                  ) : (
                    getFilteredAndSortedRequests().map((request, index) => (
                      <tr key={index}>
                        <td>{request.transactionId}</td>
                        <td>{request.userName}</td>
                        <td>{request.department}</td>
                        <td>{request.typeOfTrip}</td>
                        <td>{request.destinationFrom}</td>
                        <td>{request.destinationTo}</td>
                        <td>{request.capacity}</td>
                        <td>{request.vehicleType}</td>
                        <td>{request.schedule}</td>
                        <td>{request.returnSchedule}</td>
                        <td>{request.departureTime}</td>
                        <td>{request.pickUpTime}</td>
                        <td className="reason-column">{request.reason}</td>
                        <td className={request.status === 'Pending' ? 'status-pending' : ''}>
                        {request.status}
                        </td>
                          <td>
                        <div className="opc-action-buttons">
                          <button className="approve-button" onClick={() => handleOpenModal(request, 'approve')}><FaCircleCheck  style={{marginBottom: "-2px", marginRight: "5px"}}/> Approve</button>
                          <button className="reject-button" onClick={() => handleOpenModal(request, 'reject')}><IoCloseCircle  style={{marginBottom: "-2px", marginRight: "3px", marginLeft: "-5px", fontSize:"16px"}}/> Reject</button>
                          <button className="view-file-button"><FaFileAlt style={{marginBottom: "-2px", marginRight: "5px"}}/> View File</button>
                        </div>
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}</h2>
            <p>Are you sure you want to {modalAction} this request?</p>
            {modalAction === 'approve' ? (
              <div className="modal-driver-selection">
                <label htmlFor="driver-select">Select Driver:</label>
               <select
                    id="driver"
                    value={selectedDriver ? selectedDriver.id : ''}
                    onChange={(e) => setSelectedDriver(drivers.find(driver => driver.id === e.target.value))}
                  >
                    <option value="">Select Driver</option>
                    {filterDriversByLeaveDates(drivers, selectedRequest.schedule, selectedRequest.returnSchedule)
                      .map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.driverName}
                        </option>
                      ))}
                  </select>              </div>
            ) : (
              <div className="modal-feedback">
                <input
                  id="feedback-input"
                  className='feedback-input'
                  type="text"
                  placeholder="Enter feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            )}
            <div className="modal-buttons">
              <button
                className="modal-accept-button"
                onClick={modalAction === 'approve' ? handleApprove : handleReject}
                disabled={modalAction === 'approve' ? !selectedDriver : !feedback.trim()}
              >
                {modalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button className="modal-close-button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpcRequests;

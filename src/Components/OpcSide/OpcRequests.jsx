import React, { useEffect, useState } from 'react';
import { FaFlag, FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle, IoSearch } from "react-icons/io5";
import Header from '../../Components/UserSide/Header';
import '../../CSS/OpcCss/OpcRequests.css';
import SideNavbar from './OpcNavbar';

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
      console.log("Fetched Drivers:", data); 
  
      // Filter out drivers with status 'Unavailable'
      const filteredDrivers = data.filter(driver => driver.status !== 'Unavailable');
  
      setDrivers(filteredDrivers);
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
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`,
        }, 
      body: JSON.stringify(reservationData),
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
          "Content-Type": "application/json", // Set content type to JSON
          "Authorization": `Bearer ${token}`, // Ensure the token is included
      },
      body: JSON.stringify(reservationData),
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

  const filterDriversByLeaveDates = (drivers, requestSchedule, returnSchedule) => {
    return drivers.filter(driver => {
      const { leaveStartDate, leaveEndDate } = driver;
  
      const leaveStart = leaveStartDate ? new Date(leaveStartDate) : null;
      const leaveEnd = leaveEndDate ? new Date(leaveEndDate) : null;
  
      const schedule = requestSchedule ? new Date(requestSchedule) : null;
      const returnDate = returnSchedule && returnSchedule !== "0001-01-01" ? new Date(returnSchedule) : null;
  
      console.log("Driver Leave Dates:", leaveStart, leaveEnd);
      console.log("Request Schedule:", schedule);
      console.log("Return Date:", returnDate);
  
      if (!leaveStart || !leaveEnd) {
        console.log("No leave dates for driver.");
        return true;
      }
  
      const isOnLeaveDuringSchedule = schedule && leaveEnd >= schedule && leaveStart <= schedule;
      const isOnLeaveDuringReturn = returnDate && leaveEnd >= returnDate && leaveStart <= returnDate;
  
      console.log("isOnLeaveDuringSchedule:", isOnLeaveDuringSchedule);
      console.log("isOnLeaveDuringReturn:", isOnLeaveDuringReturn);
  
      return !(isOnLeaveDuringSchedule || isOnLeaveDuringReturn);
    });
  };
  
  
  
  

  const handleViewFile = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert("No file URL available");
    }
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
            <div>
                  <span className="normal-header-request-badge">
                  <FaFlag style={{ color: 'blue', marginLeft: '5px', paddingRight: '10px' }} />Normal Request</span>
            </div>
            <div>
                <span className="vip-header-request-badge">
                <FaFlag style={{ color: 'red', marginLeft: '5px', paddingRight: '10px' }} />Vip Request</span>
            </div>

          </div>
          <div className='opc-request-container1'>
            <div className="table-container">
              <table className="opc-requests-table">
                <thead>
                  <tr>
                    <th className="opc-transac-column" >Transaction ID</th>
                    <th className="opc-requestor-column" >Requestor Name</th>
                    <th className="opc-department-column" >Department</th>
                    <th className="opc-tot-column" >Type of Trip</th>
                    <th className="opc-location-column" >From</th>
                    <th className="opc-location-column" >To</th>
                    <th className="opc-cap-column" >Capacity</th>
                    <th className="opc-vehicle-column" >Vehicle</th>
                    <th className="opc-added-column" >Added Vehicles</th>
                    <th className="opc-schedule-column" >Schedule</th>
                    <th className="opc-schedule-column" >Return Schedule</th>
                    <th className="opc-time-column" >Departure Time</th>
                    <th className="opc-time-column" >Pick Up Time</th>
                    <th className="opc-reason-column" >Reason</th>
                    <th className="opc-status-column" >Status</th>
                    <th className="opc-action-column" >Action</th>
                  </tr>
                </thead>
                <tbody>
                    {getFilteredAndSortedRequests().length === 0 ? (
                      <tr>
                        <td colSpan="16" className="no-requests">No Requests Available</td>
                      </tr>
                    ) : (
                      getFilteredAndSortedRequests().map((request, index) => {
                        console.log(request); // Log the request object
                        return (
                          <tr key={index} className={
                            request.department.trim().toLowerCase() === "office of the president (vip)" ? 'highlight-vip' :
                            request.department.trim().toLowerCase() === "college of computer studies (ccs)" ? 'highlight-ccs' :
                            'default-highlight'
                          }>
                            <td>{request.transactionId}</td>
                            <td>{request.userName}</td>
                            <td>{request.department}</td>
                            <td>{request.typeOfTrip}</td>
                            <td>{request.destinationFrom}</td>
                            <td>{request.destinationTo}</td>
                            <td>{request.capacity}</td>
                            <td>{request.vehicleType} - {request.plateNumber}</td>
                            <td>
                              {request.reservedVehicles && request.reservedVehicles.length > 0 ? (
                                request.reservedVehicles.map((vehicle, index) => (
                                  <div key={index}>
                                    {vehicle.vehicleType} - {vehicle.plateNumber} 
                                  </div>
                                ))
                              ) : (
                                <div>No Vehicles Added</div>
                              )}
                            </td>
                            <td>{request.schedule || 'N/A'}</td>
                            <td>{request.returnSchedule && request.returnSchedule !== "0001-01-01" ? request.returnSchedule : 'N/A'}</td>
                            <td>{request.departureTime || 'N/A'}</td>
                            <td>{request.pickUpTime || 'N/A'}</td>
                            <td className="reason-column">{request.reason}</td>
                            <td className={request.status === 'Pending' ? 'status-pending' : ''}>
                            <div className="status-container">
                            <span className="status-text">{request.status}</span>
                            {request.department.trim().toLowerCase() === 'office of the president (vip)' ? (
                              <span className="vip-request-badge">
                                <FaFlag style={{ color: 'red', marginLeft: '5px' }} /></span>
                            ) : (
                              (request.department.trim().toLowerCase() === 'college of computer studies (ccs)' ||
                                request.department.trim().toLowerCase() === 'college of engineering and architecture (cae)' ||
                                request.department.trim().toLowerCase() === 'college of management, business & accountancy (cmba)' ||
                                request.department.trim().toLowerCase() === 'college of arts, sciences, & education (case)' ||
                                request.department.trim().toLowerCase() === 'college of criminal justice (ccj)' ||
                                request.department.trim().toLowerCase() === 'college of nursing & allied health sciences') && (
                                <span className="normal-request-badge">
                                  <FaFlag style={{ color: 'blue', marginLeft: '5px' }} />
                                </span>
                              )
                            )}
                          </div>
                            </td>
                            <td>
                              <div className="opc-action-buttons">
                                <button className="opc-approve-button" onClick={() => handleOpenModal(request, 'approve')}>
                                  <FaCircleCheck style={{ marginBottom: "-2px", marginRight: "5px" }} /> Approve
                                </button>
                                <button className="opc-reject-button" onClick={() => handleOpenModal(request, 'reject')}>
                                  <IoCloseCircle style={{ marginBottom: "-2px", marginRight: "3px", marginLeft: "-5px", fontSize: "16px" }} /> Reject
                                </button>
                                {request.fileUrl === "No file(s) attached" ? (
                                  <button className="opc-view-file-button" style={{ fontSize: '10px', fontWeight: 'bold' }}>No file attached</button>
                                ) : (
                                  <button onClick={() => handleViewFile(request.fileUrl)} className="opc-view-file-button" style={{ fontSize: '10px', fontWeight: 'bold' }} >
                                    View File
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
                id="driver-select"
                value={selectedDriver ? selectedDriver.id : ''}
                onChange={(e) => {
                  const driverId = e.target.value;
                  const driver = drivers.find(driver => String(driver.id) === String(driverId));
                  setSelectedDriver(driver);
                }}
              >
                <option value="">Select Driver</option>
                {filterDriversByLeaveDates(drivers, selectedRequest.schedule, selectedRequest.returnSchedule)
                  .map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.driverName}
                    </option>
                  ))}
              </select>
            </div>
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
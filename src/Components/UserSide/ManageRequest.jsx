import React, { useEffect, useState } from 'react';
import { FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import '../../CSS/UserCss/ManageRequest.css';
import logoImage1 from "../../Images/citbglogo.png";
import Header from './Header';
import SideNavbar from './SideNavbar';
import ResendVehicleModal from './ResendVehicleModal';

const ManageRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false); // State for AddVehicleModal
  const [selectedVehicle, setSelectedVehicle] = useState(null); // State for selected vehicle
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
    // Add your search logic here if needed
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
    } else if (request.rejected) {
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

  const handleRowClick = (request) => {
    if (request.rejected) {
      setSelectedRequest(request);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission
    try {
      await fetch('/api/resend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...selectedRequest, vehicleType: selectedVehicle?.vehicleType, plateNumber: selectedVehicle?.plateNumber }),
      });
      handleCloseModal();
      // Refresh or update UI as needed
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const handleAddVehicleClick = () => {
    setShowAddVehicleModal(true);
  };

  const handleCloseAddVehicleModal = () => {
    setShowAddVehicleModal(false);
  };

  const handleVehicleSelection = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedRequest(prevRequest => ({
      ...prevRequest,
      capacity: vehicle.capacity || '' // Set capacity, but allow editing later
    }));
    setShowAddVehicleModal(false);
  };  
  
  const handleCapacityChange = (value) => {
    const capacity = parseInt(value, 10);
  
    // Validate that the value is greater than 0
    if (capacity < 1) {
      alert('Capacity must be greater than 0.');
      setSelectedRequest(prevRequest => ({ ...prevRequest, capacity: '' }));
    } else {
      setSelectedRequest(prevRequest => ({ ...prevRequest, capacity }));
    }
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
                    <th>Schedule</th>
                    <th>Return Schedule</th>
                    <th>Departure Time</th>
                    <th>Pick Up Time</th>
                    <th>Department</th>
                    <th className="reason-column">Reason</th>
                    <th>Status</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="no-requests">No Requests Made</td>
                    </tr>
                  ) : (
                    filteredRequests.reverse().map(request => (
                      <tr 
                        key={request.id} 
                        className={request.rejected ? 'rejected' : ''}
                        onClick={() => handleRowClick(request)}
                      >
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
                        <td>{request.feedback ? request.feedback : 'N/A'}</td>
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
      {showModal && selectedRequest && (
  <div className="resend-overlay" onClick={handleCloseModal}>
    <div className="resend-content" onClick={e => e.stopPropagation()}>
      {/* Multiple Vehicle Button */}
      <button 
        type="button" 
        className="multiple-vehicle-button" 
        onClick={handleAddVehicleClick}
      >
        Multiple Vehicle
      </button>
      
      <form onSubmit={handleModalSubmit}>
        <h2>Resend Request</h2>
        <div className="form-group1">
          {/* Form fields */}
          <div className="form-field">
            <label htmlFor="transactionId">Transaction ID</label>
            <input
              id="transactionId"
              name="transactionId"
              type="text"
              value={selectedRequest.transactionId}
              disabled
            />
          </div>
                <div className="form-field">
                  <label htmlFor="typeOfTrip">Type of Trip</label>
                  <select
                    id="typeOfTrip"
                    name="typeOfTrip"
                    value={selectedRequest.typeOfTrip}
                    onChange={e => setSelectedRequest({ ...selectedRequest, typeOfTrip: e.target.value })}
                    required
                  >
                    <option value="One Way">One Way</option>
                    <option value="Round Trip">Round Trip</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="destinationFrom">From</label>
                  <input
                    id="destinationFrom"
                    name="destinationFrom"
                    type="text"
                    value={selectedRequest.destinationFrom}
                    onChange={e => setSelectedRequest({ ...selectedRequest, destinationFrom: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="destinationTo">To</label>
                  <input
                    id="destinationTo"
                    name="destinationTo"
                    type="text"
                    value={selectedRequest.destinationTo}
                    onChange={e => setSelectedRequest({ ...selectedRequest, destinationTo: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                <label htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1" // Set the minimum capacity to 1
                  value={selectedRequest.capacity || ''}
                  onChange={(e) => handleCapacityChange(e.target.value)}
                  required
                />
              </div>
                <div className="form-field">
                  <label htmlFor="vehicleType">
                    Vehicle Type
                    <button type="button" onClick={handleAddVehicleClick} className="add-vehicle-button">
                      select Vehicle
                    </button>
                  </label>
                  <input
                    id="vehicleType"
                    name="vehicleType"
                    type="text"
                    value={selectedVehicle?.vehicleType || selectedRequest.vehicleType}
                    onChange={e => setSelectedRequest({ ...selectedRequest, vehicleType: e.target.value })}
                    readOnly
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="plateNumber">Plate Number</label>
                  <input
                    id="plateNumber"
                    name="plateNumber"
                    type="text"
                    value={selectedVehicle?.plateNumber || selectedRequest.plateNumber}
                    onChange={e => setSelectedRequest({ ...selectedRequest, plateNumber: e.target.value })}
                    readOnly  
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="schedule">Schedule</label>
                  <input
                    id="schedule"
                    name="schedule"
                    type="local-date"
                    value={selectedRequest.schedule}
                    onChange={e => setSelectedRequest({ ...selectedRequest, schedule: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="returnSchedule">Return Schedule</label>
                  <input
                    id="returnSchedule"
                    name="returnSchedule"
                    type="local-date"
                    value={selectedRequest.returnSchedule}
                    onChange={e => setSelectedRequest({ ...selectedRequest, returnSchedule: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="departureTime">Departure Time</label>
                  <input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    value={selectedRequest.departureTime}
                    onChange={e => setSelectedRequest({ ...selectedRequest, departureTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="pickUpTime">Pick Up Time</label>
                  <input
                    id="pickUpTime"
                    name="pickUpTime"
                    type="time"
                    value={selectedRequest.pickUpTime}
                    onChange={e => setSelectedRequest({ ...selectedRequest, pickUpTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    value={selectedRequest.department}
                    onChange={e => setSelectedRequest({ ...selectedRequest, department: e.target.value })}
                    disabled
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="reason">Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={selectedRequest.reason}
                    onChange={e => setSelectedRequest({ ...selectedRequest, reason: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="reason">Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={selectedRequest.reason}
                    onChange={e => setSelectedRequest({ ...selectedRequest, reason: e.target.value })}
                    required
                  />
                </div>
                
              </div>
              <button type="button" onClick={handleCloseModal} className="close-button">Close</button>
              <button type="submit" className="submit-button">Submit</button>
            </form>
          </div>
        </div>
      )}
      {showAddVehicleModal && (
        <ResendVehicleModal 
          isOpen={showAddVehicleModal} 
          onClose={handleCloseAddVehicleModal} 
          onSubmit={handleVehicleSelection} // Pass the handler to receive selected vehicle
        />
      )}
    </div>
  );
};

export default ManageRequest;
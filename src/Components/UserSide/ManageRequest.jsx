import React, { useEffect, useState } from 'react';
import { FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import '../../CSS/UserCss/ManageRequest.css';
import logoImage1 from "../../Images/citbglogo.png";
import Header from './Header';
import SideNavbar from './SideNavbar';
import AddVehicleModal from './AddVehicleModal';

import { FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";
import { FaFileSignature, FaUserGroup, FaBuildingUser } from "react-icons/fa6";
import { FaCalendarDay, FaBus, FaFileAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { TbBus } from "react-icons/tb";
import { CgDetailsMore } from "react-icons/cg";

const ManageRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false); 
  const [selectedVehicle, setSelectedVehicle] = useState(null); 
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const localPart = email.split('@')[0];
  const [tripType, setTripType] = useState('oneWay');
  const [firstName, lastName] = localPart.split('.');
  const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const username = formatName(firstName) + " " + formatName(lastName);
  const [isAddVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [isMultipleVehicles, setIsMultipleVehicles] = useState(false);
  const [showVehicleContainer, setShowVehicleContainer] = useState(true);
  
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
    (request.reason || '').toLowerCase().includes(searchTerm.toLowerCase())
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
    try {
      await fetch('/api/resend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...selectedRequest, vehicleType: selectedVehicle?.vehicleType, plateNumber: selectedVehicle?.plateNumber }),
      });
      handleCloseModal();
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
      capacity: vehicle.capacity || '' 
    }));
    setShowAddVehicleModal(false);
  };  
  
  const handleCapacityChange = (value) => {
    const capacity = parseInt(value, 10);
  
    if (capacity < 1) {
      alert('Capacity must be greater than 0.');
      setSelectedRequest(prevRequest => ({ ...prevRequest, capacity: '' }));
    } else {
      setSelectedRequest(prevRequest => ({ ...prevRequest, capacity }));
    }
  };

  
  const handleVehicleModeToggle = () => {
    setIsMultipleVehicles(prevState => !prevState); 
    setShowVehicleContainer(prevState => !prevState); // Hide/show container
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    // Open the modal
    setShowModal(true);
  };

  const handleTripTypeChange = (event) => {
    const selectedTripType = event.target.value;
    setTripType(selectedTripType);
    
    if (selectedTripType === 'oneWay') {
      setReturnSchedule(''); // or null
      setPickUpTime(''); // or null
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
      <form className="reservation-form">
        <div className="form-group-inline">
          <div className="trip-type">
          <label>
      <input
        type="radio"
        value="oneWay"
        checked={tripType === 'oneWay'}
        onChange={handleTripTypeChange}
      />
      <span>One Way</span>
    </label>
    <label>
      <input
        type="radio"
        value="roundTrip"
        checked={tripType === 'roundTrip'}
        onChange={handleTripTypeChange}
      />
      <span>Round Trip</span>
    </label>
    </div>
          <div className='mult-vehicle'>
            <button type='button' className='mult-vehicle-btn' onClick={handleVehicleModeToggle}>
              {isMultipleVehicles ? (
                <>
                  <TbBus style={{marginRight: "5px", marginBottom: "-2px", color: "gold"}}/> Single vehicle
                </>
              ) : (
                <>
                  <TbBus style={{marginRight: "5px", marginBottom: "-2px", color: "gold"}}/> Multiple vehicles
                </>
              )}
            </button>
          </div>
        </div>
        <br/>
        <div className="form-group-inline">
          <div className="form-group">
            <label htmlFor="from">
              <FaLocationCrosshairs style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> From:
            </label>
            <input type="text" id="from" name="from" placeholder='Ex. CIT-University' value={selectedRequest.destinationFrom} required  />
          </div>
          <div className="form-group">
            <label htmlFor="to">
              <FaLocationDot style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> To:
            </label>
            <input type="text" id="to" name="to" placeholder='Ex. SM Seaside' value={selectedRequest.destinationTo} required />
          </div>
          <div className="form-group">
            <label htmlFor="capacity">
              <FaUserGroup style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Capacity:
            </label>
            <input type="number" id="capacity" name="capacity" value={selectedRequest.capacity} required min="0" readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="vehicleType">
              <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Vehicle:
            </label>
            <input type="text" id="vehicleType" name="vehicleType" value={selectedRequest.vehicleType} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="plateNumber">
              <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Plate Number:
            </label>
            <input type="text" id="plateNumber" name="plateNumber" value={selectedRequest.plateNumber} readOnly />
          </div>
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <label htmlFor="schedule">
              <FaCalendarDay style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Schedule:
            </label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={selectedRequest.schedule}
              readOnly
            />
          </div>
          {tripType === 'roundTrip' && (
          <div className="form-group">
            <label htmlFor="returnSchedule">
              <FaCalendarDay style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Return Schedule:
            </label>
            <input
              type="text"
              id="returnSchedule"
              name="returnSchedule"
              value={selectedRequest.returnSchedule}
              readOnly
            />
          </div>
          )}
          <div className="form-group">
            <label htmlFor="departureTime">
              <IoTime style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Departure Time:
            </label>
            <input type="text" id="departureTime" name="departureTime" value={selectedRequest.departureTime} readOnly />
          </div>
          {tripType === 'roundTrip' && (
          <div className="form-group">
            <label htmlFor="pickUpTime">
              <IoTime style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Pick-Up Time:
            </label>
            <input type="text" id="pickUpTime" name="pickUpTime" value={selectedRequest.pickUpTime} readOnly />
          </div>
           )}
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <label htmlFor="department">
              <FaBuildingUser style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Department:
            </label>
            <input type="text" id="department" name="department" value={selectedRequest.department} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="approvalProof">
              <FaFileAlt style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Proof of Approval (optional):
            </label>
            <input type="file" id="approvalProof" name="approvalProof" disabled />
          </div>
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <label htmlFor="reservationReason">
              <CgDetailsMore style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Reason of Reservation:
            </label>
            <textarea
              id="reservationReason"
              name="reservationReason"
              className="reservation-reason-textarea"
              placeholder="State the reason of your reservation"
              value={selectedRequest.reason}
              readOnly
            />
          </div>
          {showVehicleContainer && (
            <div className="form-group">
              <label htmlFor="addedVehicle">
                <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> Vehicle Added:
              </label>
              <div className="reserved-vehicle-added-container">
                <div className="reserved-vehicle-item">
                  <p>{`${selectedRequest.vehicleType} - ${selectedRequest.plateNumber} - ${selectedRequest.capacity}`}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  </div>
)}

      {showAddVehicleModal && (
        <AddVehicleModal 
        isOpen={isAddVehicleModalOpen} 
        onClose={handleCloseModal} 
        onAdd={handleAddVehicle} 
        selectedPlateNumber={vehicle.plateNumber}
        addedVehiclePlates={addedVehiclePlates} 
      />
      )}
    </div>
  );
};

export default ManageRequest;
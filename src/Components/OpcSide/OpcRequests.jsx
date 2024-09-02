import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import '../../CSS/OpcCss/OpcRequests.css';

const OpcRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalAction, setModalAction] = useState('');

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
    setSelectedRequest(request);
    setModalAction(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalAction('');
  };

  const handleReject = async () => {
    try {
      const reservationData = {
        rejected: true,
        status: 'Rejected'
      };

      const formData = new FormData();
      formData.append("reservation", JSON.stringify(reservationData));

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to reject the request.", error);
    }
  };

  const handleApprove = async () => {
    try {
      const reservationData = {
        opcIsApproved: true,
      };

      const formData = new FormData();
      formData.append("reservation", JSON.stringify(reservationData));

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to approve the request.", error);
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
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedRequests().length === 0 ? (
                  <tr>
                    <td colSpan="12" className="no-requests">No Requests Available</td>
                  </tr>
                ) : (
                  getFilteredAndSortedRequests().map((request, index) => (
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
                      <td>{request.status}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="accept-button" onClick={() => handleOpenModal(request, 'approve')}>Accept</button>
                          <button className="reject-button" onClick={() => handleOpenModal(request, 'reject')}>Reject</button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}</h2>
            <p>Are you sure you want to {modalAction} this request?</p>
            <div className="modal-buttons">
              <button className="modal-accept-button" onClick={modalAction === 'approve' ? handleApprove : handleReject}>
                {modalAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
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

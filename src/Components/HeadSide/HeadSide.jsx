import React, { useEffect, useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './HeadNavbar';
import { FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import '../../CSS/HeadCss/HeadSide.css';

const HeadSide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [request, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [feedback, setFeedback] = useState('');

  const token = localStorage.getItem('token');

  const fetchRequestsData = async () => {
    try {
      const department = localStorage.getItem('department');

      const response = await fetch("http://localhost:8080/reservations/getAll", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      const matchingReservations = data.filter(reservation =>
        reservation.department === department && !reservation.headIsApproved && !reservation.rejected
      );
      setRequests(matchingReservations);
    } catch (error) {
      console.error("Failed to fetch requests.", error);
    }
  };

  const handleApproveRequests = async () => {
    try {
      const reservationData = {
        headIsApproved: true,
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
        fetchRequestsData();
        closeModal();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to approve the request.", error);
    }
  };

  const handleRejectRequest = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback.');
      return;
    }

    try {
      const reservationData = {
        rejected: true,
        status: 'Rejected',
        feedback: feedback
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
        fetchRequestsData();
        closeModal();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to reject the request.", error);
      alert(`An error occurred while rejecting the request: ${error.message}`);
    }
  };

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setIsModalOpen(true);
    if (action === 'reject') {
      setFeedback('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setModalAction(null);
    setFeedback('');
  };

  useEffect(() => {
    fetchRequestsData();
  }, [token]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
  };

  const handleSortChange = (event) => {
  };

  // Helper function to split long text
  const splitText = (text, maxLength) => {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return text.match(regex).join('\n');
  };

  return (
    <div className="head">
      <Header />
      <div className="head-content1">
        <SideNavbar />
        <div className="head1">
          <div className="header-container">
            <h1><FaSwatchbook style={{ marginRight: "15px", color: "#782324" }} />Department Requests</h1>
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
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
            </div>
          </div>
          <div className='head-container1'>
            <div className='table-container'>
            <table className="head-requests-table">
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
                {request.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="no-requests">No Requests Available</td>
                  </tr>
                ) : (
                  request.map((requests, index) => (
                    <tr key={index}>
                      <td>{requests.userName}</td>
                      <td>{requests.typeOfTrip}</td>
                      <td>{requests.destinationFrom}</td>
                      <td>{requests.destinationTo}</td>
                      <td>{requests.capacity}</td>
                      <td>{requests.vehicleType}</td>
                      <td>{requests.schedule}</td>
                      <td>{requests.departureTime}</td>
                      <td>{requests.pickUpTime}</td>
                      <td>{splitText(requests.reason, 15)}</td>
                      <td>
                        <div className="head-action-buttons">
                          <button className="approve-button" onClick={() => openModal(requests, 'approve')}><FaCircleCheck style={{ marginBottom: "-2px", marginRight: "5px" }} /> Approve</button>
                          <button className="reject-button" onClick={() => openModal(requests, 'reject')}><IoCloseCircle style={{ marginBottom: "-2px", marginRight: "3px", marginLeft: "-5px", fontSize: "16px" }} /> Reject</button>
                          <button className="view-file-button"><FaFileAlt style={{ marginBottom: "-2px", marginRight: "5px" }} /> View File</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="head-logo-image" />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}</h2>
            <p>Are you sure you want to {modalAction} this request?</p>
            {modalAction === 'approve' ? (
              <div className="modal-approve">
                {/* No additional fields for approval */}
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
                onClick={modalAction === 'approve' ? handleApproveRequests : handleRejectRequest}
                disabled={modalAction === 'approve' ? !selectedRequest : !feedback.trim()}
              >
                {modalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button className="modal-cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadSide;
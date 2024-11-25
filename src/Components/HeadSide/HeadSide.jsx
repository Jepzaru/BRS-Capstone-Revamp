import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FaFileAlt, FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle, IoSearch } from "react-icons/io5";
import Header from '../../Components/UserSide/Header';
import '../../CSS/HeadCss/HeadSide.css';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './HeadNavbar';

const HeadSide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [request, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const token = localStorage.getItem('token');
  const [errorMessage, setErrorMessage] = useState(''); 

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchRequestsData = useCallback(async () => {
    try {
      const response = await fetch("https://citumovebackend.up.railway.app/reservations/getAll", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      const matchingReservations = data.filter(reservation =>
        reservation.department === localStorage.getItem('department') && 
        !reservation.headIsApproved && 
        !reservation.rejected
      );
  
      localStorage.setItem('pendingRequestCount', matchingReservations.length);
  
      setRequests(matchingReservations);
    } catch (error) {
      console.error("Failed to fetch requests.", error);
    }
  }, [token]);
  

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);


  
  const handleApproveRequests = async () => {
    try {
      const reservationData = { headIsApproved: true };
      const response = await fetch(`https://citumovebackend.up.railway.app/reservations/update/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  
        },
        body: JSON.stringify(reservationData),
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
      alert('Please provide reason of rejection.');
      return;
    }

    try {
      const reservationData = { rejected: true, status: 'Rejected', feedback };
      const response = await fetch(`https://citumovebackend.up.railway.app/reservations/update/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(reservationData),
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

  const openModal = async (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setFileUrl(request.fileUrl || '');
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
    setErrorMessage('');
  };

  const handleSearchClick = () => {
  };

  const handleViewFileError = () => {
    setErrorMessage('No file is attached.'); 
  };

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;

    setRequests(prevRequests => {
      const sortedRequests = [...prevRequests];
      if (sortOption === 'scheduleDescending') {
        sortedRequests.sort((a, b) => new Date(b.schedule) - new Date(a.schedule));
      } else if (sortOption === 'scheduleAscending') {
        sortedRequests.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
      }
      return sortedRequests;
    });
  };

  const filteredRequests = useMemo(() => {
    return request.filter(request =>
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [request, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

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

  return (
    <div className="head">
      <Header />
      <div className="head-content1">
        <SideNavbar pendingRequestCount={request.length}/>
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
                <option value="scheduleDescending">Schedule Descending</option>
                <option value="scheduleAscending">Schedule Ascending</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
            </select>
            </div>
          </div>
          <div className='head-container1'>
            <div className='head-table-container'>
            <table className="head-requests-table">
              <thead>
                <tr>
                  <th>Requestor Name</th>
                  <th style={{width: '70px'}}>Type of Trip</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Capacity</th>
                  <th>Vehicle</th>
                  <th>Added vehicles</th>
                  <th>Schedule</th>
                  <th>Return Schedule</th>
                  <th style={{width: '70px'}}>Departure Time</th>
                  <th style={{width: '70px'}}>Pick Up Time</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="no-requests">No Requests Available</td>
                  </tr>
                ) : (
                  paginatedRequests.map((requests, index) => (
                    <tr key={index}>
                      <td>{requests.userName}</td>
                      <td style={{width: '70px'}}>{requests.typeOfTrip}</td>
                      <td>{requests.destinationFrom}</td>
                      <td>{requests.destinationTo}</td>
                      <td><span style={{color: "#782324", fontWeight: "700"}}>{requests.capacity}</span></td>
                      <td><span style={{color: "#782324", fontWeight: "700"}}>{requests.vehicleType} : </span><span style={{color: "green", fontWeight: "700"}}>{requests.plateNumber}</span> </td>
                      <td>
                          {requests.reservedVehicles.length > 0 ? (
                            requests.reservedVehicles.map((vehicle, index) => (
                              <div key={index}>
                               <span style={{color: "#782324", fontWeight: "700"}}>{vehicle.vehicleType} : </span><span style={{color: "green", fontWeight: "700"}}>{vehicle.plateNumber}</span> 
                              </div>
                            ))
                          ) : (
                            <div>No Vehicles Added</div>
                          )}
                        </td>
                      <td>{requests.schedule ? formatDate(requests.schedule) : 'N/A'}</td>
                      <td>{requests.returnSchedule && requests.returnSchedule !== "0001-01-01" ? formatDate(requests.returnSchedule) : 'N/A'}</td>
                      <td style={{width: '70px'}}>{requests.departureTime}</td>
                      <td style={{width: '70px'}}>{requests.pickUpTime === '0001-01-01' ? 'N/A' : requests.pickUpTime || 'N/A'}</td>
                      <td>{requests.reason}</td>
                      <td>
                      <div className="head-action-buttons">
                        <button className="approve-button" onClick={() => openModal(requests, 'approve')}>
                          <FaCircleCheck style={{ marginBottom: "-2px", marginRight: "5px" }} /> Approve
                        </button>
                        <button className="reject-button" onClick={() => openModal(requests, 'reject')}>
                          <IoCloseCircle style={{ marginBottom: "-2px", marginRight: "3px", marginLeft: "-5px", fontSize: "16px" }} /> Reject
                        </button>
                        
                        {requests.fileUrl && requests.fileUrl !== 'No file(s) attached' && requests.fileUrl !== 'null' ? (
                          <button
                            className="view-file-button"
                            onClick={() => window.open(requests.fileUrl, '_blank')}
                          >
                            <FaFileAlt style={{ marginBottom: "-2px", marginRight: "5px" }} /> View File
                          </button>
                        ) : (
                          <button className="view-file-button" style={{ fontSize: '10px' }} disabled>
                            No file attached
                          </button>
                        )}
                      </div>
                    </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
            </div>
          ) : (
            <div className="modal-feedback">
              <input
                id="feedback-input"
                className="feedback-input"
                type="text"
                placeholder="Enter reason of rejection"
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
            <button className="modal-close-button" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default HeadSide;
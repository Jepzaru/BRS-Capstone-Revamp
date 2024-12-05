import React, { useEffect, useState, useMemo } from 'react';
import { FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import '../../CSS/UserCss/ManageRequest.css';
import logoImage1 from "../../Images/citbglogo.png";
import Header from './Header';
import ResendRequestModal from './ResendRequestModal';
import SideNavbar from './SideNavbar';

const ManageRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
const [requestToCancel, setRequestToCancel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const localPart = email.split('@')[0];
  const [firstName, lastName] = localPart.split('.');
  const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const username = formatName(firstName) + " " + formatName(lastName);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const fetchUsersRequests = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/user/reservations/${username}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      
      const sortedData = data.sort((a, b) => b.id - a.id);
      setRequests(sortedData);
    } catch (error) {
      console.error("Failed to fetch user's requests.", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleConfirmCancel = async () => {
    try {
        const response = await fetch(`https://citumovebackend.up.railway.app/user/reservation/cancel/${requestToCancel.id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                isCanceled: 1, 
            }),
        });
        if (response.ok) {
            
            fetchUsersRequests();
            setCancelModal(false); 
        } else {
            alert('Failed to cancel the request');
        }
    } catch (error) {
        console.error('Error canceling the request', error);
        setCancelModal(false); 
    }
};
  
  
  useEffect(() => {
    fetchUsersRequests();
  }, [token, username]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortRequests = (requests) => {
    const sorted = [...requests];
    switch (sortOption) {
      case "status":
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case "schedule":
        return sorted.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
      case "typeOfTrip":
        return sorted.sort((a, b) => a.typeOfTrip.localeCompare(b.typeOfTrip));
      case "department":
        return sorted.sort((a, b) => a.department.localeCompare(b.department));
      default:
        return sorted;
    }
  };

  const sortedRequests = useMemo(() => sortRequests(requests), [requests, sortOption]);

  const filteredRequests = useMemo(() => 
    sortedRequests.filter(request =>
      Object.values(request).some(value =>
        (value || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    [sortedRequests, searchTerm]
  );
  

  const getApprovalStatus = (request) => {
    if (request.status === 'Completed') {
      return <span className="mr-status-completed">Completed</span>;
    } else if (request.status === 'Canceled'){
      return <span className="mr-status-canceled">Canceled</span>;
    }
  
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
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
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

  const handleCancelRequest = (request) => {
    setRequestToCancel(request);
    setCancelModal(true); 
};

const handleCloseCancelModal = () => {
  setCancelModal(false);
  setRequestToCancel(null); 
};

  return (
    <div className="app1">
        <Header />
        <div className="main-content1">
            <SideNavbar />
            <div className="content1">
                <div className="header-container">
                    <h1>
                        <FaSwatchbook style={{ marginRight: "15px", color: "#782324" }} />
                        Manage Requests
                    </h1>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-bar"
                        />
                        <button className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /></button>
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
                        {loading ? (
                            <div className="spinner-container">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <table className="requests-table">
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
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
                                        <th className="reason-column">Purpose</th>
                                        <th>Status</th>
                                        <th>Reason of Rejection</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {filteredRequests.length === 0 ? (
                                  <tr>
                                    <td colSpan="15" className="no-requests">No Requests Made</td>
                                  </tr>
                                ) : (
                                  paginatedRequests.map((request) => (
                                    <tr
                                      key={request.id}
                                      className={request.rejected ? 'rejected' : ''}
                                      onClick={() => handleRowClick(request)}
                                    >
                                      <td>{request.transactionId || 'N/A'}</td>
                                      <td>{request.typeOfTrip || 'N/A'}</td>
                                      <td>{request.destinationFrom || 'N/A'}</td>
                                      <td>{request.destinationTo || 'N/A'}</td>
                                      <td>{request.capacity || 'N/A'}</td>
                                      <td>
                                        <span style={{ color: "#782324", fontWeight: "700" }}>{request.vehicleType || 'N/A'} : </span>
                                        <span style={{ color: "green", fontWeight: "700" }}>{request.plateNumber || 'N/A'}</span>
                                      </td>
                                      <td>
                                        {request.reservedVehicles && request.reservedVehicles.length > 0 ? (
                                          request.reservedVehicles.map((vehicle) => (
                                            <div key={vehicle.id || vehicle.plateNumber}>
                                              <span style={{ color: "#782324", fontWeight: "700" }}>{vehicle.vehicleType || 'N/A'} : </span>
                                              <span style={{ color: "green", fontWeight: "700" }}>{vehicle.plateNumber || 'N/A'}</span>
                                            </div>
                                          ))
                                        ) : (
                                          <div>No Vehicles Added</div>
                                        )}
                                      </td>
                                      <td>{request.schedule ? formatDate(request.schedule) : 'N/A'}</td>
                                      <td>{request.returnSchedule && request.returnSchedule !== "0001-01-01" ? formatDate(request.returnSchedule) : 'N/A'}</td>
                                      <td>{request.departureTime || 'N/A'}</td>
                                      <td>{request.pickUpTime === '0001-01-01' ? 'N/A' : request.pickUpTime || 'N/A'}</td>
                                      <td className="reason-column">{request.reason || 'N/A'}</td>
                                      <td>{getApprovalStatus(request)}</td>
                                      <td>
                                        {request.status === 'Canceled' ? (
                                          <span className="request-canceled-text">Request Canceled</span>
                                        ) : (
                                          request.headIsApproved && request.opcIsApproved && !request.isCanceled ? (
                                            <button className="cancel-request-button" onClick={() => handleCancelRequest(request)}>
                                              Cancel Request
                                            </button>
                                          ) : (
                                            request.rejected ? (
                                              request.feedback || 'No reason specified'
                                            ) : (
                                              'No feedback'
                                            )
                                          )
                                        )}
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
                    <ResendRequestModal request={selectedRequest} showModal={showModal} onClose={handleCloseModal} />
                    {cancelModal && (
                  <div className="cancel-modal">
                      <div className="user-calendar-modal-content">
                          <h3>Are you sure you want to cancel this request?</h3>
                          <button onClick={handleConfirmCancel} className="confirm-cancel-button">Yes</button>
                          <button onClick={handleCloseCancelModal} className="close-cancel-button">No</button>
                      </div>
                  </div>
              )}
                </div>
                
            </div>
            <img src={logoImage1} alt="Logo" className="logo-image2" />
        </div>
    </div>
);
};

export default ManageRequest;

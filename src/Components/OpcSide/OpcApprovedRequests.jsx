import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown, FaEye } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa6";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from 'xlsx'; 
import '../../CSS/OpcCss/OpcRequests.css';

const OpcApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [confirmMode, setConfirmMode] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
  
      if (!token) {
        setError("Authorization token is missing. Please login again.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch('https://citumovebackend.up.railway.app/reservations/opc-approved', {
          headers: { "Authorization": `Bearer ${token}` }
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          setError("Failed to fetch approved requests. Please try again.");
          return;
        }
  
        const data = await response.json();
        const approvedRequests = data.filter(request => request.opcIsApproved === true);
        setRequests(approvedRequests); 
      } catch (error) {
        setError("Network error. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchApprovedRequests();
  }, []); 
  
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);
  
  const handleSortChange = useCallback((event) => {
    setSortOption(event.target.value);
  }, []);

  const sortRequests = useCallback((requests) => {
    const filteredRequests = requests.filter(request =>
      Object.values(request).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
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
  }, [searchTerm, sortOption]);

  const sortedRequests = useMemo(() => sortRequests(requests), [requests, searchTerm, sortOption]);

  const handleRowSelection = useCallback((transactionId) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = new Set(prevSelectedRows);
      if (updatedSelectedRows.has(transactionId)) {
        updatedSelectedRows.delete(transactionId);
      } else {
        updatedSelectedRows.add(transactionId);
      }
      return updatedSelectedRows;
    });
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  }, []);

  const exportToExcel = useCallback(() => {
    const selectedRequests = requests.filter(request => selectedRows.has(request.transactionId));
    const requestsToExport = selectedRequests.length > 0 ? selectedRequests : requests;
  
    if (requestsToExport.length === 0) {
      alert("No data available to export."); 
      return;
    }
  
    const dataToExport = requestsToExport.map(request => ({
      Requestor: request.userName,
      TripType: request.typeOfTrip,
      From: request.destinationFrom,
      To: request.destinationTo,
      Capacity: request.capacity,
      Vehicle: `${request.vehicleType} - ${request.plateNumber}`,
      Schedule: formatDate(request.schedule),
      ReturnSchedule: formatDate(request.returnSchedule) || "N/A",
      Departure: request.departureTime,
      PickUp: request.pickUpTime || "N/A",
      Driver: request.driverName || "N/A",
      "Added Driver and Vehicle": request.reservedVehicles?.length > 0
        ? request.reservedVehicles.map(vehicle => `${vehicle.driverName || "N/A"} - ${vehicle.vehicleType || "N/A"} : ${vehicle.plateNumber}`).join(', ')
        : "No Drivers Added",
      Reason: request.reason,
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, "Approved Requests");
    XLSX.writeFile(workbook, "Approved_Requests.xlsx");
  }, [requests, selectedRows, formatDate]);
  

  const totalPages = Math.ceil(sortedRequests.length / recordsPerPage);

  const paginatedRequests = useMemo(() => 
    sortedRequests.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage),
    [sortedRequests, currentPage, recordsPerPage]
  );

  const handleCancel = useCallback(() => {
    setConfirmMode(false); 
  }, []);
  

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleViewMore = useCallback((request) => {
    setSelectedRequest(request);
    setShowModal(true);
  }, []);
  

  return (
    <div className="opcrequest">
      <Header />
      <div className="opc-request-content1">
        <SideNavbar />
        <div className="opc1">
          <div className="header-container">
            <h1>
              <FaClipboardCheck style={{ marginRight: "15px", color: "#782324" }} />
              Approved Requests
            </h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchChange} className="search-button">
                <IoSearch style={{ marginBottom: "-3px" }} /> Search
              </button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
              <button
                onClick={() => {
                  if (confirmMode) {
                    exportToExcel();
                  }
                  setConfirmMode(!confirmMode);
                }}
                className="generate-report-button"
              >
                <RiFileExcel2Fill style={{ marginRight: '10px' }} />
                {confirmMode ? 'Confirm' : 'Generate Report'}
              </button>
              {confirmMode && (
                <button
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          <div className='opc-request-container1'>
            <div className='table-container'>
              {loading ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                <table className="opcapproved-requests-table">
                  <thead>
                    <tr>
                      {confirmMode && <th>Select</th>}
                      <th>Transaction ID</th>
                      <th>Requestor</th>
                      <th>Type of Trip</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Capacity</th>
                      <th>Schedule</th>
                      <th>Vehicle</th>
                      <th>Added Vehicle</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={confirmMode ? "10" : "13"} className="no-requests">No Requests Available</td>
                      </tr>
                    ) : (
                      sortedRequests.map((request, index) => (
                        <tr
                          key={index}
                          className={
                            selectedRows.has(request.transactionId) ? 'selected-row' :
                            request.department.trim().toLowerCase() === "office of the president (vip)" ? 'highlight-vip' :
                            request.department.trim().toLowerCase() === "office of the vice-president (vip)" ? 'highlight-vip' :
                            request.department.trim().toLowerCase() === "college of computer studies (ccs)" ? 'highlight-ccs' :
                            'default-highlight'
                          }
                        >
                          {confirmMode && (
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRows.has(request.transactionId)}
                                onChange={() => handleRowSelection(request.transactionId)}
                              />
                            </td>
                          )}
                          <td>{request.transactionId}</td>
                          <td>{request.userName}</td>
                          <td>{request.typeOfTrip}</td>
                          <td>{request.destinationFrom}</td>
                          <td>{request.destinationTo}</td>
                          <td><span style={{color: "#782324", fontWeight: "700"}}>{request.capacity}</span></td>
                          <td>{formatDate(request.schedule)}</td>
                          <td><span style={{color: "#782324", fontWeight: "700"}}>{request.vehicleType}</span> : <span style={{color: "green", fontWeight: "700"}}>{request.plateNumber}</span></td>
                          <td>
                            {request.reservedVehicles && request.reservedVehicles.length > 0 ? (
                              request.reservedVehicles.map((vehicle, index) => (
                                <div key={index}>
                                  <span style={{color: "#782324", fontWeight: "700"}}>{vehicle.vehicleType}</span> : <span style={{color: "green", fontWeight: "700"}}>{vehicle.plateNumber}</span> 
                                </div>
                              ))
                            ) : (
                              "No Vehicles Added"
                            )}
                          </td>
                          <td><button className="view-more-btn" onClick={() => handleViewMore(request)}><FaEye style={{marginRight: "5px", marginBottom: "-2px"}}/>View More</button></td>
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
          <img src={logoImage1} alt="Logo" className="opc-request-logo-image" />
        </div>
      </div>
      {showModal && selectedRequest && (
  <div className="viewmore-modal-overlay">
    <div className="viewmore-modal-content">
      <h2>Request Details</h2>
      <div className='viewmore-modal-container'>
        <div className='transac-container'>
          <p style={{color: "#FFD700"}}><strong>Transaction Number:</strong> {selectedRequest.transactionId}</p>
        </div>
        <div className='viewmore-inner-container'>
          <p><strong>Requestor:</strong> {selectedRequest.userName}</p>
          <p><strong>Type of Trip:</strong> {selectedRequest.typeOfTrip}</p>
          <p><strong>From:</strong> {selectedRequest.destinationFrom}</p>
          <p><strong>To:</strong> {selectedRequest.destinationTo}</p>
          <p><strong>Capacity:</strong> {selectedRequest.capacity}</p>
          <p><strong>Vehicle:</strong> {selectedRequest.vehicleType} : {selectedRequest.plateNumber}</p>
          <p><strong>Schedule:</strong> {formatDate(selectedRequest.schedule)}</p>
          <p><strong>Return Schedule:</strong> {selectedRequest.returnSchedule === '0001-01-01' ? 'N/A' : formatDate(selectedRequest.returnSchedule)}</p>
          <p><strong>Departure Time:</strong> {selectedRequest.departureTime}</p>
          <p><strong>Pick Up Time:</strong> {selectedRequest.pickUpTime || "N/A"}</p>
          <p><strong>Driver:</strong> {selectedRequest.driverName || "N/A"}</p>
          <p><strong>Purpose:</strong> {selectedRequest.reason || "N/A"}</p>
          <p><strong>Added Vehicles: </strong> 
            {selectedRequest.reservedVehicles && selectedRequest.reservedVehicles.length > 0 ? (
                              selectedRequest.reservedVehicles.map((vehicle, index) => (
                                <div key={index}>
                                <span style={{color: "#782324", fontWeight: "700"}}>{vehicle.vehicleType}</span> : <span style={{color: "green", fontWeight: "700"}}>{vehicle.plateNumber}</span>
                                </div>
                              ))
                            ) : (
                              <div>No Vehicle Added</div>
                            )}
          </p>
          <p><strong>Added Drivers: </strong>
          {selectedRequest.reservedVehicles && selectedRequest.reservedVehicles.length > 0 ? (
                              selectedRequest.reservedVehicles.map((vehicle, index) => (
                                <div key={index}>- {vehicle.driverName || 'N/A'}</div>
                              ))
                            ) : (
                              <div>No Drivers Added</div>
                            )}
                            </p>
        </div>
        <button className="close-view-more-btn" onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
export default OpcApprovedRequests;

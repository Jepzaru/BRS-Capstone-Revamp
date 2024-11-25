import React, { useEffect, useState, useMemo } from 'react';
import { FaFlag, FaSortAlphaDown, FaSwatchbook, FaBus } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle, IoSearch } from "react-icons/io5";
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
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
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const token = localStorage.getItem('token');
  const [approvedRequests, setApprovedRequests] = useState([]);

  const fetchApprovedRequest = async () =>{
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/reservations/opc-approved`, {
        headers: { "Authorization": `Bearer ${token}` }  
      });

      const data = await response.json();
      setApprovedRequests(data || []);
    } catch (error) {
      console.error("Failed to fetch approved requests.", error);
    }
  };

  useEffect(() => {
    fetchApprovedRequest();
  }, [])

  const fetchHeadIsApprovedRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://citumovebackend.up.railway.app/reservations/head-approved", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      const currentDate = new Date();

      if (Array.isArray(data)) {
        const filteredRequests = data.filter(request => {
          const scheduleDate = new Date(request.schedule);
          const returnScheduleDate = new Date(request.returnSchedule);

          return (
            (!request.opcIsApproved && !request.rejected) &&
            (scheduleDate >= currentDate || returnScheduleDate >= currentDate)
          );
        });

        const count = filteredRequests.length;
        setRequests(filteredRequests);
        setRequestCount(count); 

        localStorage.setItem('requestCount', count);
        
      } else {
        console.error("Unexpected data format:", data);
        setRequests([]);
        setRequestCount(0);  

        localStorage.setItem('requestCount', 0);
      }
    } catch (error) {
      console.error("Failed to fetch requests.", error);
      setRequests([]);
      setRequestCount(0);  

      localStorage.setItem('requestCount', 0);
    } finally {
      setLoading(false);
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
      const response = await fetch("https://citumovebackend.up.railway.app/opc/driver/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const drivers = await response.json();
  
      const filteredDrivers = drivers.filter(driver => {
        return !approvedRequests.some(request =>
          request.driverId === driver.id &&
          request.schedule === selectedRequest.schedule &&
          request.departureTime === selectedRequest.departureTime
        );
      });
  
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
    let filteredRequests = requests;
  
    if (searchTerm) {
      filteredRequests = filteredRequests.filter((request) =>
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    filteredRequests.sort((a, b) => {
      const dateA = new Date(a.schedule);
      const dateB = new Date(b.schedule);
  
      return dateA - dateB;
    });
  
    if (sortBy === 'alphabetical') {
      filteredRequests.sort((a, b) =>
        a.reason.toLowerCase() > b.reason.toLowerCase() ? 1 : -1
      );
    } else if (sortBy === 'ascending') {
      filteredRequests.sort((a, b) => a.capacity - b.capacity);
    } else if (sortBy === 'descending') {
      filteredRequests.sort((a, b) => b.capacity - a.capacity);
    }
  
    return filteredRequests;
  };
  
  const handleOpenModal = (request, action) => {
    setSelectedRequest({
      ...request,
      schedule: request.schedule,
      returnSchedule: request.returnSchedule,
      reservedVehicles: request.reservedVehicles 
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

  const handleDriverSelect = (vehicleId, driver) => {
    if (!driver) return; 
  
    const isDriverAssigned = selectedRequest.reservedVehicles.some(vehicle => vehicle.driverId === driver.id && vehicle.id !== vehicleId);
  
    const isMainVehicleAssigned = selectedDriver && selectedDriver.id === driver.id;
  
    if (isDriverAssigned || isMainVehicleAssigned) {
      alert(`Driver ${driver.driverName} is already assigned to another vehicle.`);
      return; 
    }
  
    setSelectedRequest(prevRequest => {
      const updatedVehicles = prevRequest.reservedVehicles.map(vehicle => {
        if (vehicle.id === vehicleId) {
          return { ...vehicle, driverId: driver.id, driverName: driver.driverName };
        }
        return vehicle;
      });
  
      return { ...prevRequest, reservedVehicles: updatedVehicles };
    });
  };
  
  const handleReject = async () => {
    if (!feedback.trim()) {
      alert('Please provide reason of rejection.');
      return;
    }
  
    const reservationData = {
      rejected: true,
      status: 'Rejected',
      feedback: feedback
    };
  
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/reservations/update/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`,
        }, 
        body: JSON.stringify(reservationData),
      });
  
      if (response.ok) {
        await fetchHeadIsApprovedRequests();
        handleCloseModal();
        window.location.reload();
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
      status: 'Approved',
      reservedVehicles: selectedRequest.reservedVehicles,
    };
  
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/reservations/update/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });
  
      if (response.ok) {
        await fetchHeadIsApprovedRequests(); 
        handleCloseModal(); 
        window.location.reload(); 
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
  
      if (!leaveStart || !leaveEnd) {
        return true;
      }
  
      const isOnLeaveDuringSchedule = schedule && leaveEnd >= schedule && leaveStart <= schedule;
      const isOnLeaveDuringReturn = returnDate && leaveEnd >= returnDate && leaveStart <= returnDate;
  
      return !(isOnLeaveDuringSchedule || isOnLeaveDuringReturn);
    });
  };

  const handleViewFile = (fileUrl) => {
    if (fileUrl && fileUrl !== "No file(s) attached" && fileUrl !== 'null') {
      window.open(fileUrl, '_blank');
    } else {
      alert("No file URL available");
    }
  };

  const findDuplicateSchedules = (scheduleType) => {
    const scheduleCount = {};
    
    requests.forEach(request => {
      const schedule = request[scheduleType];
      if (schedule && schedule !== 'N/A' && schedule !== '0001-01-01') {
        if (!scheduleCount[schedule]) {
          scheduleCount[schedule] = 1;
        } else {
          scheduleCount[schedule]++;
        }
      }
    });

    return scheduleCount;
  };

  const duplicateSchedules = findDuplicateSchedules('schedule');
  const duplicateReturnSchedules = findDuplicateSchedules('returnSchedule');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const allVehiclesHaveDrivers = () => {
    return selectedRequest?.reservedVehicles.every(vehicle => vehicle.driverId);
  };
  
  const filteredRequests = useMemo(() => getFilteredAndSortedRequests(), [requests, searchTerm, sortBy]);

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
    <div className="opcrequest">
      <Header />
      <div className="opc-request-content1">
        <SideNavbar requestCount={requestCount} />
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
                <FaFlag style={{ color: 'red', paddingRight: '10px' }} />Vip Request</span>
            </div>

          </div>
          <div className='opc-request-container1'>
            <div className="table-container">
            {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div> 
          </div>
        ) : (
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
        
                      const parseTimeToDate = (timeString) => {
                        const date = new Date(); 
                        const [time, modifier] = timeString.split(' '); 
                        const [hours, minutes] = time.split(':').map(Number); 
                        let hoursAdjusted = hours;
                        
                        
                        if (modifier === 'PM' && hours < 12) {
                            hoursAdjusted += 12;
                        } else if (modifier === 'AM' && hours === 12) {
                            hoursAdjusted = 0;
                        }
                        
                        date.setHours(hoursAdjusted, minutes, 0, 0); 
                        return date;
                    };
                    
                    
                    const isTimeConflict = (requestTime, otherRequestTime) => {
                        const requestDate = parseTimeToDate(requestTime);
                        const otherRequestDate = parseTimeToDate(otherRequestTime);
                        
                        
                        const twoHoursInMillis = 2 * 60 * 60 * 1000;
                        const startBuffer = new Date(requestDate.getTime() - twoHoursInMillis);
                        const endBuffer = new Date(requestDate.getTime() + twoHoursInMillis);
                        
                        return otherRequestDate >= startBuffer && otherRequestDate <= endBuffer;
                    };
                    
                    const requests = getFilteredAndSortedRequests();
                    
                    const isDuplicateSchedule = requests.some(otherRequest => 
                      otherRequest.schedule === request.schedule &&
                      otherRequest.vehicleType === request.vehicleType &&
                      otherRequest.plateNumber === request.plateNumber &&
                      isTimeConflict(otherRequest.departureTime, request.departureTime) && 
                      otherRequest.id !== request.id
                    );
                    
                    const isReturnScheduleValid = request.returnSchedule !== null;
                    const isDuplicateReturnSchedule = isReturnScheduleValid && requests.some(otherRequest => 
                      otherRequest.returnSchedule === request.returnSchedule &&
                      otherRequest.vehicleType === request.vehicleType &&
                      otherRequest.plateNumber === request.plateNumber &&
                      isTimeConflict(otherRequest.pickUpTime, request.pickUpTime) && 
                      otherRequest.id !== request.id
                    );
                    
                    const hasVehicleConflict = requests.some(otherRequest => {
                      if (otherRequest.id !== request.id) {
                        const isMainScheduleConflict = otherRequest.schedule === request.schedule &&
                          otherRequest.vehicleType === request.vehicleType && 
                          otherRequest.plateNumber === request.plateNumber &&
                          isTimeConflict(otherRequest.departureTime, request.departureTime); 
                    
                        const isReturnScheduleConflict = isReturnScheduleValid && otherRequest.returnSchedule !== null && 
                          otherRequest.returnSchedule === request.returnSchedule &&
                          otherRequest.vehicleType === request.vehicleType &&
                          otherRequest.plateNumber === request.plateNumber &&
                          isTimeConflict(otherRequest.pickUpTime, request.pickUpTime); 
                    
                        return isMainScheduleConflict || isReturnScheduleConflict;
                      }
                      return false;
                    });
                    
                    const isConflict = hasVehicleConflict || isDuplicateSchedule || isDuplicateReturnSchedule;
                    const statusClass = isConflict ? 'conflict-status' : '';
                    const updatedStatus = isConflict ? 'Conflict' : request.status;
                      
                      return (
                        <tr
                          key={index}
                          className={`
                            ${request.department.trim().toLowerCase() === "office of the president (vip)" ? 'highlight-vip' : ''}
                             ${request.department.trim().toLowerCase() === "office of the vice-president (vip)" ? 'highlight-vip' : ''}
                             ${hasVehicleConflict ? 'highlight-vehicle-conflict' : ''}
                          `}
                        >
                            <td>{request.transactionId}</td>
                            <td>{request.userName}</td>
                            <td><span style={{color: "#782324", fontWeight: "700"}}>{request.department}</span></td>
                            <td>{request.typeOfTrip}</td>
                            <td>{request.destinationFrom}</td>
                            <td>{request.destinationTo}</td>
                            <td><span style={{color: "#782324", fontWeight: "700"}}>{request.capacity}</span></td>
                            <td><span style={{color: "#782324", fontWeight: "700"}}>{request.vehicleType}</span> : <span style={{color: "green", fontWeight: "700"}}>{request.plateNumber}</span></td>
                            <td>
                              {request.reservedVehicles && request.reservedVehicles.length > 0 ? (
                                request.reservedVehicles.map((vehicle, index) => (
                                  <div key={index}>
                                    <span style={{color: "#782324", fontWeight: "700"}}>{vehicle.vehicleType}</span> : <span style={{color: "green", fontWeight: "700"}}>{vehicle.plateNumber}</span> 
                                  </div>
                                ))
                              ) : (
                                <div><span style={{fontWeight: "700"}}>No Vehicles Added</span></div>
                              )}
                            </td>
                            <td>{request.schedule ? formatDate(request.schedule) : 'N/A'}</td>
                            <td>{request.returnSchedule && request.returnSchedule !== "0001-01-01" ? formatDate(request.returnSchedule) : 'N/A'}</td>
                            <td>{request.departureTime || 'N/A'}</td>
                            <td>{request.pickUpTime === '0001-01-01' ? 'N/A' : request.pickUpTime || 'N/A'}</td>
                            <td className="reason-column">{request.reason}</td>
                            <td className={request.status === 'Pending' ? 'status-pending' : ''}>
                            <div className="status-container">
                            <span className={statusClass}>
                              {updatedStatus}
                              </span>
                              {request.department.trim().toLowerCase() === 'office of the president (vip)' ? (
                                  <span className="vip-request-badge">
                                      <FaFlag style={{ color: 'red' }} />
                                  </span>
                              ) : (
                                  (request.department.trim().toLowerCase() === 'office of the vice-president (vip)' ? (
                                      <span className="vip-request-badge">
                                          <FaFlag style={{ color: 'red' }} />
                                      </span>
                                  ) : (
                                    (request.department.trim().toLowerCase() === 'college of computer studies (ccs)' ||
                                     request.department.trim().toLowerCase() === 'college of engineering and architecture (cea)' ||
                                     request.department.trim().toLowerCase() === 'college of management, business & accountancy (cmba)' ||
                                     request.department.trim().toLowerCase() === 'college of arts, sciences, & education (case)' ||
                                     request.department.trim().toLowerCase() === 'college of criminal justice (ccj)' ||
                                     request.department.trim().toLowerCase() === 'college of nursing and allied health sciences (cnahs)') && (
                                        <span className="normal-request-badge">
                                            <FaFlag style={{ color: 'blue' }} />
                                        </span>
                                    )
                                ) || (
                                    
                                    <span className="normal-request-badge">
                                        <FaFlag style={{ color: 'blue' }} /> 
                                    </span>
                                ))
                              )}
                          </div>
                            </td>
                            <td>
                              <div className="opc-action-buttons">
                              <button
                                    className="opc-approve-button"
                                    onClick={() => handleOpenModal(request, 'approve')}
                                    disabled={updatedStatus === 'Conflict'}
                                    style={{
                                      opacity: updatedStatus === 'Conflict' ? 0.5 : 1,
                                      backgroundColor: updatedStatus === 'Conflict' ? 'black' : 'green', 
                                      cursor: updatedStatus === 'Conflict' ? 'not-allowed' : 'pointer' 
                                    }}
                                  >
                                    <FaCircleCheck style={{ marginBottom: "-2px", marginRight: "5px" }} /> Approve
                                  </button>
                                <button className="opc-reject-button" onClick={() => handleOpenModal(request, 'reject')}>
                                  <IoCloseCircle style={{ marginBottom: "-2px", marginRight: "3px", marginLeft: "-5px", fontSize: "16px" }} /> Reject
                                </button>
                                {request.fileUrl && request.fileUrl !== "No file(s) attached" && request.fileUrl !== 'null' ? (
                                  <button onClick={() => handleViewFile(request.fileUrl)} className="opc-view-file-button" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                    View File
                                  </button>
                                ) : (
                                  <button className="opc-view-file-button" style={{ fontSize: '10px', fontWeight: 'bold' }} disabled>
                                    No file attached
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

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>{modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}</h2>
      <p>Are you sure you want to {modalAction} this request?</p>

      {modalAction === 'approve' ? (
        <div className="modal-driver-selection">
       
          <label htmlFor="driver-select">
            <FaBus style={{ color: "#782324", marginRight: "5px", marginBottom: '-2px' }} />
            Main Vehicle:
          </label>
          <select
            id="driver-select"
            value={selectedDriver ? selectedDriver.id : ''}
            onChange={(e) => {
              const driverId = e.target.value;
              const driver = drivers.find(driver => String(driver.id) === String(driverId));

            
              const isDriverAssigned = selectedRequest.reservedVehicles.some(vehicle => vehicle.driverId === driver.id);

              if (isDriverAssigned) {
                alert(`Driver ${driver.driverName} is already assigned to another vehicle.`);
                return; 
              }

              setSelectedDriver(driver);
            }}
            style={{
              width: '150px',
              padding: '2px 5px',
              border: '2px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              fontSize: '14px',
              marginLeft: '5px',
              color: '#333',
              transition: 'border-color 0.3s ease, background-color 0.3s ease'
            }}
          >
            <option value="" disabled selected>Select Driver</option>
            {filterDriversByLeaveDates(drivers, selectedRequest.schedule, selectedRequest.returnSchedule)
              .map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.driverName}
                </option>
              ))}
          </select>

              {selectedRequest.reservedVehicles && (
                <div className="modal-vehicle-list">
                  <h3>Added Vehicles:</h3>
                  <ul>
                    {selectedRequest.reservedVehicles.map((vehicle) => (
                      <p key={vehicle.id}>
                        <strong>
                          <FaBus style={{ color: "blue", marginRight: "5px", marginBottom: '-2px' }} />
                          Vehicle:
                        </strong> <span style={{ marginRight: "5px"}}>{vehicle.plateNumber} : </span>

                        <label htmlFor={`driver-select-${vehicle.id}`}></label>
                        <select
                          id={`driver-select-${vehicle.id}`}
                          value={vehicle.driverId || ''}
                          onChange={(e) => {
                            const driverId = e.target.value;
                            const driver = drivers.find(driver => String(driver.id) === String(driverId));
                            handleDriverSelect(vehicle.id, driver); 
                          }}
                          style={{
                            width: '150px',
                            padding: '2px 5px',
                            border: '2px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#f9f9f9',
                            fontSize: '14px',
                            marginLeft: '5px',
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
                      </p>
                    ))}
                  </ul>
                </div>
              )}
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
              onClick={modalAction === 'approve' ? handleApprove : handleReject}
              disabled={modalAction === 'approve' ? !allVehiclesHaveDrivers() : !feedback.trim()}
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
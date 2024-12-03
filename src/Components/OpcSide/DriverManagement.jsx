import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import DriverManagementCalendar from './DriverManagementCalendar';
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { BsPersonFillAdd, BsFillPersonFill } from "react-icons/bs";
import { PiSteeringWheelFill} from "react-icons/pi";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiReservedFill } from "react-icons/ri";
import '../../CSS/OpcCss/DriverManagement.css';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const minDate = getCurrentDate(); 

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [updateDriverName, setUpdateDriverName] = useState('');
  const [updateDriverStatus, setUpdateDriverStatus] = useState('');
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState('');
  const [updateLeaveStartDate, setUpdateLeaveStartDate] = useState('');
  const [updateLeaveEndDate, setUpdateLeaveEndDate] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const minDate = getCurrentDate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedDriver, setSelectedDriver] = useState("all"); 
  const [reservations, setReservations] = useState([]); 
  const [selectedDriverName, setSelectedDriverName] = useState("all");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [reservationIdToComplete, setReservationIdToComplete] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await fetch("https://citumovebackend.up.railway.app/opc/driver/getAll", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch driver details", error);
      }
    };
    fetchDriverDetails();
  }, [token, selectedDriverId]);

  useEffect(() => {
    const fetchReservations = async () => {
        try {
            const response = await fetch(`https://citumovebackend.up.railway.app/reservations/opc-approved`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            
            const filteredReservations = selectedDriver === "all" 
                ? data 
                : data.filter(reservation => reservation.driver_id === parseInt(selectedDriver, 10));

            setReservations(filteredReservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };
    fetchReservations();
  }, [selectedDriver, token]); 

  const driverNames = Array.from(new Set(reservations.map(reservation => reservation.driverName))).filter(Boolean);
 
  const filteredList = selectedDriverName === "all"
    ? reservations
    : reservations.filter(reservation => reservation.driverName === selectedDriverName);

  const handleDriverChange = (event) => {
    setSelectedDriver(event.target.value);
    console.log("Selected Driver ID:", event.target.value); 
  };
  
  const filteredReservations = selectedDriver === 'all'
  ? reservations
  : reservations.filter(reservation => {
      console.log('Checking reservation:', reservation);
      return reservation.driverId === Number(selectedDriver); 
    });

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
    setDriverName('');
    setPhoneNumber('');
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  const openUpdateModal = (driver) => {
    setUpdateDriverName(driver.driverName);
    setUpdateDriverStatus(driver.status);
    setUpdatePhoneNumber(driver.contactNumber);
    setUpdateLeaveStartDate(driver.leaveStartDate || '');
    setUpdateLeaveEndDate(driver.leaveEndDate || '');
    setSelectedDriverId(driver.id);
    setIsUpdateModalOpen(true);
    setIsClosing(false);
  };

  const closeUpdateModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsUpdateModalOpen(false);
    }, 300);
  };

  const openDeleteModal = (driverId) => {
    setSelectedDriverId(driverId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDriverId(null);
  };

  const handleAddDriver = async () => {
    try {
      const response = await fetch("https://citumovebackend.up.railway.app/opc/driver/post", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ driverName, contactNumber: phoneNumber })
      });
      if (response.ok) {
        await fetchDriverDetails();  
        closeModal();
      } else {
        throw new Error('Failed to add driver');
      }
    } catch (error) {
      console.error("Failed to add driver", error);
    }
  };
  
  const handleUpdateDriver = async () => {
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/opc/driver/update/${selectedDriverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          driverName: updateDriverName,
          contactNumber: updatePhoneNumber,
          status: updateDriverStatus,
          leaveStartDate: updateLeaveStartDate || null,
          leaveEndDate: updateLeaveEndDate || null
        })
      });
      if (response.ok) {
        await fetchDriverDetails(); 
        closeUpdateModal();
      } else {
        throw new Error('Failed to update driver');
      }
    } catch (error) {
      console.error("Failed to update driver", error);
    }
  };
  
  

  const handleDeleteDriver = async () => {
    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/opc/driver/delete/${selectedDriverId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setDrivers(drivers.filter(driver => driver.id !== selectedDriverId));
        closeDeleteModal();
      } else {
        throw new Error('Failed to delete driver');
      }
    } catch (error) {
      console.error("Failed to delete driver.", error);
    }
  };

  const openConfirmModal = (reservationId) => {
    setReservationIdToComplete(reservationId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setReservationIdToComplete(null);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setIsConfirmModalOpen(false); 
    setReservations(reservations.map(reservation =>
      reservation.id === reservationIdToComplete ? { ...reservation, is_completed: 1, status: 'Completed' } : reservation
    ));
  };

  const handleComplete = async () => {
    closeConfirmModal();

    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/user/reservations/complete/${reservationIdToComplete}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to complete reservation: ${response.status} ${errorText}`);
      }

      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation.id === reservationIdToComplete ? { ...reservation, is_completed: 1, status: 'Completed' } : reservation
        )
      );

      setModalMessage("Reservation completed successfully!");
      setIsMessageModalOpen(true);

    } catch (error) {
      console.error("Failed to complete reservation:", error);
      setModalMessage(error.message);
      setIsMessageModalOpen(true);
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    switch (sortOption) {
      case 'alphabetical':
        return a.driverName.localeCompare(b.driverName);
      case 'ascending':
        return a.contactNumber.localeCompare(b.contactNumber);
      case 'descending':
        return b.contactNumber.localeCompare(a.contactNumber);
      default:
        return 0;
    }
  });
  
  const filteredDrivers = sortedDrivers.filter(driver =>
    driver.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.contactNumber.includes(searchQuery)
  );

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  }; 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const handleDateSelect = (date) => {
    if (isSelectingStartDate) {
      setUpdateLeaveStartDate(date);
    } else {
      setUpdateLeaveEndDate(date);
    }
    setShowCalendar(false);
  };
  
  
  const handleCloseCalendar = () => {
    setShowCalendar(false); 
    setSelectedVehicle(null); 
  };
  
  const openCalendarForStartDate = () => {
    setIsSelectingStartDate(true);
    setShowCalendar(true);
  };
  
  const openCalendarForEndDate = () => {
    setIsSelectingStartDate(false);
    setShowCalendar(true);
  };
  
  return (
    <div className="drivermanage">
      <Header />
      <div className={`driver-manage-content1 ${isModalOpen || isUpdateModalOpen ? 'dimmed' : ''}`}>
        <SideNavbar />
        <div className="driver1">
          <div className="header-container">
            <h1><PiSteeringWheelFill style={{ marginRight: "15px", color: "#782324", marginBottom: "-3px", fontSize: "36px" }} />Driver Management</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Driver"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <button className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /></button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Phone Number Ascending</option>
                <option value="descending">Phone Number Descending</option>
              </select>
              <button className='add-driver-btn' onClick={openModal}><BsPersonFillAdd style={{ marginRight: "10px", marginBottom: "-2px" }} />Add new Driver</button>
            </div>
          </div>
          <div class="driver-management-wrapper">
                <div className='driver-list-container'>
                  <div className="driver-schedlist">
                    <h3>
                      <BsFillPersonFill style={{ color: "#782324", marginRight: "15px", marginBottom: "-2px" }} />
                      Driver List
                    </h3>
                  </div>
                  <div className='driver-table-container'>
                    <table className="driver-table">
                      <thead>
                        <tr>
                          <th> Driver Name</th> 
                          <th> Phone Number</th>
                          <th> Status</th>
                          <th> Start Leave Date</th>
                          <th> End Leave Date</th>
                          <th> Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDrivers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="no-driver">
                              <PiSteeringWheelFill style={{ fontSize: "24px", marginBottom: "-2px" }} /> No Driver Registered
                            </td>
                          </tr>
                        ) : (
                          filteredDrivers.map((driver) => (
                            <tr key={driver.id}>
                              <td>{driver.driverName}</td>
                              <td>{driver.contactNumber}</td>
                              <td style={{ 
                                  fontWeight: '700', 
                                  color: driver.status === 'Available' ? 'green' : driver.status === "Unavailable" ? 'red' : 'orange' 
                                }}>
                                {driver.status}
                              </td>
                              <td>{driver.leaveStartDate && driver.leaveStartDate !== "0001-01-01" ? formatDate(driver.leaveStartDate) : 'N/A'}</td>
                              <td>{driver.leaveEndDate && driver.leaveEndDate !== "0001-01-01" ? formatDate(driver.leaveEndDate) : 'N/A'}</td>
                              <td className="td-action">
                                <div className="button-container">
                                  <button className="driver-update-button" onClick={() => openUpdateModal(driver)}>
                                    <MdOutlineSystemUpdateAlt style={{ marginBottom: "-2px", marginRight: "5px" }} /> Update
                                  </button>
                                  <button className="driver-delete-button" onClick={() => openDeleteModal(driver.id)}>
                                    <FaRegTrashAlt style={{ marginBottom: "-2px", marginRight: "5px" }} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
          <div className="driver-reservations">
          <div className="driver-schedlist">
                  <h3>
                    <RiReservedFill style={{ color: "#782324", marginRight: "15px", marginBottom: "-2px" }} />
                    Driver Reservations
                  </h3>
                  <BsFillPersonFill style={{ color: "#782324", marginLeft: "300px", marginBottom: "-2px" }} />
                <select className="reservation-filter"
                  value={selectedDriverName}
                  onChange={(e) => setSelectedDriverName(e.target.value)}
                >
                  <option value="all">All Drivers</option>
                  {driverNames.map(driver => (
                    <option key={driver} value={driver}>{driver}</option>
                  ))}
                </select>
                </div>
          <div className='driver-table-container'>
          <table className="driver-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Schedule</th>
                  <th>Departure Time</th>
                  <th>Return Schedule</th>
                  <th>Pick-Up Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="7">No reservations available for the selected driver.</td>
                  </tr>
                ) : (
                  filteredList
                    .sort((a, b) => {
                      if (a.isCompleted === b.isCompleted) {
                        return new Date(b.schedule) - new Date(a.schedule);
                      }
                      return a.isCompleted - b.isCompleted;
                    })
                    .map(reservation => (
                      <tr key={reservation.id}>
                        <td>
                          <span style={{backgroundColor: "#782324", color: "gold", padding: "3px 5px", borderRadius: "50px", fontSize: "10px", marginRight:"3px", fontWeight: "700"}}>
                            1
                          </span>
                          <span style={{color: "#782324", fontWeight: "700"}}>{reservation.driverName || 'N/A'}</span>
                          {reservation.reservedVehicles && reservation.reservedVehicles.length > 0 && (
                            <div style={{ marginTop: "5px" }}>
                              {reservation.reservedVehicles.map((vehicle, index) => (
                                <div key={index + 1} style={{marginTop: "5px"}}>
                                  <span style={{backgroundColor: "#782324", color: "gold", padding: "3px 5px", borderRadius: "50px", fontSize: "10px", marginRight:"3px", fontWeight: "700"}}>{index + 2}</span> 
                                  <span style={{ color: "#782324", fontWeight: "700" }}>{vehicle.driverName}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          </td>
                        <td>
                          <div>
                          <span style={{backgroundColor: "#782324", color: "gold", padding: "3px 5px", borderRadius: "50px", fontSize: "10px", marginRight:"3px", fontWeight: "700"}}>
                            1
                          </span>
                          <span style={{ color: "#782324", fontWeight: "700" }}>{reservation.vehicleType || 'N/A'}</span> : 
                            <span style={{ color: "green", fontWeight: "700" }}> {reservation.plateNumber || 'N/A'}</span>
                          </div>
                          {reservation.reservedVehicles && reservation.reservedVehicles.length > 0 && (
                            <div style={{ marginTop: "5px" }}>
                              {reservation.reservedVehicles.map((vehicle, index) => (
                                <div key={index + 1}>
                                  <span style={{backgroundColor: "#782324", color: "gold", padding: "3px 5px", borderRadius: "50px", fontSize: "10px", marginRight:"3px", fontWeight: "700"}}>{index + 2}</span> 
                                  <span style={{ color: "#782324", fontWeight: "700" }}>{vehicle.vehicleType}</span> : <span style={{ color: "green", fontWeight: "700" }}>{vehicle.plateNumber}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>{reservation.schedule ? formatDate(reservation.schedule) : 'N/A'}</td>
                        <td>{reservation.departureTime || 'N/A'}</td>
                        <td>{reservation.returnSchedule === '0001-01-01' ? 'N/A' : reservation.returnSchedule ? formatDate(reservation.returnSchedule) : 'N/A'}</td>
                        <td>{reservation.pickUpTime === '0001-01-01' ? 'N/A' : reservation.pickUpTime || 'N/A'}</td>
                        <td>
                          {reservation.isCompleted === true ? (
                            <span style={{ color: 'green', fontWeight: 'bold' }}>{reservation.status}</span>
                          ) : (
                            <button className="complete-button" onClick={() => openConfirmModal(reservation.id)}>Complete</button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
              </div>
              </div>
          </div>
          <img src={logoImage1} alt="Logo" className="driver-logo-image" />
        </div>
      </div>
      {isModalOpen && (
        <div className={`driver-modal-overlay ${isClosing ? 'driver-modal-closing' : ''}`}>
          <div className={`driver-modal ${isClosing ? 'driver-modal-closing' : ''}`}>
            <h2>Add New Driver 
              <button className="close-driver-btn" onClick={closeModal}>
                <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
              </button>
            </h2>
            <form action="" onSubmit={handleAddDriver}>
              <div className='add-driver-input'>
                <label htmlFor='driver-name'>Driver Name</label>
                <input
                  type="text"
                  placeholder="Ex. John Doe"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="driver-input"
                  required
                />
                
                <label htmlFor='phone number'>Phone Number</label>
                <input
                  type="text"
                  placeholder="Ex. 09*********"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(value);
                  }}
                  pattern="\d{11}"
                  title="Phone number should be exactly 11 digits"
                  maxLength="11"
                  className="driver-input"
                  required
                />
                <button className="add-driver-btn-modal">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
  <div className={`driver-modal-overlay ${isClosing ? 'driver-modal-closing' : ''}`}>
    <div className={`driver-modal ${isClosing ? 'driver-modal-closing' : ''}`}>
      <h2>Update Driver 
        <button className="close-driver-btn" onClick={closeUpdateModal}>
          <IoIosCloseCircle style={{ fontSize: "32px", marginBottom: "-8px" }} />
        </button>
      </h2>
      <form action="" onSubmit={handleUpdateDriver}>
        <div className='add-driver-input'>
          <label htmlFor='driver-name'>Driver Name</label>
          <input
            type="text"
            placeholder="Ex. John Doe"
            value={updateDriverName}
            required
            onChange={(e) => setUpdateDriverName(e.target.value)}
            className="driver-input"
          />
          
          <label htmlFor='phone number'>Phone Number</label>
          <input
            type="text"
            placeholder="Ex. 09363882526"
            value={updatePhoneNumber}
            required
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setUpdatePhoneNumber(value);
            }}
            pattern="\d{11}"
            title="Phone number should be exactly 11 digits"
            maxLength="11"
            className="driver-input"
          />

          <label htmlFor='driver-status'>Status</label>
          <select
            id="updateStatus"
            value={updateDriverStatus}
            onChange={(e) => {
              setUpdateDriverStatus(e.target.value);
              if (e.target.value !== 'On leave') {
                setUpdateLeaveStartDate('');
                setUpdateLeaveEndDate('');
              }
            }}
            className="driver-input"
            required
            style={{
              color: updateDriverStatus === 'Available' ? 'green' 
                : updateDriverStatus === 'On leave' ? 'orange' 
                : updateDriverStatus === 'Unavailable' ? 'red' 
                : 'black', 
              fontWeight: '700' 
            }}
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="On leave">On leave</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {updateDriverStatus === 'On leave' && (
            <div className="leave-date-container">
              <div>
                <label htmlFor='leave-start-date'>Start Leave Date</label>
                <input
                  type="text"
                  id="leave-start-date"
                  name="leave-start-date"
                  value={updateLeaveStartDate ? new Date(updateLeaveStartDate).toLocaleDateString('en-US') : ''}
                  onClick={openCalendarForStartDate}
                  placeholder='Select Start Date'
                  readOnly
                  required
                />
              </div>
              <div>
                <label htmlFor='leave-end-date'>End Leave Date</label>
                <input
                  type="text"
                  id="leave-end-date"
                  name="leave-end-date"
                  value={updateLeaveEndDate ? new Date(updateLeaveEndDate).toLocaleDateString('en-US') : ''}
                  onClick={openCalendarForEndDate}
                  placeholder='Select Start Date'
                  readOnly
                  required
                />
              </div>
            </div>
          )}
          <button className="add-driver-btn-modal">Update Driver</button>
        </div>
      </form>
    </div>
  </div>
)}

      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Are you sure you want to delete this Driver?</h2>
            <div className="delete-modal-buttons">
              <button className="cancel-button" onClick={closeDeleteModal}>Cancel</button>
              <button className="delete-button-confirm" onClick={() => handleDeleteDriver(selectedDriverId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

{isConfirmModalOpen && (
  <div className="driver-modal-overlay">
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <h2>Are you sure to complete this reservation?</h2>
            <div className="driver-modal-buttons">
            <button className="cancel-button" onClick={closeConfirmModal}>No</button>
            <button className="yes-button-confirm" onClick={handleComplete}>Yes</button>
            </div>
          </div>
        </div>
        </div>
      )}

{isMessageModalOpen && (
  <div className="driver-modal-overlay">
        <div className="msg-modal">
          <div className="msg-modal-content">
            <h2>{modalMessage}</h2>
            <div className="driver-modal-buttons">
            <button className="yes-button-confirm" onClick={closeMessageModal}>OK</button>
          </div>
          </div>
        </div>
        </div>
      )}

{showCalendar && (
  <div className="calendar-modal">
    <div className="user-calendar-modal-content">
      <DriverManagementCalendar
        onDateSelect={handleDateSelect} 
        minDate={updateLeaveStartDate} 
      />
      <button className="close-button" style={{marginTop: '10px'}} onClick={handleCloseCalendar}>
        <span style={{fontWeight: "700", fontSize: "16px"}}>Close</span>
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default DriverManagement;

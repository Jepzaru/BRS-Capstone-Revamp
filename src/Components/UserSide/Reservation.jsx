import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { CgDetailsMore } from "react-icons/cg";
import { FaBus, FaCalendarDay, FaFileAlt } from "react-icons/fa";
import { FaBuildingUser, FaFileSignature, FaLocationCrosshairs, FaLocationDot, FaUserGroup } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { IoTime, IoTrash } from "react-icons/io5";
import { RiArrowGoBackLine, RiSendPlaneFill } from "react-icons/ri";
import { useLocation, useNavigate } from 'react-router-dom';
import '../../CSS/UserCss/Reservation.css';
import logoImage1 from '../../Images/citbglogo.png';
import { storage } from '../Config/FileStorageConfig';
import AddVehicleModal from './AddVehicleModal';
import Calendar from './Calendar';
import DepartTimeDropdown from './DepartTimeDropdown';
import Header from './Header';
import PickUpDropdown from './PickUpDropdown';
import ReservationModal from './ReservationModal';
import SideNavbar from './SideNavbar';

const Reservation = () => {
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tripType, setTripType] = useState('oneWay');
  const [isMultipleVehicles, setIsMultipleVehicles] = useState(false);
  const [showVehicleContainer, setShowVehicleContainer] = useState(false);
  const [isAddVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [returnScheduleDate, setReturnScheduleDate] = useState(null);
  const [isSelectingReturn, setIsSelectingReturn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {}; 
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const localPart = email.split('@')[0];
  const [firstName, lastName] = localPart.split('.');
  const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const [reservedDates, setReservedDates] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [addedVehicles, setAddedVehicles] = useState([]);
  const [addedVehiclePlates, setAddedVehiclePlates] = useState([]);
  const [userDepartment, setUserDepartment] = useState('');
  const [selectedVehiclePlateNumber, setSelectedVehiclePlateNumber] = useState(vehicle ? vehicle.plateNumber : '');
  const [capacityExceeded, setCapacityExceeded] = useState(false);
  const [capacityError, setCapacityError] = useState('');

  useEffect(() => {
    if (vehicle && vehicle.plateNumber) {
      setSelectedVehiclePlateNumber(vehicle.plateNumber);
    }
  }, [vehicle]);

  const formatTime = (time) => {
    if (!time || time === "N/A") return '';
    const [hours, minutes] = time.split(':');
    const formattedHours = (parseInt(hours, 10) % 12) || 12;
    const amPm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${amPm}`;
  };

  const [formData, setFormData] = useState({
    to: '',
    from: '',
    capacity: '',
    department: '',
    vehicleType: vehicle ? vehicle.vehicleType : '', 
    plateNumber: vehicle ? vehicle.plateNumber : '',
    departureTime: '',
    pickUpTime: '', 
    reservationReason: '',
    approvalProof: null,
    fileName: ''
  });

  useEffect(() => {
    if (selectedVehicle) {
      setFormData(prevFormData => ({
        ...prevFormData,
        vehicleType: selectedVehicle.vehicleType,
        plateNumber: selectedVehicle.plateNumber,
      }));
    }
  }, [selectedVehicle]);

  const [isAddVehicleDisabled, setIsAddVehicleDisabled] = useState(true); 

  const handleAddVehicleClick = () => {
    setAddVehicleModalOpen(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false); 
    setSelectedVehicle(null); 
  };
  
  const handleCloseModal = () => {
    setAddVehicleModalOpen(false);
  };
  
  const handleAddVehicle = (vehicle) => {
    setAddedVehiclePlates(prev => [...prev, vehicle.plateNumber]);
    setAddedVehicles(prevVehicles => [...prevVehicles, vehicle]);
    setAddVehicleModalOpen(false);
  };

  const handleRemoveVehicle = (plateNumber) => {
    setAddedVehicles(prev => prev.filter(v => v.plateNumber !== plateNumber));
    setAddedVehiclePlates(prev => prev.filter(p => p !== plateNumber));
  };

  const calculateMaxCapacity = () => {
    let totalCapacity = 0;
    if (vehicle) {
      totalCapacity += vehicle.capacity; 
    }
    addedVehicles.forEach(v => {
      totalCapacity += v.capacity; 
    });
    return totalCapacity;
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
  
    if (name === 'capacity') {
      const capacity = Number(value);
      setFormData({ ...formData, [name]: value });
  
    
      evaluateButtonState(capacity, selectedDate, returnScheduleDate);
    } else if (name === 'approvalProof') {
      if (files && files.length > 0) {
        setFormData({ ...formData, [name]: files[0] });
      } else {
        setFormData({ ...formData, [name]: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const isScheduleValid = (scheduleDate, returnDate) => {
    if (tripType === 'oneWay' && scheduleDate) {
      return true; 
    }
    if (tripType === 'roundTrip' && scheduleDate && returnDate) {
      return true; 
    }
    return false; 
  };
  
  const handleClear = () => {
    setFormData({
      to: '',
      from: '',
      capacity: '',
      departureTime: '',
      pickUpTime: '', 
      reservationReason: '',
      approvalProof: null,
      fileName: ''
    });
    setSelectedDate(null);
    setReturnScheduleDate(null);  
  };

  useEffect(() =>{
    const departmentFromStorage = localStorage.getItem('department');
    setUserDepartment(departmentFromStorage || '');
    setLoading(false);
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleDateSelect = (date) => {
    if (isSelectingReturn) {
      if (date >= selectedDate || !selectedDate) {
        setReturnScheduleDate(date);
        evaluateButtonState(Number(formData.capacity), selectedDate, date);
      } else {
        alert('Return schedule date cannot be before the schedule date.');
      }
    } else {
      setSelectedDate(date);
  
      if (returnScheduleDate && returnScheduleDate < date) {
        setReturnScheduleDate(null);
      }
      evaluateButtonState(Number(formData.capacity), date, returnScheduleDate);
    }
    setShowCalendar(false);
  };
  
  const evaluateButtonState = (capacity, scheduleDate, returnDate) => {
    const maxCapacity = calculateMaxCapacity();
    const isValidSchedule = isScheduleValid(scheduleDate, returnDate);
  
    if (capacity > maxCapacity && isValidSchedule) {
      setIsAddVehicleDisabled(false);
    } else {
      setIsAddVehicleDisabled(true);
    }
  };
  
  const handleTripTypeChange = (event) => {
    const selectedTripType = event.target.value;
    setTripType(selectedTripType);
    setIsSelectingReturn(selectedTripType === 'roundTrip'); 
  };  

  const handleSubmit = (event) => {
    event.preventDefault();
    const capacity = Number(formData.capacity);
    const maxCapacity = calculateMaxCapacity();

    if (capacity > maxCapacity) {
      setCapacityError(`Capacity should not exceed ${maxCapacity} or add vehicle if needed so.`);
      return;
    }
    const {
        from,
        to,
        departureTime,
        reservationReason
    } = formData;

    const isFormValid = [
        from,
        to,
        departureTime,
        reservationReason
    ].every(value => value.trim() !== '') && selectedDate;

    const isTripTypeValid = tripType === 'oneWay' || (tripType === 'roundTrip' && returnScheduleDate && formData.pickUpTime.trim() !== '');
    const isValid = isFormValid && isTripTypeValid;

    if (isValid) {
        setModalMessage('Are you sure you want to submit this reservation?');
        setModalType('confirmation');
        setIsModalOpen(true);
    } else {
        setModalMessage('Please fill out all required fields.');
        setModalType('error');
        setIsModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
        let fileUrl = null;

        if (formData.approvalProof) {
            const fileRef = ref(storage, `reservations/${formData.approvalProof.name}`);
            const snapshot = await uploadBytes(fileRef, formData.approvalProof);

            fileUrl = await getDownloadURL(snapshot.ref);
        }
        const vehicleIds = addedVehicles.map(v => v.id).filter(id => id != null);

        const reservation = {
            typeOfTrip: tripType,
            destinationTo: formData.to,
            destinationFrom: formData.from,
            capacity: formData.capacity, 
            department: userDepartment,
            schedule: selectedDate ? selectedDate.toISOString().split('T')[0] : "0001-01-01",
            returnSchedule: tripType === 'roundTrip' && returnScheduleDate ? returnScheduleDate.toISOString().split('T')[0] : "0001-01-01",
            vehicleType: vehicle.vehicleType || "N/A",
            plateNumber: vehicle.plateNumber || "N/A",
            pickUpTime: tripType === 'roundTrip' ? formatTime(formData.pickUpTime) : "N/A",
            departureTime: formatTime(formData.departureTime),
            reason: formData.reservationReason || "N/A",
            status: "Pending",
            opcIsApproved: false,
            headIsApproved: false,
            feedback: formData.feedback || "No feedback",
            driverId: 0,
            driverName: "N/A",
            rejected: false,
            approvalProofUrl: fileUrl || "N/A"
        };

        const reservationFormData = new FormData();
        reservationFormData.append('reservation', JSON.stringify(reservation));
        reservationFormData.append('userName', `${formatName(firstName)} ${formatName(lastName)}`);
        reservationFormData.append('vehicleIds', vehicleIds.join(','));
        reservationFormData.append('fileUrl', fileUrl);

        const response = await fetch('https://citumovebackend.up.railway.app/user/reservations/add', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: reservationFormData,
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorResponse}`);
        }

        const result = await response.json(); 

        setModalMessage('Reservation submitted successfully!');
        setModalType('success');
        navigate('/user-side');

    } catch (error) {
        console.error('Error submitting reservation:', error);
        setModalMessage('Failed to submit reservation. Please try again.');
        setModalType('error');
    } finally {
        setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="reservation-app">
      <Header />
      <div className="reservation-main-content">
        <SideNavbar />
        <div className="reservation-content">
          <h1><FaFileSignature style={{ marginRight: "15px", marginBottom: "-3px", color: "#782324" }} />Reservation Form</h1>
          <p>Please fill out all necessary fields <button className='back-btn' onClick={handleBackClick}>
            <RiArrowGoBackLine style={{marginRight: "10px", marginBottom: "-3px", color: "gold"}}/>Back to previous page</button></p>
          <div className='reservation-container'>
            {vehicle ? (
              <form className="reservation-form">
              <div className="form-group-inline">
                <div className="trip-type">
                  <label>
                    <input
                      type="radio"
                      name="tripType"
                      value="oneWay"
                      checked={tripType === 'oneWay'}
                      onChange={handleTripTypeChange}
                    />
                    <span>One Way</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tripType"
                      value="roundTrip"
                      checked={tripType === 'roundTrip'}
                      onChange={handleTripTypeChange}
                    />
                    <span>Round Trip</span>
                  </label>
                </div>
                 <div className="form-group">
                <input type="text" id="vehicleType" name="vehicleType" value={vehicle.vehicleType} onChange={handleInputChange} disabled={true}/>
                </div>
                <div className="form-group">
                <input type="text" id="plateNumber" name="plateNumber" value={vehicle.plateNumber} onChange={handleInputChange} disabled={true}/>
                </div>
              </div>
              <br/>
              <div className="form-group-inline">
                <div className="form-group">
                  <label htmlFor="schedule">
                    <FaCalendarDay style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Schedule:
                  </label>
                  <input
                      type="text"
                      id="schedule"
                      name="schedule"
                      value={selectedDate ? selectedDate.toLocaleDateString('en-US') : ''}
                      onClick={() => { setShowCalendar(true); setIsSelectingReturn(false); }}
                      placeholder='Select Schedule'
                      readOnly
                      required
                    />
                </div>
                {tripType === 'roundTrip' && (
                    <div className="form-group">
                      <label htmlFor="returnSchedule">
                        <FaCalendarDay style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Return Schedule:
                      </label>
                      <input
                         type="text"
                         id="returnSchedule"
                         name="returnSchedule"
                         value={returnScheduleDate ? returnScheduleDate.toLocaleDateString('en-US') : ''}
                         onClick={() => { setShowCalendar(true); setIsSelectingReturn(true); }}
                         placeholder='Select Return Schedule'
                         readOnly
                         required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="departureTime">
                      <IoTime
                        style={{
                          backgroundColor: "white",
                          color: "#782324",
                          borderRadius: "20px",
                          padding: "3px",
                          marginBottom: "-5px",
                          marginRight: "3px"
                        }}
                      />
                      Departure Time:
                    </label>
                    <DepartTimeDropdown
                       selectedTime={formData.departureTime}
                       onChange={handleInputChange}
                       name="departureTime"
                       disabled={!selectedDate}
                       date={selectedDate}
                       plateNumber={selectedVehiclePlateNumber} 
                       addedPlateNumbers={addedVehicles.map(vehicle => vehicle.plateNumber)}
                       token={token}
                    />
                  </div>
                  {tripType === "roundTrip" && (
                    <div className="form-group">
                      <label htmlFor="pickUpTime">
                        <IoTime
                          style={{
                            backgroundColor: "white",
                            color: "#782324",
                            borderRadius: "20px",
                            padding: "3px",
                            marginBottom: "-5px",
                            marginRight: "3px"
                          }}
                        />
                        Pick-Up Time:
                      </label>
                      <PickUpDropdown
                        name="pickUpTime"
                        selectedTime={formData.pickUpTime}
                        onChange={handleInputChange}
                        plateNumber={selectedVehiclePlateNumber}
                        addedPlateNumbers={addedVehicles.map(vehicle => vehicle.plateNumber)}
                        token={token}
                        disabled={!returnScheduleDate}
                        date={returnScheduleDate}
                        departureTime={formData.departureTime} 
                      />
                    </div>
                  )} 
              </div>
              <div className="form-group-inline">
                <div className="form-group">
                  <label htmlFor="from"><FaLocationCrosshairs style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> From:</label>
                  <input type="text" id="from" name="from" placeholder='Ex. CIT-University' value={formData.from} required onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="to"><FaLocationDot style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> To:</label>
                  <input type="text" id="to" name="to" placeholder='Ex. SM Seaside' value={formData.to} required onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                <label htmlFor="capacity">
                  <FaUserGroup
                    style={{
                      backgroundColor: "white",
                      color: "#782324",
                      borderRadius: "20px",
                      padding: "3px",
                      marginBottom: "-5px",
                      marginRight: "5px"
                    }}
                  />
                  No. of Passengers:
                </label>
                <input
                  type="number"
                  placeholder="Number of Passengers"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  required
                  min="1" 
                  max="999" 
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d{0,3}$/.test(value) && Number(value) > 0) {
                      handleInputChange(e); 
                    }
                  }}
                />
                {capacityError && (
                  <div className="capacity-error-cloud">
                    <span>{capacityError}</span>
                    <div className="cloud-arrow"></div> 
                  </div>
                )}
              </div>
              </div>
              <div className="form-group-inline">
              <div className="form-group">
                
                    <label htmlFor="department"><FaBuildingUser style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Department:</label>
                    <input type="text" id="department" name="department" value={userDepartment} disabled />
                  </div>
                <div className="form-group">
                  <label htmlFor="approvalProof"><FaFileAlt style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Proof of Approval (optional): <span style={{color: "#782324"}}>Maximum of 5MB PDF file</span></label>
                  <input type="file" id="approvalProof" name="approvalProof" accept="application/pdf" onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group-inline">
              <div className="form-group">
                  <label htmlFor="reservationReason">
                    <CgDetailsMore style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}} /> Purpose of Reservation:
                  </label>
                  <textarea
                    type="text" 
                    id="reservationReason" 
                    name="reservationReason" 
                    className="reservation-reason-textarea" 
                    placeholder="State the purpose of your reservation"
                    value={formData.reservationReason}
                    required 
                    onChange={handleInputChange}
                  />
                </div>
                  <div className="form-group">
                    <label htmlFor="addedVehicle">
                      <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} /> 
                      Vehicle Added:
                      <button 
                        type="button"
                        className="add-another-vehicle" 
                        onClick={handleAddVehicleClick}
                        disabled={isAddVehicleDisabled} 
                        style={{ 
                          opacity: isAddVehicleDisabled ? 0.5 : 1, 
                          cursor: isAddVehicleDisabled ? 'not-allowed' : 'pointer' 
                        }}
                      >
                        <IoMdAddCircle style={{ color: "gold", marginRight: "5px", marginBottom: "-2px" }} /> 
                        Add another vehicle
                      </button>
                    </label>
                    <div className="reserved-vehicle-added-container">
                      {addedVehicles.map(vehicle => (
                        <div key={vehicle.plateNumber} className="reserved-vehicle-item">
                          <p>{vehicle.vehicleType} - {vehicle.plateNumber} - {vehicle.capacity}</p>
                          <button onClick={() => handleRemoveVehicle(vehicle.plateNumber)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </form>
            ) : (
              <p>No Selected Vehicle.</p>
            )}
            <div className="summary-container">
              <h2>Reservation Summary</h2>
              <div className="summary-item">
                <strong>Trip Type:</strong> {tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
              </div>
              <div className="summary-item">
                <strong>From:</strong> {formData.from}
              </div>
              <div className="summary-item">
                <strong>To:</strong> {formData.to}
              </div>
              <div className="summary-item">
              <strong>No. of Passengers: {formData.capacity || 0} /</strong> {calculateMaxCapacity()}
              </div>
              <div className="summary-item">
                <strong>Plate Number:</strong> {vehicle.plateNumber}
              </div>
              <div className="summary-item">
                <strong>Vehicle Type:</strong> {vehicle.vehicleType}
              </div>
              <div className="summary-item">
                {isMultipleVehicles && addedVehicles.length > 0 && (
              <div className="summary-item">
                  <strong>Added Vehicles:</strong>
                    <ul> {addedVehicles.map(vehicle => (
                        <li key={vehicle.plateNumber}>{vehicle.vehicleType} - {vehicle.plateNumber} - {vehicle.capacity}</li>
                      ))}
                    </ul>
                </div>
                )}
                {isMultipleVehicles && addedVehicles.length === 0 && (
                  <div className="summary-item">
                    <strong>Added Vehicles:</strong>
                      <p>No vehicles added yet.</p>
                  </div>
                )}
              </div>
              <div className="summary-item">
              <strong>Schedule: </strong>
              {selectedDate ? selectedDate.toLocaleDateString('en-US') : ''} 
              {tripType === 'roundTrip' && returnScheduleDate ? ` - ${returnScheduleDate.toLocaleDateString('en-US')}` : ''}
              </div>
              <div className="summary-item">
                <strong>Departure Time:</strong> {formatTime(formData.departureTime)}
              </div>
              <div className="summary-item">
                <strong>Pick Up Time:</strong> {formatTime(formData.pickUpTime)}
              </div>
              <div className="summary-item">
                <strong>Department:</strong> {userDepartment}
              </div>
              <div className="summary-item">
                <strong>Proof of Approval:</strong> {formData.fileName || 'Not Attached'}
              </div>
                            <div className="summary-item">
                <strong>Purpose: </strong> 
                <span className="purpose-ellipsis">{formData.reservationReason || "N/A"}</span>
              </div>
              <div className="button-group">
              <button type="button" className="reset-button" onClick={handleClear}>
                    <IoTrash style={{ marginBottom: "-2px", marginRight: "5px" }} /> Clear Entries
                  </button>
                <button type="button" className="submit-button" onClick={handleSubmit}>
                  <RiSendPlaneFill style={{marginBottom: "-3px", marginRight: "10px", color: "gold"}}/>Submit</button>
              </div>
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="logo-image4" />
        </div>
      </div>

      {showCalendar && (
      <div className="calendar-modal">
        <div className="user-calendar-modal-content">
        <Calendar 
            onDateSelect={handleDateSelect} 
            minDate={tripType === 'roundTrip' ? new Date() : null} 
            returnScheduleDate={returnScheduleDate}
            plateNumber={selectedVehiclePlateNumber}
          />
           <br/>
                <button className="close-button" onClick={handleCloseCalendar}>
                  <span style={{fontWeight: "700", fontSize: "16px"}}>Close</span>
                </button>
        </div>
      </div>
      )}

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={handleConfirm} 
        message={modalMessage} 
        type={modalType} 
      />

      <AddVehicleModal 
        isOpen={isAddVehicleModalOpen} 
        onClose={handleCloseModal} 
        onAdd={handleAddVehicle} 
        selectedPlateNumber={vehicle.plateNumber}
        addedVehiclePlates={addedVehiclePlates}
        schedule={selectedDate}       
        returnSchedule={returnScheduleDate}
      />
    </div>
  );
};


export default Reservation;
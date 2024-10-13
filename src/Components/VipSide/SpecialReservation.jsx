import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { CgDetailsMore } from "react-icons/cg";
import { FaBus, FaCalendarDay, FaFileAlt } from "react-icons/fa";
import { FaBuildingUser, FaFileSignature, FaLocationCrosshairs, FaLocationDot, FaUserGroup } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { IoTime, IoTrash } from "react-icons/io5";
import { RiArrowGoBackLine, RiSendPlaneFill } from "react-icons/ri";
import { TbBus } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import '../../CSS/UserCss/Reservation.css';
import logoImage1 from '../../Images/citbglogo.png';
import { storage } from '../Config/FileStorageConfig';
import AddVehicleModal from '../UserSide/AddVehicleModal';
import Calendar from '../UserSide/Calendar';
import DepartTimeDropdown from '../UserSide/DepartTimeDropdown';
import Header from '../UserSide/Header';
import PickUpDropdown from '../UserSide/PickUpDropdown';
import ReservationModal from '../UserSide/ReservationModal';
import VipSideNavbar from './VipSideNavbar';

const VipSpecialReservation = () => {
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

  const handleAddVehicleClick = () => {
    setAddVehicleModalOpen(true);
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

  const [isAddVehicleDisabled, setIsAddVehicleDisabled] = useState(true); 

  const vehiclesList = [
    { type: 'van', capacity: 16 },
    { type: 'coaster', capacity: 28 },
    { type: 'bus', capacity: 60 }
  ];

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
  
  const handleVehicleModeToggle = () => {
    setIsMultipleVehicles(prevState => !prevState); 
    setShowVehicleContainer(prevState => !prevState); 
  };
  
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    if (name === 'capacity') {
      const capacity = Number(value);
      const maxCapacity = calculateMaxCapacity(); 

      setFormData({ ...formData, [name]: value });
      setIsAddVehicleDisabled(capacity <= maxCapacity); 

      if (capacity < maxCapacity) {
        let remainingCapacity = capacity;
        const vehiclesToRemove = [];

        addedVehicles.forEach(vehicle => {
          if (remainingCapacity < vehicle.capacity) {
            vehiclesToRemove.push(vehicle.plateNumber); 
          } else {
            remainingCapacity -= vehicle.capacity; 
          }
        });

        vehiclesToRemove.forEach(plateNumber => handleRemoveVehicle(plateNumber));
      }
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

  const handleClear = () => {
    setFormData({
      to: '',
      from: '',
      capacity: '',
      department: '',
      vehicleType: '', 
      plateNumber: '',
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
      } else {
        alert('Return schedule date cannot be before the schedule date.');
      }
    } else {
      setSelectedDate(date);
      if (returnScheduleDate && returnScheduleDate < date) {
        setReturnScheduleDate(null);
      }
    }
    setShowCalendar(false);
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
      setCapacityError(`Capacity cannot exceed ${maxCapacity}`);
      return;
    }
    const {
        from,
        to,
        vehicleType,
        plateNumber,
        departureTime,
        reservationReason
    } = formData;

    const isFormValid = [
        from,
        to,
        vehicleType,
        plateNumber,
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
    const vehicleIds = addedVehicles.map(v => v.id).filter(id => id != null);
    const reservation = {
        typeOfTrip: tripType,
        destinationTo: formData.to,
        destinationFrom: formData.from,
        capacity: formData.capacity,
        department: userDepartment,
        schedule: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        returnSchedule: tripType === 'roundTrip' && returnScheduleDate ? returnScheduleDate.toISOString().split('T')[0] : null,
        vehicleType: vehicle.vehicleType || null,  
        plateNumber: vehicle.plateNumber || null, 
        pickUpTime: tripType === 'roundTrip' ? formatTime(formData.pickUpTime) : null,
        departureTime: formatTime(formData.departureTime),
        reason: formData.reservationReason || "",
        fileUrl: "No file(s) attached", 
        status: "Pending",
        opcIsApproved: false,
        isRejected: false,
        headIsApproved: true, 
        feedback: "",
        driverId: 0,
        driverName: "",
    };
    console.log("Reservation data: ", reservation);

    try {
      let fileUrl = "No file(s) attached";
      if (formData.approvalProof) {
        const fileRef = ref(storage, `reservations/${formData.approvalProof.name}`);
        await uploadBytes(fileRef, formData.approvalProof);
        fileUrl = await getDownloadURL(fileRef);
      }
      reservation.fileUrl = fileUrl;

      const reservationFormData = new FormData();
      reservationFormData.append('reservation', JSON.stringify(reservation));
      reservationFormData.append('userName', `${formatName(firstName)} ${formatName(lastName)}`);

      if (formData.approvalProof) {
        reservationFormData.append('file', formData.approvalProof);
      }
      reservationFormData.append('vehicleIds', vehicleIds.join(','));

      console.log("Form Data:", [...reservationFormData.entries()]);

      const response = await fetch('http://localhost:8080/user/reservations/add', {
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

      setModalMessage('Reservation submitted successfully!');
      setModalType('success');
      navigate('/vip-side');
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
        <VipSideNavbar />
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
                <div className='mult-vehicle'>
                {/* <button type='button' className='mult-vehicle-btn' onClick={handleVehicleModeToggle}>
                    {isMultipleVehicles ? (
                      <>
                        <TbBus style={{marginRight: "5px", marginBottom: "-2px", color: "gold"}}/> Single vehicle
                      </>
                    ) : (
                      <>
                        <TbBus style={{marginRight: "5px", marginBottom: "-2px", color: "gold"}}/> Multiple vehicles
                      </>
                    )}
                  </button> */}
                </div>
              </div>
              <br/>
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
                        }}
                      />
                      Capacity:
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      required
                      min="0"
                      max={calculateMaxCapacity()}
                      onChange={handleInputChange}
                    />
                    
                    {capacityError && (
                      <div className="capacity-error-cloud">
                        <span>{capacityError}</span>
                        <div className="cloud-arrow"></div> 
                      </div>
                    )}
                  </div>
                <div className="form-group">
                <label htmlFor="vehicleType"><FaBus style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Vehicle:</label>
                <input type="text" id="vehicleType" name="vehicleType" value={vehicle.vehicleType} onChange={handleInputChange} disabled={true}/>
                </div>
                <div className="form-group">
                <label htmlFor="plateNumber"><FaBus style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Plate Number:</label>
                <input type="text" id="plateNumber" name="plateNumber" value={vehicle.plateNumber} onChange={handleInputChange} disabled={true}/>
                </div>
              </div>
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
                          }}
                        />
                        Pick-Up Time:
                      </label>
                      <PickUpDropdown
                      name="pickUpTime"
                      selectedTime={formData.pickUpTime}
                      onChange={handleInputChange}
                      disabled={!returnScheduleDate}
                      date={returnScheduleDate}
                      plateNumber={selectedVehiclePlateNumber}
                      addedPlateNumbers={addedVehicles.map(vehicle => vehicle.plateNumber)}
                      token={token}

                    />
                    </div>
                  )} 
              </div>
              <div className="form-group-inline">
              <div className="form-group">
                    <label htmlFor="department"><FaBuildingUser style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Department:</label>
                    <input type="text" id="department" name="department" value={userDepartment} disabled />
                  </div>
                <div className="form-group">
                  <label htmlFor="approvalProof"><FaFileAlt style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Proof of Approval (optional):</label>
                  <input type="file" id="approvalProof" name="approvalProof" onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group-inline">
              <div className="form-group">
                  <label htmlFor="reservationReason">
                    <CgDetailsMore style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}} /> Reason of Reservation:
                  </label>
                  <textarea
                    type="text" 
                    id="reservationReason" 
                    name="reservationReason" 
                    className="reservation-reason-textarea" 
                    placeholder="State the reason of your reservation"
                    value={formData.reservationReason}
                    required 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                    <label htmlFor="addedVehicle">
                      <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} /> 
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
                <strong>Reservation Type:</strong> 
              </div>
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
              <strong>Capacity: {formData.capacity || 0} /</strong> {calculateMaxCapacity()}
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
                <strong>Reason:</strong> {formData.reservationReason}
              </div>
              <div className="button-group">
              <button type="button" className="reset-button" onClick={handleClear}>
                    <IoTrash style={{ marginBottom: "-2px", marginRight: "5px" }} /> Clear Entities
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
        <div className="calendar-modal-content">
        <Calendar 
            onDateSelect={handleDateSelect} 
            minDate={tripType === 'roundTrip' ? new Date() : null} 
            returnScheduleDate={returnScheduleDate}
            plateNumber={selectedVehiclePlateNumber}
          />
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

export default VipSpecialReservation;
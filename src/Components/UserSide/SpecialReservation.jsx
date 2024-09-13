// import React, { useState, useEffect } from 'react';
// import Header from './Header'; 
// import logoImage1 from '../../Images/citbglogo.png';
// import SideNavbar from './SideNavbar';
// import Skeleton from 'react-loading-skeleton';
// import { useNavigate } from 'react-router-dom';
// import { FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";
// import { FaFileSignature, FaUserGroup, FaBuildingUser } from "react-icons/fa6";
// import { FaCalendarDay, FaBus, FaFileAlt } from "react-icons/fa";
// import { IoTime } from "react-icons/io5";
// import { RiSendPlaneFill, RiArrowGoBackLine } from "react-icons/ri";
// import { IoTrash } from "react-icons/io5";
// import { TbBus } from "react-icons/tb";
// import { IoMdAddCircle } from "react-icons/io";
// import { CgDetailsMore } from "react-icons/cg";
// import { useLocation } from 'react-router-dom';
// import Calendar from './Calendar'; 
// import '../../CSS/UserCss/Reservation.css';
// import ReservationModal from './ReservationModal'; 
// import AddVehicleModal from './AddVehicleModal';
// import TimeDropdown from './TimeDropdown';

// const SpecialReservation = () => {
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [tripType, setTripType] = useState('oneWay');
//   const [isMultipleVehicles, setIsMultipleVehicles] = useState(false);
//   const [showVehicleContainer, setShowVehicleContainer] = useState(false);
//   const [isAddVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
//   const [returnScheduleDate, setReturnScheduleDate] = useState(null);
//   const [isSelectingReturn, setIsSelectingReturn] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [modalType, setModalType] = useState('error');
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { vehicle } = location.state || {}; 
//   const token = localStorage.getItem('token');
//   const email = localStorage.getItem('email');
//   const localPart = email.split('@')[0];
//   const [firstName, lastName] = localPart.split('.');
//   const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
//   const [reservedDates, setReservedDates] = useState([]);


//   const fetchReservedDates = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/reservations/reserved-dates", {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       setReservedDates(data);
//     } catch (error) {
//       console.error("Failed to fetch reserved dates.", error);
//     }
//   };
  
//   useEffect(() => {
//     fetchReservedDates();
//   }, [token]);


//   const convertTo12HourFormat = (time24) => {
//     const [hours, minutes] = time24.split(':');
//     const period = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = (hours % 12) || 12;
//     return `${formattedHours}:${minutes} ${period}`;
//   };

//   const generateTimeOptions = (reservedTimes) => {
//     const timeOptions = [];
//     for (let hours = 0; hours < 24; hours++) {
//         for (let minutes = 0; minutes < 60; minutes += 30) {
//             const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
//             timeOptions.push(time); // Always add the time option
//         }
//     }
//     return timeOptions;
// };

//   const timeOptions = generateTimeOptions(reservedDates);

//   const isTimeReserved = (date, time) => {
//     if (!date || !time) return false; 
//     const formattedTime = convertTo12HourFormat(time);
//     return reservedDates.some(reservation =>
//         reservation.schedule === date &&
//         reservation.departureTime === formattedTime
//     );
// };

//   const isTimeReservedForCurrentDate = () => {
//     const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
//     console.log("Formatted Date:", formattedDate);
//     console.log("Departure Time:", formData.departureTime);
//     return formattedDate && formData.departureTime && isTimeReserved(
//       formattedDate,
//       formData.departureTime
//     );
//   };
  

//   const departureTimeStyle = () => {
//     if (selectedDate && formData.departureTime) {
//       const formattedDate = selectedDate.toISOString().split('T')[0];
//       const isReserved = isTimeReserved(formattedDate, formData.departureTime);
//       return {
//         borderColor: isReserved ? 'red' : '', 
//         borderWidth: isReserved ? '2px' : '', 
//         color: isReserved ? 'red' : ''
//       };
//     }
//     return {};
//   };

//   const formatTime = (time) => {
//     if (!time) return '';
    
//     const [hours, minutes] = time.split(':');
//     const formattedHours = (hours % 12) || 12;
//     const amPm = hours >= 12 ? 'PM' : 'AM';
    
//     return `${formattedHours}:${minutes} ${amPm}`;
//   };

//   // const convertTo12HourFormat = (time24) => {
//   //   const [hours, minutes] = time24.split(':');
//   //   const period = hours >= 12 ? 'PM' : 'AM';
//   //   const formattedHours = (hours % 12) || 12;
//   //   return `${formattedHours}:${minutes} ${period}`;
//   // };


//   const [formData, setFormData] = useState({
//     to: '',
//     from: '',
//     capacity: '',
//     department: '',
//     vehicleType: '',
//     departureTime: '',
//     plateNumber: '',
//     pickUpTime: '', 
//     reservationReason: '',
//     approvalProof: null,
//     fileName: ''
//   });

//   const handleAddVehicleClick = () => {
//     setAddVehicleModalOpen(true);
//   };
  
//   const handleCloseModal = () => {
//     setAddVehicleModalOpen(false);
//   };
  
//   const handleAddVehicle = () => {
//     handleCloseModal(); 
//   };

//   const handleVehicleModeToggle = () => {
//     setIsMultipleVehicles(prevState => !prevState); 
//     setShowVehicleContainer(prevState => !prevState); 
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'file' ? files[0] : value,
//       fileName: type === 'file' ? files[0].name : formData.fileName,
//     });
//   };

//   const handleClear = () => {
//     setFormData({
//       to: '',
//       from: '',
//       capacity: '',
//       department: '',
//       vehicleType: '', 
//       plateNumber: '',
//       departureTime: '',
//       pickUpTime: '', 
//       reservationReason: '',
//       approvalProof: null,
//       fileName: ''
//     });
//     setSelectedDate(null); 
//   };

//   const fetchDepartments = async () => {
//     try {
//         const response = await fetch("http://localhost:8080/department/getAll", {
//             headers: {"Authorization" : `Bearer ${token}`}
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setDepartments(data);
//     } catch (error) {
//         console.error("Failed to fetch departments.", error);
//     } finally {
//         setLoading(false);
//     }
// };

//   useEffect(() =>{
//     fetchDepartments();
//   }, [token])

//   const handleBackClick = () => {
//     window.history.back();
//   };

//   useEffect(() => {
//     if (vehicle) {
//       setFormData((prevData) => ({
//         ...prevData,
//         plateNumber: vehicle.plateNumber || '' // Assuming vehicle has plateNumber
//       }));
//     }
//   }, [vehicle]);
  

//   const handleDateSelect = (date) => {
//     if (isSelectingReturn) {
//       setReturnScheduleDate(date);
//     } else {
//       setSelectedDate(date);
//     }
//     setShowCalendar(false);
//   };

//   const handleTripTypeChange = (event) => {
//     const selectedTripType = event.target.value;
//     setTripType(selectedTripType);
//     setShowReturnSchedule(selectedTripType === 'roundTrip'); 
//   };

//   const handleSubmit = () => {
//     const {
//       from,
//       to,
//       capacity,
//       vehicleType,
//       plateNumber,
//       departureTime,
//       department,
//       reservationReason
//     } = formData;

//     const isFormValid = [
//       from,
//       to,
//       capacity,
//       vehicleType,
//       plateNumber,
//       departureTime,
//       department,
//       reservationReason
//     ].every(value => value.trim() !== '') && selectedDate;

//     const isTripTypeValid = tripType === 'oneWay' || (tripType === 'roundTrip' && formData.pickUpTime.trim() !== '');
//     const isValid = isFormValid && isTripTypeValid;

//     if (isValid) {
//       setModalMessage('Are you sure you want to submit this reservation?');
//       setModalType('confirmation');
//       setIsModalOpen(true);
//     } else {
//       setModalMessage('Please fill out all required fields.');
//       setModalType('error');
//       setIsModalOpen(true);
//     }
//   };

//   const handleConfirm = async () => {
//     const reservation = {
//         typeOfTrip: tripType,
//         destinationTo: formData.to,
//         destinationFrom: formData.from,
//         capacity: parseInt(formData.capacity, 10),
//         department: formData.department,
//         schedule: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
//         returnSchedule: tripType === 'roundTrip' ? returnScheduleDate.toISOString().split('T')[0] : null,
//         vehicleType: formData.vehicleType,
//         pickUpTime: tripType === 'roundTrip' ? formatTime(formData.pickUpTime) : "N/A",
//         departureTime: formatTime(formData.departureTime),
//         reason: formData.reservationReason,
//         status: "Pending",
//         opcIsApproved: false,
//         isRejected: false,
//         headIsApproved: false,
//         feedback: "",
//         driverId: 0,
//         driverName: "",
//     };

//     const reservationFormData = new FormData();
//     reservationFormData.append('reservation', JSON.stringify(reservation));
//     reservationFormData.append('userName', `${formatName(firstName)} ${formatName(lastName)}`);

//     if (formData.approvalProof) {
//       reservationFormData.append('file', formData.approvalProof);
//     }

//     try {
//       const response = await fetch('http://localhost:8080/user/reservations/add', {
//         method: 'POST',
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: reservationFormData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setModalMessage('Reservation submitted successfully!');
//       setModalType('success');
      
//       navigate('/user-side');
//     } catch (error) {
//       console.error('Error submitting reservation:', error);
//       setModalMessage('Failed to submit reservation. Please try again.');
//       setModalType('error');
//     } finally {
//       setIsModalOpen(true);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="reservation-app">
//       <Header />
//       <div className="reservation-main-content">
//         <SideNavbar />
//         <div className="reservation-content">
//           <h1><FaFileSignature style={{ marginRight: "15px", marginBottom: "-3px", color: "#782324" }} />Reservation Form</h1>
//           <p>Please fill out all necessary fields <button className='back-btn' onClick={handleBackClick}>
//             <RiArrowGoBackLine style={{marginRight: "10px", marginBottom: "-3px", color: "gold"}}/>Back to previous page</button></p>
//           <div className='reservation-container'>
//             {vehicle ? (
//               <form className="reservation-form">
//               <div className="form-group-inline">
//                 <div className="trip-type">
//                   <label>
//                     <input
//                       type="radio"
//                       name="tripType"
//                       value="oneWay"
//                       checked={tripType === 'oneWay'}
//                       onChange={handleTripTypeChange}
//                     />
//                     <span>One Way</span>
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="tripType"
//                       value="roundTrip"
//                       checked={tripType === 'roundTrip'}
//                       onChange={handleTripTypeChange}
//                     />
//                     <span>Round Trip</span>
//                   </label>
//                 </div>
//                 <div className='mult-vehicle'>
//                 <button type='button' className='mult-vehicle-btn' onClick={handleVehicleModeToggle}>
//                     {isMultipleVehicles ? (
//                       <>
//                         <TbBus style={{marginRight: "5px", marginBottom: "-2px", color: "gold"}}/> Single vehicle
//                       </>
//                     ) : (
//                       <>
//                         <TbBus style={{marginRight: "5px", marginBottom: "-2px", color: "gold"}}/> Multiple vehicles
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <br/>
//               <div className="form-group-inline">
//                 <div className="form-group">
//                   <label htmlFor="from"><FaLocationCrosshairs style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> From:</label>
//                   <input type="text" id="from" name="from" placeholder='Ex. CIT-University' value={formData.from} required onChange={handleInputChange}/>
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="to"><FaLocationDot style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> To:</label>
//                   <input type="text" id="to" name="to" placeholder='Ex. SM Seaside' value={formData.to} required onChange={handleInputChange}/>
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="capacity"><FaUserGroup style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Capacity:</label>
//                   <input type="number" id="capacity" name="capacity" value={formData.capacity} required onChange={handleInputChange}/>
//                 </div>
//                 <div className="form-group">
//                 <label htmlFor="vehicleType"><FaBus style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Type of Vehicle:</label>
//                 <select>
//                     <p>Car ra gud</p>
//                 </select>
                
//                 </div>
//               </div>
//               <div className="form-group-inline">
//                 <div className="form-group">
//                   <label htmlFor="schedule"><FaCalendarDay style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Schedule:</label>
//                   <input
//                       type="text"
//                       id="schedule"
//                       name="schedule"
//                       value={selectedDate ? selectedDate.toLocaleDateString('en-US') : ''}
//                       onClick={() => { setShowCalendar(true); setIsSelectingReturn(false); }}
//                       readOnly
//                       required
//                     />
//                 </div>
//                 {tripType === 'roundTrip' && (
//                     <div className="form-group">
//                       <label htmlFor="returnSchedule">
//                         <FaCalendarDay style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Return Schedule:
//                       </label>
//                       <input
//                          type="text"
//                          id="returnSchedule"
//                          name="returnSchedule"
//                          value={returnScheduleDate ? returnScheduleDate.toLocaleDateString('en-US') : ''}
//                          onClick={() => { setShowCalendar(true); setIsSelectingReturn(true); }}
//                          readOnly
//                          required
//                       />
//                     </div>
//                   )}
//                 <div className="form-group">
//                   <label htmlFor="departureTime">
//                     <IoTime style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} />
//                     Departure Time:
//                   </label>
//                   <TimeDropdown
//                     times={timeOptions}
//                     selectedTime={formData.departureTime}
//                     onChange={handleInputChange}
//                     isReserved={(time) => selectedDate ? isTimeReserved(selectedDate.toISOString().split('T')[0], time) : false} 
//                   />

//                 </div>
//                 {tripType === 'roundTrip' && (
//                     <div className="form-group">
//                       <label htmlFor="pickUpTime"><IoTime style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Pick-Up Time:</label>
//                       <input type="time" id="pickUpTime" name="pickUpTime" value={formData.pickUpTime} onChange={handleInputChange} />
//                     </div>
//                   )}
//               </div>
//               <div className="form-group-inline">
//               <div className="form-group">
//                   <label htmlFor="reservationReason">
//                     <CgDetailsMore style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}} /> Reason of Reservation:
//                   </label>
//                   <textarea
//                     type="text" 
//                     id="reservationReason" 
//                     name="reservationReason" 
//                     className="reservation-reason-textarea" 
//                     placeholder="State the reason of your reservation"
//                     value={formData.reservationReason}
//                     required 
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 {isMultipleVehicles && (
//                 <div className="form-group">
//                   <label htmlFor="addedVehicle">
//                     <FaBus style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Vehicle Added: 
//                     <button className='add-another-vehicle'  onClick={handleAddVehicleClick}><IoMdAddCircle style={{color: "gold", marginRight: "5px", marginBottom: "-2px"}}/>
//                     Add another vehicle</button></label> 
//                  <div className='vehicle-added-container'>

//                  </div>
//                 </div>
//                  )}
//                 </div>
//             </form>
//             ) : (
//               <p>No Selected Vehicle.</p>
//             )}
//             <div className="summary-container">
//               <h2>Reservation Summary</h2>
//               <div className="summary-item">
//                 <strong>Reservation Type:</strong> 
//               </div>
//               <div className="summary-item">
//                 <strong>Trip Type:</strong> {tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
//               </div>
//               <div className="summary-item">
//                 <strong>From:</strong> {formData.from}
//               </div>
//               <div className="summary-item">
//                 <strong>To:</strong> {formData.to}
//               </div>
//               <div className="summary-item">
//                 <strong>Capacity:</strong> {formData.capacity}
//               </div>
//               <div className="summary-item">
//                 <strong>Plate Number:</strong> {vehicle.plateNumber}
//               </div>
//               <div className="summary-item">
//                 <strong>Vehicle Type:</strong> {vehicle.vehicleType}
//               </div>
//               <div className="summary-item">
//               <strong>Schedule: </strong>
//               {selectedDate ? selectedDate.toLocaleDateString('en-US') : ''} 
//               {tripType === 'roundTrip' && returnScheduleDate ? ` - ${returnScheduleDate.toLocaleDateString('en-US')}` : ''}
//               </div>
//               <div className="summary-item">
//                 <strong>Departure Time:</strong> {formatTime(formData.departureTime)}
//               </div>
//               <div className="summary-item">
//                 <strong>Pick Up Time:</strong> {formatTime(formData.pickUpTime)}
//               </div>
//               <div className="summary-item">
//                 <strong>Department:</strong> {formData.department}
//               </div>
//               <div className="summary-item">
//                 <strong>Proof of Approval:</strong> {formData.fileName || 'Not Attached'}
//               </div>
//               <div className="summary-item">
//                 <strong>Reason:</strong> {formData.reservationReason}
//               </div>
//               <div className="button-group">
//               <button type="button" className="reset-button" onClick={handleClear}>
//                     <IoTrash style={{ marginBottom: "-2px", marginRight: "5px" }} /> Clear Entities
//                   </button>
//                 <button type="button" className="submit-button" onClick={handleSubmit}>
//                   <RiSendPlaneFill style={{marginBottom: "-3px", marginRight: "10px", color: "gold"}}/>Submit</button>
//               </div>
//             </div>
//           </div>
//           <img src={logoImage1} alt="Logo" className="logo-image4" />
//         </div>
//       </div>

//           {showCalendar && (
//       <div className="calendar-modal">
//         <div className="calendar-modal-content">
//           <Calendar 
//             onDateSelect={handleDateSelect} 
//             minDate={tripType === 'roundTrip' && isSelectingReturn ? selectedDate : null}
//             returnScheduleDate={returnScheduleDate}
//           />
//         </div>
//       </div>
//     )}

//       <ReservationModal 
//         isOpen={isModalOpen} 
//         onClose={closeModal} 
//         onConfirm={handleConfirm} 
//         message={modalMessage} 
//         type={modalType} 
//     />

//     <AddVehicleModal 
//           isOpen={isAddVehicleModalOpen}
//           onClose={handleCloseModal}
//           onAdd={handleAddVehicle}
//         />
//     </div>
//   );
// };

// export default SpecialReservation;
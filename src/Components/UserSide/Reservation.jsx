import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import logoImage1 from '../../Images/citbglogo.png';
import SideNavbar from './SideNavbar';
import Skeleton from 'react-loading-skeleton';
import { FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";
import { FaFileSignature, FaUserGroup, FaBuildingUser } from "react-icons/fa6";
import { FaCalendarDay, FaBus, FaFileAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { RiSendPlaneFill, RiArrowGoBackLine } from "react-icons/ri";
import { IoTrash } from "react-icons/io5";
import { CgDetailsMore } from "react-icons/cg";
import Calendar from './Calendar'; 
import '../../CSS/UserCss/Reservation.css';
import ReservationModal from './ReservationModal'; // Import Modal component

const Reservation = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tripType, setTripType] = useState('oneWay');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    capacity: '',
    vehicleType: '',
    departureTime: '',
    pickUpTime: '',
    department: '',
    reservationReason: '',
    approvalProof: '', // Ensure this is included in state
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error'); // 'error' or 'confirmation'

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleClear = () => {
    setFormData({
      from: '',
      to: '',
      capacity: '',
      vehicleType: '',
      departureTime: '',
      pickUpTime: '',
      department: '',
      reservationReason: '',
      approvalProof: '', 
    });
    setSelectedDate(null); 
  };
  

  useEffect(() => {
    fetch('http://localhost:8080/department/departments')
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
        setLoading(false);
      });
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleTripTypeChange = (event) => {
    setTripType(event.target.value);
  };

  const handleSubmit = () => {
    // Check required fields only
    if (Object.values(formData).slice(0, 8).every(value => value.trim() !== '') && selectedDate) {
      setModalMessage('Are you sure you want to submit this reservation?');
      setModalType('confirmation');
      setIsModalOpen(true);
    } else {
      setModalMessage('Please fill out all required fields.');
      setModalType('error');
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    // Logic to handle form submission
    console.log('Form submitted:', formData);
    alert('Reservation submitted successfully!');
    setIsModalOpen(false);
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
          <p>Please fill out all necessary fields <button className='back-btn' onClick={handleBackClick}><RiArrowGoBackLine style={{marginRight: "10px", marginBottom: "-3px"}}/>Back to previous page</button></p>
          <div className='reservation-container'>
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
                  <label htmlFor="capacity"><FaUserGroup style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Capacity:</label>
                  <input type="number" id="capacity" name="capacity" value={formData.capacity} required onChange={handleInputChange}/>
                </div>
              </div>
              <div className="form-group-inline">
                <div className="form-group">
                <label htmlFor="vehicleType"><FaBus style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Type of Vehicle:</label>
                <input type="text" id="vehicleType" name="vehicleType" value={formData.vehicleType} required onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="schedule"><FaCalendarDay style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Schedule:</label>
                  <input
                    type="text"
                    id="schedule"
                    name="schedule"
                    value={selectedDate ? selectedDate.toLocaleDateString('en-US') : ''}
                    onClick={() => setShowCalendar(true)}
                    readOnly
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departureTime"><IoTime style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Departure Time:</label>
                  <input type="text" id="departureTime" name="departureTime" value={formData.departureTime} required onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="pickUpTime"><MdAccessTime style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Pick Up Time:</label>
                  <input type="text" id="pickUpTime" name="pickUpTime" value={formData.pickUpTime} required onChange={handleInputChange}/>
                </div>
              </div>
              <div className="form-group-inline">
                <div className="form-group">
                <label htmlFor="department"><FaBuildingUser style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Department:</label>
                  {loading ? (
                    <Skeleton height={40} width={300} />
                  ) : (
                    <select id="department" name="department" required className="dropdown-field" value={formData.department} onChange={handleInputChange}>
                      <option value="">Select Department</option>
                      {departments.map(department => (
                        <option key={department.id} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="approvalProof"><FaFileAlt style={{backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px"}}/> Proof of Approval (optional):</label>
                  <input type="file" id="approvalProof" name="approvalProof" onChange={handleInputChange} />
                </div>
              </div>
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
            </form>
            <div className="summary-container">
              <h2>Reservation Summary</h2>
              <div className="summary-item">
                <strong>From:</strong> {formData.from}
              </div>
              <div className="summary-item">
                <strong>To:</strong> {formData.to}
              </div>
              <div className="summary-item">
                <strong>Capacity:</strong> {formData.capacity}
              </div>
              <div className="summary-item">
                <strong>Vehicle Type:</strong> {formData.vehicleType}
              </div>
              <div className="summary-item">
                <strong>Schedule:</strong> {selectedDate ? selectedDate.toLocaleDateString('en-US') : ''}
              </div>
              <div className="summary-item">
                <strong>Departure Time:</strong> {formData.departureTime}
              </div>
              <div className="summary-item">
                <strong>Pick Up Time:</strong> {formData.pickUpTime}
              </div>
              <div className="summary-item">
                <strong>Department:</strong> {formData.department}
              </div>
              <div className="summary-item">
                <strong>Proof of Approval:</strong> {formData.approvalProof ? 'Attached' : 'Not Attached'}
              </div>
              <div className="summary-item">
                <strong>Reason:</strong> {formData.reservationReason}
              </div>
              <div className="button-group">
              <button type="button" className="reset-button" onClick={handleClear}>
                    <IoTrash style={{ marginBottom: "-2px", marginRight: "5px" }} /> Clear Entities
                  </button>
                <button type="button" className="submit-button" onClick={handleSubmit}><RiSendPlaneFill style={{marginBottom: "-3px", marginRight: "10px"}}/>Submit</button>
              </div>
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="logo-image4" />
        </div>
      </div>

      {showCalendar && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <Calendar onDateSelect={handleDateSelect} />
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
    </div>
  );
};

export default Reservation;

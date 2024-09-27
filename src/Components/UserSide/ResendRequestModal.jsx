import React, { useEffect, useState } from 'react';
import { CgDetailsMore } from "react-icons/cg";
import { FaBus, FaCalendarDay, FaFileAlt } from "react-icons/fa";
import { FaBuildingUser, FaLocationCrosshairs, FaLocationDot, FaUserGroup } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { IoTime } from "react-icons/io5";
import Calendar from './Calendar';
import DepartTimeDropdown from './DepartTimeDropdown';
import PickUpDropdown from './PickUpDropdown';

const RequestModal = ({ request, showModal, onClose, onResend }) => {
    const [formData, setFormData] = useState({ 
        typeOfTrip: '', 
        destinationFrom: '', 
        destinationTo: '', 
        capacity: '', 
        vehicleType: '', 
        plateNumber: '', 
        schedule: '', 
        returnSchedule: '', 
        departureTime: request?.departureTime || '', 
        pickUpTime: '', 
        department: '', 
        reason: '', 
        approvalProof: null, // Add if you expect to handle file uploads
        ...request // Ensure request has the expected structure
    });
    const [showCalendar, setShowCalendar] = useState(false);
    const [isSelectingReturn, setIsSelectingReturn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [returnScheduleDate, setReturnScheduleDate] = useState(null);
    const { vehicle } = location.state || {};
    const [selectedVehiclePlateNumber, setSelectedVehiclePlateNumber] = useState('');
    const [addedVehicles, setAddedVehicles] = useState([]);
    const token = localStorage.getItem('token');
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (request && request.plateNumber) {
            setSelectedVehiclePlateNumber(request.plateNumber);
            setFormData((prevData) => ({
                ...prevData,
                plateNumber: request.plateNumber 
            }));
        }
        if (request) {
            setFormData((prevData) => ({
                ...prevData,
                ...request 
            }));
        }
    }, [request, vehicle]);

    const handleDateSelect = (date) => {
        if (isSelectingReturn) {
            if (date >= selectedDate || !selectedDate) {
                setReturnScheduleDate(date);
                setFormData((prevData) => ({
                    ...prevData,
                    returnSchedule: date.toLocaleDateString('en-US'),
                }));
            } else {
                alert('Return schedule date cannot be before the schedule date.');
            }
        } else {
            setSelectedDate(date);
            setFormData((prevData) => ({
                ...prevData,
                schedule: date.toLocaleDateString('en-US'),
            }));
            if (returnScheduleDate && returnScheduleDate < date) {
                setReturnScheduleDate(null);
            }
        }
        setShowCalendar(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        onResend(formData);
    };

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '1000px', maxWidth: '100%', padding: '60px', textAlign: 'left', backgroundColor: '#CBC3C3' }}>
                <h3 style={{ backgroundColor: '#782324', color: 'white', padding: '10px', borderRadius: '10px' }}>
                    Transaction ID: <span style={{ color: '#ffcc00' }}>{request.transactionId}</span>
                </h3>

                <form className="reservation-form" onSubmit={handleSubmit}>
                    <div className="form-group-inline">
                        <div className="trip-type">
                            <label>
                                <input
                                    type="radio"
                                    name="typeOfTrip"
                                    value="oneWay"
                                    checked={formData.typeOfTrip === 'oneWay'}
                                    onChange={handleInputChange}
                                />
                                <span>One Way</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeOfTrip"
                                    value="roundTrip"
                                    checked={formData.typeOfTrip === 'roundTrip'}
                                    onChange={handleInputChange}
                                />
                                <span>Round Trip</span>
                            </label>
                        </div>
                    </div>
                    <br />
                    <div className="form-group-inline">
                        <div className="form-group">
                            <label htmlFor="from">
                                <FaLocationCrosshairs style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                From:
                            </label>
                            <input type="text" id="from" name="from" placeholder='Ex. CIT-University' value={formData.destinationFrom} required onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="to">
                                <FaLocationDot style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                To:
                            </label>
                            <input type="text" id="to" name="to" placeholder='Ex. SM Seaside' value={formData.destinationTo} required onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="capacity">
                                <FaUserGroup style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Capacity:
                            </label>
                            <input type="number" id="capacity" name="capacity" value={formData.capacity} required min="0" onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vehicleType">
                                <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px" }} />
                                Vehicle:
                            </label>
                            <input type="text" id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="plateNumber">
                                <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Plate Number:
                            </label>
                            <input type="text" id="plateNumber" name="plateNumber" value={formData.plateNumber} disabled onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group">
                            <label htmlFor="schedule">
                                <FaCalendarDay style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Schedule:
                            </label>
                            <input 
                             type="text"
                             id="schedule"
                             name="schedule"
                             value={formData.schedule || (selectedDate ? selectedDate.toLocaleDateString('en-US') : '')}
                             onClick={() => { setShowCalendar(true); setIsSelectingReturn(false); }}
                             readOnly
                             required
                    
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="returnSchedule">
                                <FaCalendarDay style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Return Schedule:
                            </label>
                            <input 
                              type="text"
                              id="returnSchedule"
                              name="returnSchedule"
                              value={formData.returnSchedule || 'N/A' || (selectedDate ? selectedDate.toLocaleDateString('en-US') : '')}
                              onClick={() => { setShowCalendar(true); setIsSelectingReturn(true); }}
                              readOnly
                              required
                            disabled={formData.typeOfTrip === 'oneWay'}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="departureTime">
                                <IoTime style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Departure Time:
                            </label>
                            <DepartTimeDropdown
                                id="departureTime" 
                                name="departureTime" 
                                selectedTime={formData.departureTime}
                                onChange={handleInputChange}
                                disabled={!selectedDate}
                                date={selectedDate}
                                plateNumber={selectedVehiclePlateNumber} 
                                addedPlateNumbers={addedVehicles.map(vehicle => vehicle.plateNumber)}
                                token={token}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pickUpTime">
                                <IoTime style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Pick-Up Time:
                            </label>
                            <PickUpDropdown 
                                id="pickUpTime" 
                                name="pickUpTime"
                                value={formData.pickUpTime}
                                onChange={handleInputChange}
                                disabled={formData.typeOfTrip === 'oneWay'}
                                date={returnScheduleDate}
                                plateNumber={selectedVehiclePlateNumber} 
                                addedPlateNumbers={addedVehicles.map(vehicle => vehicle.plateNumber)}
                                token={token} 
                                />
                        </div>
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group">
                            <label htmlFor="department">
                                <FaBuildingUser style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Department:
                            </label>
                            <input type="text" id="department" name="department" value={formData.department} disabled required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="approvalProof">
                                <FaFileAlt style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Proof of Approval (optional):
                            </label>
                            <input type="file" id="approvalProof" name="approvalProof" accept="application/pdf" onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group">
                            <label htmlFor="reservationReason">
                                <CgDetailsMore style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Reason of Reservation:
                            </label>
                            <textarea
                                id="reservationReason"
                                name="reservationReason"
                                className="reservation-reason-textarea"
                                placeholder="State the reason for your reservation"
                                value={formData.reason}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="addedVehicle">
                                <FaBus style={{ backgroundColor: "white", color: "#782324", borderRadius: "20px", padding: "3px", marginBottom: "-5px", marginRight: "5px" }} />
                                Vehicle Added:
                                <button type="button" className="add-another-vehicle" >
                                    <IoMdAddCircle style={{ color: "gold", marginRight: "5px", marginBottom: "-2px" }} />
                                    Add another vehicle
                                </button>
                            </label>
                            <div className="reserved-vehicle-added-container">
                                <div style={{backgroundColor: "#CBC3C3", margin: "10px", padding: "10px"}}>
                            {request.reservedVehicles.length > 0 ? (
                            request.reservedVehicles.map((vehicle, index) => (
                              <div key={index}>
                                {vehicle.vehicleType} - {vehicle.plateNumber} 
                              </div>
                            ))
                          ) : (
                            <div>No Vehicles Added</div>
                          )}
                          </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group">
                            <button type="button" onClick={onClose} className='rsnd-cancel-button'>Cancel</button>
                        </div>
                        <div className="form-group">
                            <button type="submit" className='rsnd-button'>Resend Request</button>
                        </div>
                    </div>
                </form>
            </div>
            {showCalendar && (
      <div className="calendar-modal">
        <div className="calendar-modal-content">
          <Calendar 
            onDateSelect={handleDateSelect} 
            returnScheduleDate={returnScheduleDate}
            plateNumber={selectedVehiclePlateNumber}
          />
        </div>
      </div>
      )}

        </div>
    );
};

export default RequestModal;
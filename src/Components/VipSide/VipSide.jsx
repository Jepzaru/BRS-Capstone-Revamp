import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Header from '../UserSide/Header';
import VipSideNavbar from './VipSideNavbar';
import Skeleton from 'react-loading-skeleton';
import Calendar from '../UserSide/Calendar';
import ReserveCalendar from '../UserSide/ReserveCalendar';
import 'react-loading-skeleton/dist/skeleton.css';
import logoImage1 from '../../Images/citbglogo.png';
import vehicleImage from '../../Images/Vehicle1.jpg'; 
import vehicleImage2 from '../../Images/Vehicle2.jpg';
import vehiclesubImage1 from "../../Images/busimage.jpg";
import vehiclesubImage2 from "../../Images/busimage2.jpg";
import vehiclesubImage3 from "../../Images/busimage3.jpg";
import vehiclesubImage4 from "../../Images/coasterimage.jpg";
import vehiclesubImage5 from "../../Images/coasterimage2.jpg";
import vehiclesubImage6 from "../../Images/coasterimage3.jpg";
import defaultVehicleImage from "../../Images/defualtVehicle.png";
import { FaBook, FaBus, FaCalendarAlt } from "react-icons/fa";
import '../../CSS/UserCss/UserSide.css';
import { useNavigate } from 'react-router-dom';

const VipSide = () => {
  const [vehicles, setVehicles] = useState([]);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false); 
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  const fetchVehicleDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("https://citumovebackend.up.railway.app/vehicle/getAll", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        console.error("Expected an array from API but got:", data);
        setVehicles([]);
      }
    } catch (error) {
      console.error("Failed to fetch vehicle details", error);
    } finally {
      setLoading(false); 
    }
  }, [token]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("https://citumovebackend.up.railway.app/opc/events/getAll", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error("Expected an array from API but got:", data);
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  }, [token]);

  useEffect(() => {
    fetchVehicleDetails();
    fetchEvents();
  }, [fetchVehicleDetails, fetchEvents]);

  const futureEvents = useMemo(() => 
    events.filter(event => new Date(event.eventDate) > new Date()), 
    [events]
  );

  const getVehicleImage = useCallback((vehicleType) => {
    const lowerCaseType = vehicleType.toLowerCase();
    if (/bus/.test(lowerCaseType)) {
      return vehicleImage;
    }
    if (/coaster/.test(lowerCaseType)) {
      return vehicleImage2;
    }
    return defaultVehicleImage; 
  }, []);
  

  const imageGrids = [
    [vehiclesubImage1, vehiclesubImage2, vehiclesubImage3],
    [vehiclesubImage4, vehiclesubImage5, vehiclesubImage6],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % imageGrids.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imageGrids.length]);

  const handleSelectVehicle = useCallback((vehicle) => {
    navigate('/vip-side/special-reservation', { state: { vehicle } });
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <Skeleton height={40} width={300} style={{ marginBottom: '20px' }} />
        <Skeleton height={20} width={400} style={{ marginBottom: '10px' }} />
        <Skeleton height={40} width={200} style={{ marginBottom: '40px' }} />
        <div className="container">
          <div className="vehicle-list">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="vehicle-item">
                <Skeleton height={150} />
                <div className="vehicle-info">
                  <Skeleton width={300} height={200} />
                  <div className="vehicle-text">
                    <Skeleton count={4} />
                  </div>
                  <Skeleton height={50} width={150} />
                </div>
              </div>
            ))}
          </div>
          <div className="another-container">
            <Skeleton height={300} width="100%" />
          </div>
        </div>
      </div>
    );
  }

  const handleOpenCalendar = (vehicle) => {
    setSelectedVehicle(vehicle);    
    setShowCalendar(true); 
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false); 
    setSelectedVehicle(null); 
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <VipSideNavbar />
        <div className="content">
          <h1><FaBook style={{ marginBottom: "-3px", marginRight: "5px", color: "#782324" }} /> Reservation</h1>
          <div className="instruction-and-button">
            <p>Please choose the right capacity of your vehicle</p>
          </div>
          <div className="container">
            <div className="vehicle-list">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-item">
                  <div className="vehicle-card">
                  <img
                    src={getVehicleImage(vehicle.vehicleType)}
                    alt={vehicle.vehicleType}
                    className="vehicle-image"
                    loading="lazy"
                  />
                  <div className="vehicle-info">
                    <div className="vehicle-text">
                      <h2>
                        <FaBus style={{ marginBottom: "-2px", marginRight: "10px" }} />
                        {vehicle.vehicleType}
                      </h2>
                      <p>
                        Plate Number:{" "}
                        <span style={{ marginLeft: "5px", color: "#782324" }}>
                          {vehicle.plateNumber}
                        </span>
                      </p>
                      <p>
                        👥 Capacity:{" "}
                        <span style={{ marginLeft: "5px", color: "#782324" }}>
                          {vehicle.capacity}
                        </span>
                      </p>
                      <p>
                        {vehicle.status === "Available" ? "🟢" : "🔴"} Status:{" "}
                        <span
                          style={{
                            color: vehicle.status === "Available" ? "green" : "red",
                            marginLeft: "5px",
                          }}
                        >
                          {vehicle.status}
                        </span>
                      </p>
                    </div>
                    <div className="user-button-group">
                      <button
                        className={`btn-right-corner ${
                          vehicle.status !== "Available" ? "disabled" : ""
                        }`}
                        onClick={() => handleSelectVehicle(vehicle)}
                        disabled={vehicle.status !== "Available"}
                      >
                        <FaBus style={{ marginBottom: "-2px", marginRight: "10px" }} />
                        Select Vehicle
                      </button>
                      <button
                        className="btn-d"
                        onClick={() => handleOpenCalendar(vehicle)}
                      >
                        <FaCalendarAlt style={{fontSize: "20px", marginBottom: "-3px"}}/>
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              ))}
            </div>
            <div className="another-container">
              <div className="user-calendar-events">
                <ReserveCalendar />
              </div>
              <div className="inner-container">
                <label className="events-label">📣 Events and Updates</label>
              </div>
              <div className="events-list">
                {futureEvents.length > 0 ? (
                  futureEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      <div className='item-container'>
                        <div className='evnt-title'>
                          <p><span style={{ fontWeight: "700" }}>📌 Event Title:</span> {event.eventTitle}</p>
                        </div>
                        <p>
                          📅<span style={{ fontWeight: "700" }}> Date:</span> {new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p>📜<span style={{ fontWeight: "700" }}> Description:</span> {event.eventDescription}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-events-label">No Events</p>
                )}
              </div>
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="logo-image1" loading="lazy" />
          {showCalendar && (
            <div className="calendar-modal">
              <div className="user-calendar-modal-content">
                <h2>Reserved Schedules for <span style={{color: "#782324"}}>{selectedVehicle?.vehicleType}</span></h2>
                <Calendar 
                  vehicle={selectedVehicle}
                  plateNumber={selectedVehicle?.plateNumber}
                />
                <br/>
                <button className="close-button" onClick={handleCloseCalendar}>
                  <span style={{fontWeight: "700", fontSize: "16px"}}>Close</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipSide;

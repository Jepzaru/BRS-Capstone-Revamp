import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import OpcCalendar from './OpcCalendar';
import { MdDashboard } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { FaBus } from "react-icons/fa";
import { GiCarSeat } from "react-icons/gi";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../CSS/OpcCss/OpcDashboard.css';
import LoadingScreen from '../../Components/UserSide/LoadingScreen'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const useCounter = (target, duration, startCounting) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return; 
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      setCount((prevCount) => {
        const newCount = Math.min(prevCount + 1, target);
        if (newCount >= target) {
          clearInterval(timer);
        }
        return newCount;
      });
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);

  return count;
};

const OpcDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() =>{
    const fetchNumberOfDrivers = async () =>{
      try {
        const response = await fetch("http://localhost:8080/opc/driver/getAll",{
          headers: {"Authorization" : `Bearer ${token}`}
        })
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch driver details.", error);
      }
    }
    fetchNumberOfDrivers();
  }, [token]);

  useEffect(() =>{
    const fetchNumberOfVehicles = async () =>{
      try {
        const response = await fetch("http://localhost:8080/vehicle/getAll",{
          headers: {"Authorization" : `Bearer ${token}`}
        })
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicle data", error);
      }
    }
    fetchNumberOfVehicles();
  }, [token]);

  useEffect(() =>{
    const fetchNumbersOfRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/reservations/getAll", {
          headers: {"Authorization" : `Bearer ${token}`}
        })
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch numbers of requests.", error);
      }
    }

    fetchNumbersOfRequests();
  }, [token])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const requestsCount = useCounter(42, 2000, !isLoading);
  const vehiclesCount = useCounter(10, 2000, !isLoading);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Requests',
        data: [12, 19, 3, 5, 2, 3, 10, 15, 8, 12, 7, 6], 
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value < 10 ? 'gold' : '#782324';
        },
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      {isLoading ? <LoadingScreen /> : (
        <>
          <Header />
          <div className="dashboard-content1">
            <SideNavbar />
            <div className="dashboard1">
              <h1>
                <MdDashboard style={{ marginRight: "15px", color: "#782324", marginBottom: "-3px" }} />
                Dashboard
              </h1>
              <img src={logoImage1} alt="Logo" className="dashboard-logo-image" />
              <div className="main-container">
                <div className="container-wrapper">
                  <div className="dashcontainer1">
                    <h3 style={{ fontWeight: "700", marginLeft: "10px" }}>
                      <FaFileLines style={{ marginRight: "10px", marginBottom: "-2px" }} />
                      Requests
                    </h3>
                    <span className="number-badge">{requests.length}</span>
                  </div>
                  <div className="dashcontainer2">
                    <h3 style={{ fontWeight: "700", marginLeft: "10px" }}>
                      <GiCarSeat style={{ marginRight: "10px", marginBottom: "-2px" }} />
                      Drivers
                    </h3>
                    <span className="number-badge">{drivers.length}</span>
                  </div>
                  <div className="dashcontainer3">
                    <h3 style={{ fontWeight: "700", marginLeft: "10px" }}>
                      <FaBus style={{ marginRight: "10px", marginBottom: "-2px" }} />
                      Vehicles
                    </h3>
                    <span className="number-badge">{vehicles.length}</span>
                  </div>
                </div>
                <div className="calendar-container">
                  <OpcCalendar />
                </div>
              </div>
              <div className="full-width-container">
                <h3><FaFileLines style={{ marginRight: "10px", marginBottom: "-2px" }} />Number of Requests per Month</h3>
                <Bar data={data} options={options} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OpcDashboard;

import React, { useState, useEffect } from 'react';
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
  const [startCounting, setStartCounting] = useState(false);
  const requestCount = useCounter(requests.length, 1000, startCounting);
  const driverCount = useCounter(drivers.length, 1000, startCounting);
  const vehicleCount = useCounter(vehicles.length, 1000, startCounting);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNumberOfDrivers = async () => {
      try {
        const response = await fetch("http://localhost:8080/opc/driver/getAll", {
          headers: {"Authorization" : `Bearer ${token}`}
        });
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch driver details.", error);
      }
    };
    fetchNumberOfDrivers();
  }, [token]);

  useEffect(() => {
    const fetchNumberOfVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8080/vehicle/getAll", {
          headers: {"Authorization" : `Bearer ${token}`}
        });
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicle data", error);
      }
    };
    fetchNumberOfVehicles();
  }, [token]);

  useEffect(() => {
    const fetchNumbersOfRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/reservations/getAll", {
          headers: {"Authorization" : `Bearer ${token}`}
        });
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch numbers of requests.", error);
      }
    };
    fetchNumbersOfRequests();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setStartCounting(true); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const countReservationsPerDepartment = (reservations) => {
    const counts = {};
    reservations.forEach(request => {
      const department = request.department;
      if (counts[department]) {
        counts[department]++;
      } else {
        counts[department] = 1;
      }
    });
    return counts;
  };

  const departmentAcronyms = {
    'College of Computer Studies': 'CSS',
    'College of Engineering and Architecture': 'CEA',
    'College of Management, Business, and Accountancy': 'CMBA',
    'College of Arts, Sciences, and Education': 'CASE',
    'College of Nursing and Allied Health Sciences': 'CNAHS',
    'College of Criminal Justice': 'CCJ',
  };
  
  const reservationCounts = countReservationsPerDepartment(requests);
  
  
  const labels = Object.keys(reservationCounts).map(department => departmentAcronyms[department] || department);
  
  const data = {
    labels: labels,  
    datasets: [
      {
        label: 'Number of Reservations per Department',
        data: Object.values(reservationCounts),
        backgroundColor: ['orange', 'green', 'violet', 'gold', 'red', 'blue'],
      },
    ],
  };
  
  const options = {
    scales: {
      x: {
        ticks: {
          display: false,  
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'black',
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets[0].backgroundColor.map((color, index) => ({
              text: chart.data.labels[index], 
              fillStyle: color,
              strokeStyle: color,
              lineWidth: 1,
            }));
          },
        },
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
                    <span className="number-badge">{requestCount}</span> 
                  </div>
                  <div className="dashcontainer2">
                    <h3 style={{ fontWeight: "700", marginLeft: "10px" }}>
                      <GiCarSeat style={{ marginRight: "10px", marginBottom: "-2px" }} />
                      Drivers
                    </h3>
                    <span className="number-badge">{driverCount}</span>
                  </div>
                  <div className="dashcontainer3">
                    <h3 style={{ fontWeight: "700", marginLeft: "10px" }}>
                      <FaBus style={{ marginRight: "10px", marginBottom: "-2px" }} />
                      Vehicles
                    </h3>
                    <span className="number-badge">{vehicleCount}</span> 
                  </div>
                </div>
                <div className="calendar-container">
                  <OpcCalendar />
                </div>
              </div>
              <div className="full-width-container">
                <h3><FaFileLines style={{ marginRight: "10px", marginBottom: "-2px" }} />Usage Per Department</h3>
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

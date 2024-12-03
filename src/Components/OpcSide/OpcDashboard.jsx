import React, { useState, useEffect, useMemo } from 'react';
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
      setCount(prevCount => {
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
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startCounting, setStartCounting] = useState(false);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, vehiclesRes, requestsRes] = await Promise.all([
          fetch("https://citumovebackend.up.railway.app/opc/driver/getAll", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("https://citumovebackend.up.railway.app/vehicle/getAll", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("https://citumovebackend.up.railway.app/reservations/getAll", { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        const driversData = await driversRes.json();
        const vehiclesData = await vehiclesRes.json();
        const requestsData = await requestsRes.json();

        setDrivers(driversData);
        setVehicles(vehiclesData);
        setRequests(requestsData);
        setStartCounting(true);
      } catch (error) {
        console.error("Failed to fetch data.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const countReservationsPerDepartment = (reservations) => {
    const counts = {};
    reservations.forEach(request => {
      const department = request.department;
      counts[department] = (counts[department] || 0) + 1;
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

  const filteredReservations = useMemo(() => {
    return requests.filter(request => {
      const reservationDate = new Date(request.date);
      const reservationMonth = reservationDate.getMonth() + 1;
      const reservationYear = reservationDate.getFullYear();

      return (month ? reservationMonth === Number(month) : true) &&
             (year ? reservationYear === Number(year) : true);
    });
  }, [requests, month, year]);

  const reservationCounts = useMemo(() => {
    return countReservationsPerDepartment(filteredReservations);
  }, [filteredReservations]);

  const labels = Object.keys(reservationCounts).map(department => departmentAcronyms[department] || department);

  const data = useMemo(() => ({
    labels: labels,
    datasets: [
      {
        label: 'Number of Reservations per Department',
        data: Object.values(reservationCounts),
        backgroundColor: ['orange', 'green', 'violet', 'gold', 'red', 'blue'],
      },
    ],
  }), [labels, reservationCounts]);

  const options = {
    scales: {
      x: {
        ticks: { display: false },
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
          font: { size: 12 },
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

  const requestCount = useCounter(requests.length, 1000, startCounting);
  const driverCount = useCounter(drivers.length, 1000, startCounting);
  const vehicleCount = useCounter(vehicles.length, 1000, startCounting);

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
                <div className="container-header">
                  <h3><FaFileLines style={{ marginRight: "10px", marginBottom: "-2px" }} />Usage Per Department</h3>
                  <div className="filter-container">
                    <label>Month: </label>
                    <select value={month} onChange={handleMonthChange}>
                      <option value="">Select Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                      ))}
                    </select>

                    <label style={{ marginLeft: '10px' }}>Year: </label>
                    <select value={year} onChange={handleYearChange}>
                      <option value="">Select Year</option>
                      {Array.from({ length: 3 }, (_, i) => (
                        <option key={2022 + i} value={2022 + i}>{2022 + i}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bar-chart-container">
                  <Bar data={data} options={options} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OpcDashboard;

import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa6";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from 'xlsx'; 
import LoadingScreen from '../../Components/UserSide/LoadingScreen'; 
import '../../CSS/OpcCss/OpcRequests.css';

const OpcApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [confirmMode, setConfirmMode] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setLoading(true); 
      const token = localStorage.getItem('token'); 

      try {
        const response = await fetch('http://localhost:8080/reservations/opc-approved', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const approvedRequests = data.filter(request => request.opcIsApproved === true);
        setRequests(approvedRequests);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      } finally {
        setLoading(false); 
      }
    };
    
    fetchApprovedRequests();
  }, []); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortRequests = (requests) => {
    const filteredRequests = requests.filter(request => request.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    switch (sortOption) {
      case "alphabetical":
        return filteredRequests.sort((a, b) => a.reason.localeCompare(b.reason));
      case "ascending":
        return filteredRequests.sort((a, b) => a.capacity - b.capacity);
      case "descending":
        return filteredRequests.sort((a, b) => b.capacity - a.capacity);
      default:
        return filteredRequests;
    }
  };

  const sortedRequests = sortRequests(requests);

  const handleRowSelection = (transactionId) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = new Set(prevSelectedRows);
      if (updatedSelectedRows.has(transactionId)) {
        updatedSelectedRows.delete(transactionId);
      } else {
        updatedSelectedRows.add(transactionId);
      }
      return updatedSelectedRows;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const exportToExcel = () => {
    const selectedRequests = requests.filter(request => selectedRows.has(request.transactionId));
    const ws = XLSX.utils.json_to_sheet(selectedRequests, {
      header: [
        "userName", "typeOfTrip", "destinationFrom", "destinationTo", 
        "capacity", "vehicleType", "schedule", "departureTime", 
        "pickUpTime", "driverName", "reason"
      ]
    });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Approved Requests");
    
    XLSX.writeFile(wb, "Approved_Requests.xlsx");
  };

  const handleCancel = () => {
    setSelectedRows(new Set());
    setConfirmMode(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="opcrequest">
      <Header />
      <div className="opc-request-content1">
        <SideNavbar />
        <div className="opc1">
          <div className="header-container">
            <h1><FaClipboardCheck style={{ marginRight: "15px", color: "#782324" }} />Approved Requests</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Reason"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchChange} className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /> Search</button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
              <button
                onClick={() => {
                  if (confirmMode) {
                    exportToExcel();
                  }
                  setConfirmMode(!confirmMode);
                }}
                className="generate-report-button"
              >
                <RiFileExcel2Fill style={{marginRight: '10px'}}/>
                {confirmMode ? 'Confirm' : 'Generate Report'}
              </button>
              {confirmMode && (
                <button
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          <div className='opc-request-container1'>
            <div className='table-container'>
              <table className="opc-requests-table">
                <thead>
                  <tr>
                    {confirmMode && <th>Select</th>}
                    <th>Transaction ID</th>
                    <th>Requestor Name</th>
                    <th>Type of Trip</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Capacity</th>
                    <th>Vehicle</th>
                    <th>Added Vehicle</th>
                    <th>Schedule</th>
                    <th>Return Schedule</th>
                    <th>Departure Time</th>
                    <th>Pick Up Time</th>
                    <th>Assigned Driver</th>
                    <th>Extra Drivers</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={confirmMode ? "14" : "13"} className="no-requests">No Requests Available</td>
                    </tr>
                  ) : (
                    sortedRequests.map((request, index) => (
                      <tr
                      key={index}
                      className={
                        selectedRows.has(request.transactionId) ? 'selected-row' :
                        request.department.trim().toLowerCase() === "office of the president (vip)" ? 'highlight-vip' :
                        request.department.trim().toLowerCase() === "college of computer studies (ccs)" ? 'highlight-ccs' :
                        'default-highlight'
                      }
                    >
                        {confirmMode && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.has(request.transactionId)}
                              onChange={() => handleRowSelection(request.transactionId)}
                            />
                          </td>
                        )}
                        <td>{request.transactionId}</td>
                        <td>{request.userName}</td>
                        <td>{request.typeOfTrip}</td>
                        <td>{request.destinationFrom}</td>
                        <td>{request.destinationTo}</td>
                        <td>{request.capacity}</td>
                        <td>{request.vehicleType} - {request.plateNumber} </td>
                      <td>
                        {request.reservedVehicles && request.reservedVehicles.length > 0 ? (
                          request.reservedVehicles.map((vehicle, index) => (
                            <div key={index}>{vehicle.vehicleType} - {vehicle.plateNumber}</div>
                          ))
                        ) : (
                          "No Vehicles Added"
                        )}
                      </td>
                      <td>{request.schedule ? formatDate(request.schedule) : 'N/A'}</td>
                      <td>{request.returnSchedule && request.returnSchedule !== "0001-01-01" ? formatDate(request.returnSchedule) : 'N/A'}</td>
                        <td>{request.departureTime}</td>
                        <td>{request.pickUpTime || "N/A"}</td>
                        <td>{request.driverName || "N/A"}</td>
                        <td>{request.extraDrivers || "N/A"}</td>
                        <td>{request.reason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="opc-request-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default OpcApprovedRequests;

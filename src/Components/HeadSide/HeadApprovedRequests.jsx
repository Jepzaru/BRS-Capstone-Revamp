import React from 'react';
import Header from '../UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './HeadNavbar';
import { FaFileCircleCheck } from "react-icons/fa6";
import '../../CSS/HeadCss/HeadApprovedRequests.css';

const HeadApprovedRequests = () => {
  const requests = []; 

  return (
    <div className="approved">
      <Header />
      <div className="approved-content1">
        <SideNavbar />
        <div className="approved1">
          <h1><FaFileCircleCheck style={{marginRight: "15px", color: "#782324"}}/>Approved Requests</h1>
          <div className='approved-container1'>
            <table className="approved-requests-table">
              <thead>
                <tr>
                  <th>Requestor Name</th>
                  <th>Type of Trip</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Capacity</th>
                  <th>Vehicle Type</th>
                  <th>Schedule</th>
                  <th>Departure Time</th>
                  <th>Pick Up Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="no-requests">No Requests Available</td>
                  </tr>
                ) : (
                  requests.map((request, index) => (
                    <tr key={index}>
                       <td>{request.Name}</td>
                      <td>{request.typeOfTrip}</td>
                      <td>{request.from}</td>
                      <td>{request.to}</td>
                      <td>{request.capacity}</td>
                      <td>{request.vehicleType}</td>
                      <td>{request.schedule}</td>
                      <td>{request.departureTime}</td>
                      <td>{request.pickUpTime}</td>
                      <td>{request.department}</td>
                      <td>{request.reason}</td>
                      <td>{request.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="approved-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default HeadApprovedRequests;

import React, { useState } from 'react';
import '../../CSS/UserCss/SideNavbar.css';
import ToggleButton from '../../Components/UserSide/ToggleButton';
import { MdDashboard } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { FaBus } from "react-icons/fa";
import { GiCarSeat } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { FaClipboardCheck } from "react-icons/fa6";
import { FaCalendarDay } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const OpcNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ToggleButton onClick={handleToggle} />
      <nav className={`side-navbar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/dashboard" activeClassName="active-link">
              <MdDashboard style={{ marginRight: "15px", marginBottom: "-2px" }} />Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/opc-requests" activeClassName="active-link">
              < FaFileLines style={{ marginRight: "15px", marginBottom: "-2px" }} />Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/opc-approved-requests" activeClassName="active-link">
              < FaClipboardCheck style={{ marginRight: "15px", marginBottom: "-2px" }} />Approved Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/opc-bigcalendar" activeClassName="active-link">
              < FaCalendarDay style={{ marginRight: "15px", marginBottom: "-2px" }} />Calendar Events
            </NavLink>
          </li>

          <li>
            <NavLink to="/vehicle-management" activeClassName="active-link">
              <FaBus  style={{ marginRight: "15px", marginBottom: "-2px" }} />Vehicle Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/driver-management" activeClassName="active-link">
              <GiCarSeat style={{ marginRight: "15px", marginBottom: "-2px" }} />Driver Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/opc-settings" activeClassName="active-link">
              <FaGear style={{ marginRight: "15px", marginBottom: "-2px" }} />Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default OpcNavbar;

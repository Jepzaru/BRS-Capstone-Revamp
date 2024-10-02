import React, { useState } from 'react';
import '../../CSS/UserCss/SideNavbar.css';
import ToggleButton from './ToggleButton';
import { FaBook } from "react-icons/fa";
import { FaSwatchbook } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { NavLink } from 'react-router-dom'; 

const SideNavbar = () => {
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
            <NavLink to="/user-side" activeClassName="active-link">
              <FaBook style={{ marginRight: "15px", marginBottom: "-2px" }} />Reservation
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage-requests" activeClassName="active-link">
              <FaSwatchbook style={{ marginRight: "15px", marginBottom: "-2px" }} />Manage Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeClassName="active-link">
              <FaGear style={{ marginRight: "15px", marginBottom: "-2px" }} />Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideNavbar;

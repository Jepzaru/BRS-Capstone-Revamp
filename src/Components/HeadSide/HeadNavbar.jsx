import React, { useState } from 'react';
import '../../CSS/UserCss/SideNavbar.css';
import ToggleButton from '../../Components/UserSide/ToggleButton';
import { FaBook } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const HeadNavbar = () => {
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
            <NavLink to="/head-side" activeClassName="active-link">
              <FaBook style={{ marginRight: "15px", marginBottom: "-2px" }} />Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/head-approved-requests" activeClassName="active-link">
              <FaFileCircleCheck style={{ marginRight: "15px", marginBottom: "-2px" }} />Approved Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/head-settings" activeClassName="active-link">
              <FaGear style={{ marginRight: "15px", marginBottom: "-2px" }} />Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default HeadNavbar;

import React, { useState } from 'react';
import '../../CSS/UserCss/SideNavbar.css';
import ToggleButton from '../../Components/UserSide/ToggleButton';
import { FaUserGroup } from "react-icons/fa6";
import { RiBuildingFill } from "react-icons/ri";

import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {
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
            <NavLink to="/admin" activeClassName="active-link">
              <FaUserGroup style={{ marginRight: "15px", marginBottom: "-2px" }} />Accounts Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-department" activeClassName="active-link">
              <RiBuildingFill style={{ marginRight: "15px", marginBottom: "-2px" }} />Manage Department
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminNavbar;

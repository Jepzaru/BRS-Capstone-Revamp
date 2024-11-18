import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/SideNavbar.css';
import ToggleButton from '../../Components/UserSide/ToggleButton';
import { FaBook } from "react-icons/fa";
import { FaFileCircleCheck, FaGear } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const HeadNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const savedCount = localStorage.getItem('pendingRequestCount');
    if (savedCount) {
      setPendingRequestCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    if (pendingRequestCount > 0) {
      localStorage.setItem('pendingRequestCount', pendingRequestCount);
    }
  }, [pendingRequestCount]);

  return (
    <>
      <ToggleButton onClick={handleToggle} />
      <nav className={`side-navbar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/head-side" activeClassName="active-link">
              <FaBook style={{ marginRight: "15px", marginBottom: "-2px" }} />
              Requests
              {pendingRequestCount > 0 && (
                <span className="notification-badge">{pendingRequestCount}</span>
              )}
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

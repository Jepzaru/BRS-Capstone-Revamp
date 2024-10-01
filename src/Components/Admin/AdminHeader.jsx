import React, { useState } from 'react';
import '../../CSS/UserCss/Header.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaBus } from "react-icons/fa";
import logo from '../../Images/citlogo1.png';

const AdminHeader = () => {
  const email = localStorage.getItem('email');
  const firstName = email ? email.split('@')[0] : '';
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogOutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogOutModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    window.location.href = '/admin-authentication';
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return '🌞 Good Morning';
    } else if (currentHour < 18) {
      return '🌤️ Good Afternoon';
    } else {
      return '🌙 Good Evening';
    }
  };

  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <h2><FaBus style={{ marginRight: "15px", marginBottom: "-3px" }} />TRANSPORTATION RESERVATION SYSTEM - ADMIN</h2>
      <div className="header-right">
        <span className="greeting">{getGreeting()} and Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}</span>
        <button className="logout-button" onClick={handleLogout}>
          <span className="logout-text"><FaSignOutAlt style={{ marginBottom: "-3px", marginRight: "5px" }} />Log Out</span>
          <FaSignOutAlt className="logout-icon" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

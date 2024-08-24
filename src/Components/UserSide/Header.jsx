import React, { useState } from 'react';
import '../../CSS/UserCss/Header.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaBus } from "react-icons/fa";
import logo from '../../Images/citlogo1.png';

const Header = () => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogOutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogOutModalOpen(false);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logged out');
    setIsLogOutModalOpen(false);
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
    <>
      <header className="header">
        <img src={logo} alt="Logo" className="header-logo" />
        <h2><FaBus style={{ marginRight: "15px", marginBottom: "-3px" }} />TRANSPORTATION RESERVATION SYSTEM</h2>
        <div className="header-right">
          <span className="greeting">{getGreeting()} and Welcome,</span>
          <button className="logout-button" onClick={handleLogoutClick}>
            <span className="logout-text"><FaSignOutAlt style={{ marginBottom: "-3px", marginRight: "5px" }} />Log Out</span>
            <FaSignOutAlt className="logout-icon" />
          </button>
        </div>
      </header>

      {isLogOutModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to log out?</p>
            <button className="yes-modal-button" onClick={handleLogout}>Yes, I want to log out</button>
            <button className="no-modal-button" onClick={handleCloseModal}>Cancel</button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

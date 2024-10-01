import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/Header.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaBus } from "react-icons/fa";
import logo from '../../Images/citlogo1.png';

const Header = () => {
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchProfilePic(); 
    }
  }, []);

  const fetchProfilePic = async () => {
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:8080/users/profile-pic/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        setProfilePicUrl(URL.createObjectURL(imageBlob));
      } else {
        console.error('Failed to fetch profile picture');
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  let formattedName = "User";

  if (email) {
    const namePart = email.split('@')[0];
    const nameParts = namePart.split('.');
    
    const firstName = nameParts[0] || '';
    const lastName = nameParts[1] || '';
  
    const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    formattedName = `${capitalize(firstName)} ${capitalize(lastName)}`;
  }

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
    localStorage.removeItem('userId'); 
    setProfilePicUrl(''); 
    window.location.href = '/user-authentication';
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
      <h2><FaBus style={{ marginRight: "15px", marginBottom: "-3px" }} />TRANSPORTATION RESERVATION SYSTEM</h2>
      <div className="header-right">
        <span className="greeting">{getGreeting()}, {formattedName}</span>
        {profilePicUrl && (
          <img
            src={profilePicUrl}
            alt="Profile"
            className="header-profile-pic"
            style={{ maxWidth: "35px", maxHeight: "35px", borderRadius: "50%",  border: "solid 2px gold" , marginRight: "20px" }} 
          />
        )}
        <button className="logout-button" onClick={handleLogoutClick}>
          <span className="logout-text">
            <FaSignOutAlt style={{ marginBottom: "-3px", marginRight: "5px" }} />
            Log Out
          </span>
          <FaSignOutAlt className="logout-icon" />
        </button>
      </div>

      {isLogOutModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to log out?</p>
            <button className="yes-modal-button" onClick={handleLogout}>Logout</button>
            <button className="no-modal-button" onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

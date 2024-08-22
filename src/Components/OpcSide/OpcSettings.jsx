import React, { useState } from 'react';
import { BsPersonSquare } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { IoMdSettings } from 'react-icons/io';
import Header from '../../Components/UserSide/Header';
import '../../CSS/OpcCss/OpcSettings.css';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';

const OpcSettings = () => {
  const [activeTab, setActiveTab] = useState('accountDetails');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordTooShort(e.target.value.length < 6);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (newPassword.length < 6) {
      setPasswordTooShort(true);
    } else {
      setPasswordTooShort(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setPasswordMatch(true);
      setPasswordTooShort(false);
      // Add your form submission logic here
      console.log('Old Password:', oldPassword);
      console.log('New Password:', newPassword);
      console.log('Confirm Password:', confirmPassword);

      setShowModal(true);
    } else {
      setPasswordMatch(false);
      setTimeout(() => {
        setPasswordMatch(true);
      }, 2000);
    }
  };

  const SuccessModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
      <div className="opc-modal-overlay">
        <div className="opc-modal-content">
          <h2>Password Updated</h2>
          <p>Your password has been successfully updated.</p>
          <button className="opc-modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };


  return (
    <div className="app2">
      <Header />
      <div className="main-content2">
        <SideNavbar />
        <div className="content2">
          <h1><IoMdSettings style={{marginRight: "15px", marginBottom: "-3px", color: "#782324"}}/>Settings</h1>
          <div className='container2'>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'accountDetails' ? 'active' : ''}`}
                onClick={() => handleTabClick('accountDetails')}
              >
                <BsPersonSquare style={{marginRight: "10px", marginBottom: "-3px"}}/>Account Details
              </button>
              <button
                className={`tab ${activeTab === 'changePassword' ? 'active' : ''}`}
                onClick={() => handleTabClick('changePassword')}
              >
                <FaLock style={{marginRight: "10px"}}/>Change Password
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'accountDetails' && (
                <div>
                  <h2><BsPersonSquare style={{marginRight: "10px", marginBottom: "-3px"}}/>Account Details</h2>
                  {/* Add your account details form or content here */}
                </div>
              )}
              {activeTab === 'changePassword' && (
                <div>
                  <h2> <FaLock style={{marginRight: "10px"}}/>Change Password</h2>
                  <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                      <label htmlFor="oldPassword">Old Password</label>
                      <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        required
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        required
                        onChange={handleNewPasswordChange}
                      />
                      {passwordTooShort && (
                        <p className="opc-password-requirements" style={{ color: 'red' }}>
                          Password must be at least 6 characters long.
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        required
                        onChange={handleConfirmPasswordChange}
                      />
                      {!passwordMatch && (
                        <p className="password-match-error" style={{ color: 'red' }}>
                          Passwords do not match.
                        </p>
                      )}
                    </div>
                    <button type="submit" disabled={!passwordMatch}>Change Password</button>
                  </form>
                </div>
              )}
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="logo-image3" />
        </div>
      </div>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default OpcSettings;

import React, { useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './HeadNavbar';
import { IoMdSettings } from 'react-icons/io';
import { FaLock } from "react-icons/fa";
import { BsPersonSquare } from "react-icons/bs";
import '../../CSS/HeadCss/HeadSettings.css';

const HeadSettings = () => {
  const [activeTab, setActiveTab] = useState('accountDetails');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
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
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit">Change Password</button>
                  </form>
                </div>
              )}
            </div>
          </div>
          <img src={logoImage1} alt="Logo" className="logo-image3" />
        </div>
      </div>
    </div>
  );
};

export default HeadSettings;

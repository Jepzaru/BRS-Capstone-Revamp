import React, { useEffect, useState } from 'react';
import { BsPersonSquare } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { IoMdSettings } from 'react-icons/io';
import Header from '../../Components/UserSide/Header';
import '../../CSS/OpcCss/OpcSettings.css';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import defaultProfilePic from '../../Images/defaultProfile.png';

const OpcSettings = () => {
  const [activeTab, setActiveTab] = useState('accountDetails');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [profilePic, setProfilePic] = useState(null); 
  const [hover, setHover] = useState(false); 

  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); 
  const namePart = email.split('@')[0];
  const [firstName, lastName] = namePart.split('.');
  const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const formattedName = `${capitalize(firstName)} ${capitalize(lastName)}`;

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/profile-pic/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const imageBlob = await response.blob();
          setProfilePic(URL.createObjectURL(imageBlob));
        } else {
          console.error('Failed to fetch profile picture');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();
  }, [userId, token]);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('imageFile', file);
  
    try {
      const response = await fetch(`http://localhost:8080/users/upload-profile-pic/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
  
        window.location.reload();
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      setTimeout(() => setPasswordMatch(true), 2000);
      return;
    }
  
    try {  
      const response = await fetch(`http://localhost:8080/users/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });
  
      if (response.ok) {
        const data = await response.text(); 
        console.log(data);
        setShowModal(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };  

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const formData = new FormData();
      formData.append('imageFile', file);

      try {
        const response = await fetch(`http://localhost:8080/users/update-profile-pic/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const imageBlob = await response.blob();
          setProfilePic(URL.createObjectURL(imageBlob));
        } else {
          console.error('Failed to update profile picture');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    } else {
      alert('Please upload a JPG or PNG image.');
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
          <h1><IoMdSettings style={{ marginRight: "15px", marginBottom: "-3px", color: "#782324" }} />Settings</h1>
          <div className='container2'>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'accountDetails' ? 'active' : ''}`}
                onClick={() => handleTabClick('accountDetails')}
              >
                <BsPersonSquare style={{ marginRight: "10px", marginBottom: "-3px" }} />Account Details
              </button>
              <button
                className={`tab ${activeTab === 'changePassword' ? 'active' : ''}`}
                onClick={() => handleTabClick('changePassword')}
              >
                <FaLock style={{ marginRight: "10px" }} />Change Password
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'accountDetails' && (
                <div>
                  <h2>
                    <BsPersonSquare style={{ marginRight: "10px", marginBottom: "-3px" }} />
                    Account Details
                  </h2>
                  <div 
                    className="profile-container"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => document.getElementById('fileInput').click()} 
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'flex', 
                      alignItems: 'center', 
                    }}
                  >
                    <div className="profile-pic-container">
                      <img 
                        src={profilePic || defaultProfilePic} 
                        alt="Profile" 
                        style={{ maxWidth: "250px", maxHeight: "250px", borderRadius: "50%" }} 
                      />
                      {hover && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: '#fff',
                            borderRadius: '50%',
                          }}
                        >
                          Upload new Image
                        </div>
                      )}
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <div className="profile-info" style={{ marginLeft: '20px' }}> 
                      <p><b>Name:</b> {formattedName}</p>
                      <p><b>Email:</b> {email}</p>
                      <p><b>Role:</b> {role}</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'changePassword' && (
                <div>
                  <h2> <FaLock style={{ marginRight: "10px" }} />Change Password</h2>
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

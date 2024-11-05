import React, { useEffect, useState, useMemo } from 'react';
import { BsPersonSquare } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { IoMdSettings } from 'react-icons/io';
import '../../CSS/UserCss/Settings.css';
import logoImage1 from "../../Images/citbglogo.png";
import Header from './Header';
import SideNavbar from './SideNavbar';
import defaultProfilePic from '../../Images/defaultProfile.png';

const SuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal-content">
        <h2>Password Updated</h2>
        <p>Your password has been successfully updated.</p>
        <button className="user-modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Settings = () => {
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
  const department = localStorage.getItem('department');
  
  const formattedName = useMemo(() => {
    const namePart = email.split('@')[0];
    const [firstName, lastName] = namePart.split('.');
    const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  }, [email]);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch(`https://citumovebackend.up.railway.app/users/profile-pic/${userId}`, {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imageFile', file);

    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/users/upload-profile-pic/${userId}`, {
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewPasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordTooShort(newPass.length < 6);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    setPasswordTooShort(newPassword.length < 6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      setTimeout(() => setPasswordMatch(true), 2000);
      return;
    }

    try {
      const response = await fetch(`https://citumovebackend.up.railway.app/users/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      if (response.ok) {
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
        const response = await fetch(`https://citumovebackend.up.railway.app/users/update-profile-pic/${userId}`, {
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
                      <p><b>Department:</b> {department}</p>
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
                    <button type="submit" disabled={!passwordMatch || passwordTooShort}>Change Password</button>
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

export default Settings;

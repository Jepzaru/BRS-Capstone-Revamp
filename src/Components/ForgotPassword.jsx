import React, { useState, useCallback } from 'react';
import '../CSS/UserCss/Login.css';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { LiaBarcodeSolid } from "react-icons/lia";
import logoImage from "../Images/citlogo1.png";
import logoImage1 from "../Images/citbglogo.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [showVerificationField, setShowVerificationField] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleClear = () => {
        setEmail('');
        setShowVerificationField(false);
        setVerificationCode('');
        setShowPasswordFields(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSendCode = (e) => {
        e.preventDefault();
        setShowVerificationField(true);
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();

        setShowPasswordFields(true);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
    
    };

    const toggleNewPasswordVisibility = useCallback(() => {
        setNewPasswordVisible(prev => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setConfirmPasswordVisible(prev => !prev);
    }, []);

    return (
        <div className="login-page">
            <img src={logoImage} alt="Logo" className="logo-image" />
            <div className="label-container">
                <h1 className="label-text">TRANSPORTATION RESERVATION SYSTEM</h1>
            </div>
            <div className="login-container">
                <form className="login-form" onSubmit={showPasswordFields ? handleResetPassword : showVerificationField ? handleVerifyCode : handleSendCode}>
                    <h2>Forgot Password</h2>
                    <div className="input-group">
                        <span className="icon"><FaUser /></span>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            required
                        />
                    </div>
                    
                    {showVerificationField && !showPasswordFields && (
                        <div className="input-group">
                          <span className="icon"><LiaBarcodeSolid /></span>
                            <input
                                type="text"
                                id="verificationCode"
                                className="input-field"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder='Enter Verification Code'
                                required
                            />
                        </div>
                    )}

                    {showPasswordFields && (
                        <>
                            <div className="input-group">
                                <span className="icon"><FaLock /></span>
                                <input
                                    type={newPasswordVisible ? 'text' : 'password'}
                                    id="newPassword"
                                    className="input-field"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='New Password'
                                    required
                                />
                                <span className="toggle-icon" onClick={toggleNewPasswordVisibility}>
                                  {newPasswordVisible ? <FaEyeSlash style={{ marginRight: "5px", marginTop: "8px" }} /> : <FaEye style={{ marginRight: "5px", marginTop: "8px" }} />}
                                </span>
                            </div>
                            <div className="input-group">
                                <span className="icon"><FaKey /></span>
                                <input
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className="input-field"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm Password'
                                    required
                                />
                                <span className="toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                                  {confirmPasswordVisible ? <FaEyeSlash style={{ marginRight: "5px", marginTop: "8px" }} /> : <FaEye style={{ marginRight: "5px", marginTop: "8px" }} />}
                                </span>
                            </div>
                        </>
                    )}

                    <button type="submit" className="login-button">
                        {showPasswordFields ? "RESET PASSWORD" : showVerificationField ? "VERIFY CODE" : "SEND CODE"}
                    </button>
                    <button type="button" className="clear-button" onClick={handleClear}>CLEAR ENTITIES</button>
                    <p className='admin-path'>
                        Back to Login page <Link to="/user-authentication">Click Here</Link>
                    </p>
                </form>
            </div>
            <img src={logoImage1} alt="Logo" className="logo-image1" />
        </div>
    );
};

export default ForgotPassword;

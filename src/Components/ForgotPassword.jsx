import React, { useState, useCallback } from 'react';
import '../CSS/UserCss/Login.css';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
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
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleClear = () => {
        setEmail('');
        setVerificationCode('');
        setNewPassword('');
        setConfirmPassword('');
        setShowVerificationField(false);
        setShowPasswordFields(false);
        setErrorMessage('');
        setSnackbarMessage('');
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSnackbarMessage('');
        try {
            const response = await fetch('https://citumovebackend.up.railway.app/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient: email }),
            });

            if (!response.ok) throw new Error('Failed to send verification code');
            setShowVerificationField(true);
            setSnackbarMessage('Verification code successfully sent!');

            setTimeout(() => {
                setSnackbarMessage('');
            }, 5000);

        } catch (error) {
            setErrorMessage(error.message);

            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(`https://citumovebackend.up.railway.app/api/email/verify?email=${email}&code=${verificationCode}`, {
                method: 'POST',
            });

            if (response.ok) {
                setShowPasswordFields(true);
            } else {
                setErrorMessage('Invalid verification code');

                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            setErrorMessage('Error verifying code');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        const payload = {
            email: email, 
            newPassword: newPassword,
        };

        try {
            const response = await fetch('https://citumovebackend.up.railway.app/api/email/change-password-by-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Password successfully reset!");
                handleClear();
            } else {
                const errorText = await response.text();
                alert(`Failed to reset password: ${errorText}`);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
        } finally {
            setLoading(false);
        }
    };    

    const togglePasswordVisibility = useCallback((field) => {
        if (field === 'new') {
            setNewPasswordVisible((prev) => !prev);
        } else if (field === 'confirm') {
            setConfirmPasswordVisible((prev) => !prev);
        }
    }, []);

    const handleSubmit = (e) => {
        if (showPasswordFields) {
            handleResetPassword(e);
        } else if (showVerificationField) {
            handleVerifyCode(e);
        } else {
            handleSendCode(e);
        }
    };

    return (
        <div className="login-page">
            <img src={logoImage} alt="Logo" className="logo-image" />
            <div className="label-container">
                <h1 className="label-text">TRANSPORTATION RESERVATION SYSTEM</h1>
            </div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Forgot Password</h2>
                
                    {snackbarMessage && (
                        <div className="input-group">
                        <div className="snackbar success">
                            <FaCircleCheck style={{ marginRight: "5px", marginBottom: "-2px" }}/> {snackbarMessage}
                        </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="input-group">
                        <div className="snackbar error">
                            <IoCloseCircle style={{ marginRight: "5px", marginBottom: "-2px" }}/> {errorMessage}
                        </div>
                        </div>
                    )}

                    <div className="input-group">
                        <span className="icon"><FaUser /></span>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>

                    {showVerificationField && !showPasswordFields && (
                        <div className="input-group">
                            <span className="icon"><LiaBarcodeSolid /></span>
                            <input
                                type="text"
                                className="input-field"
                                value={verificationCode}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    if (/^\d{0,6}$/.test(input)) {
                                        setVerificationCode(input);
                                    }
                                }}
                                placeholder="Enter Verification Code"
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
                                    className="input-field"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    required
                                />
                                <span className="toggle-icon" onClick={() => togglePasswordVisibility('new')}>
                                    {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="input-group">
                                <span className="icon"><FaKey /></span>
                                <input
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    className="input-field"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    required
                                />
                                <span className="toggle-icon" onClick={() => togglePasswordVisibility('confirm')}>
                                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Processing..." : showPasswordFields ? "RESET PASSWORD" : showVerificationField ? "VERIFY CODE" : "SEND CODE"}
                    </button>

                    <button type="button" className="clear-button" onClick={handleClear}>CLEAR FIELDS</button>

                    <p className="admin-path">
                        Back to Login page <Link to="/user-authentication">Click Here</Link>
                    </p>
                </form>
            </div>
            <img src={logoImage1} alt="Logo" className="logo-image1" />
        </div>
    );
};

export default ForgotPassword;

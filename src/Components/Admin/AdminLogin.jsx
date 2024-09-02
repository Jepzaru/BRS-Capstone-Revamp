import React, { useState, useEffect } from 'react';
import '../../CSS/AdminCss/AdminLogin.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logoImage from "../../Images/citlogo1.png";
import logoImage1 from "../../Images/citbglogo.png";
import LoadingScreen from '../UserSide/LoadingScreen'; 
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleSharp } from "react-icons/io5";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password.');
        }
        throw new Error('Login failed.');
      }

      const data = await response.json();
      const { token, role } = data;

      if (token && role) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);

        if (role === 'ROLE_ADMIN') {
          navigate('/admin');
        }
      } else {
        throw new Error('Invalid login response.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="admin-login-page">
      <img src={logoImage} alt="Logo" className="logo-image" />
      <div className="label-container">
        <h1 className="label-text">TRANSPORTATION RESERVATION SYSTEM</h1>
      </div>
      <div className="login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Admin Authentication</h2>
          {error && <p className="error-message">{error}</p>}
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
          <div className="input-group">
            <span className="icon"><FaLock /></span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
            <span className="toggle-icon" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash style={{ marginRight: "5px", marginTop: "8px" }} /> : <FaEye style={{ marginRight: "5px", marginTop: "8px" }} />}
            </span>
          </div>
          <button type="submit" className="login-button">LOGIN</button>
          <button type="button" className="clear-button" onClick={handleClear}>CLEAR ENTITIES</button>

          <div className="super-admin">
            <p 
              className='history-route' 
              onClick={() => navigate('/user-authentication')} 
              style={{ cursor: 'pointer' }} 
            >
              Go back to user log in
            </p>
          </div>

        </form>
      </div>
      <img src={logoImage1} alt="Logo" className="logo-image1" />
    </div>
  );
};

export default AdminLogin;

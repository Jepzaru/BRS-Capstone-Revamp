import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logoImage from "../../Images/citlogo1.png";
import logoImage1 from "../../Images/citbglogo.png";
import LoadingScreen from './LoadingScreen'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); 

    return () => clearTimeout(timer);
  }, []);

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
      const { token, role, userId, department } = data;
  
      if (token && role && userId && department) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem('department', department);
  
        switch (role) {
          case 'ROLE_USER':
            navigate('/user-side');
            break;
          case 'ROLE_HEAD':
            navigate('/head-side');
            break;
          case 'ROLE_OPC':
            navigate('/dashboard');
            break;
          case 'ROLE_ADMIN':
            navigate('/admin');
            break;
          case 'ROLE_VIP':
            navigate('/vip-side');
            break;
          default:
            navigate('/');
            break;
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
    <div className="login-page">
      <img src={logoImage} alt="Logo" className="logo-image" />
      <div className="label-container">
        <h1 className="label-text">TRANSPORTATION RESERVATION SYSTEM</h1>
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>User Authentication</h2>
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
          <p className='admin-path'>
            Are you an admin? <Link to="/admin-authentication">Click Here</Link>
          </p>
        </form>
      </div>
      <img src={logoImage1} alt="Logo" className="logo-image1" />
    </div>
  );
};

export default Login;
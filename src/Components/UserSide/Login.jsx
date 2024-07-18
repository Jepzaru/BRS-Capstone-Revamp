import React, { useState, useEffect } from 'react';
import '../../CSS/UserCss/Login.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logoImage from "../../Images/citlogo1.png";
import logoImage1 from "../../Images/citbglogo.png";
import LoadingScreen from './LoadingScreen'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Add actual login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    // Example: call login API, set state based on response, etc.
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
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>User Authentication</h2>
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
        </form>
      </div>
      <img src={logoImage1} alt="Logo" className="logo-image1" />
    </div>
  );
};

export default Login;

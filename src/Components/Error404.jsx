import React from 'react';
import '../CSS/Error404.css'; 
import errorImage from '../Images/citlogo1.png';

const Error404 = () => {

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="error-container">
      <a href="/user-authentication">
        <img src={errorImage} alt="Error" className="error-image"/>
      </a>
      <h1 className="error-code">404</h1>
      <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
      <button className="error-link" onClick={handleBackClick}>Go Back</button> 
    </div>
  );
};

export default Error404;

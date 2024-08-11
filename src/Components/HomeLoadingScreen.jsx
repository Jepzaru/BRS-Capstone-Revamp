import React from 'react';
import '../CSS/UserCss/LoadingScreen.css';
import loadingImage from '../Images/loadingscreen.png'; 

const HomeLoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="loader">
      </div>
      <img src={loadingImage} alt="Loading" className="loader-image" />
    </div>
  );
};

export default HomeLoadingScreen;

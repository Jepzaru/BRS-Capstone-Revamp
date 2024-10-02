import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAccess } from './CheckAccess';
import { isTokenExpired } from './TokenUtils'; 


const ProtectedRoute = ({ element, path }) => {

  const token = localStorage.getItem('token'); 
  const hasAccess = checkAccess(path);

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('department');
    localStorage.removeItem('userId');
    alert("Session expires. Please log in again.");
    return <Navigate to="/user-authentication" />; 
  }

  return hasAccess ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
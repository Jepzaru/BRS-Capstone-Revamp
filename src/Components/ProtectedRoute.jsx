import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAccess } from './CheckAccess';

const ProtectedRoute = ({ element, path }) => {
  const hasAccess = checkAccess(path);
  return hasAccess ? element : <Navigate to="/" />;
};

export default ProtectedRoute;

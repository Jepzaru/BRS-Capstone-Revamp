import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAccess } from './CheckAccess'; 

const ProtectedRoute = ({ element, path }) => {
    return checkAccess(path) ? element : <Navigate to="/error404" />;
};

export default ProtectedRoute;

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Homepage';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminModule from './Components/Admin/AdminModule';
import AdminDepartment from './Components/Admin/AdminDepartment';
import Login from './Components/UserSide/Login';
import ManageRequests from './Components/UserSide/ManageRequest';
import HeadApprovedRequests from './Components/HeadSide/HeadApprovedRequests';
import UserSide from './Components/UserSide/UserSide';
import Settings from './Components/UserSide/Settings';
import HeadSettings from './Components/HeadSide/HeadSettings';
import Reservation from './Components/UserSide/Reservation';
import ForgotPassword from './Components/ForgotPassword';
import HeadSide from './Components/HeadSide/HeadSide';
import OpcDashboard from './Components/OpcSide/OpcDashboard';
import OpcRequests from './Components/OpcSide/OpcRequests';
import OpcApprovedRequests from './Components/OpcSide/OpcApprovedRequests';
import VehicleManagement from './Components/OpcSide/VehicleManagement';
import DriverManagement from './Components/OpcSide/DriverManagement';
import OpcSettings from './Components/OpcSide/OpcSettings';
import Error404 from './Components/Error404';
import ProtectedRoute from './Components/ProtectedRoute';
import { isTokenExpired  } from './Components/TokenUtils';
import OpcBigCalendar from './Components/OpcSide/OpcBigCalendar';
import TitleManager from './TitleManager';
import VipSpecialReservation from './Components/VipSide/SpecialReservation';
import VipSide from './Components/VipSide/VipSide';
import VipSettings from './Components/VipSide/VipSettings';
import VipManageRequest from './Components/VipSide/VipManageRequest';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      console.log('Token expired');
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('department');
      localStorage.removeItem('userId');
    }
  }, []);

  if (!isLoggedIn) {
    return null; 
  }

  return (
    <BrowserRouter>
     <TitleManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-authentication" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/vip-side/special-reservation" element={<ProtectedRoute path="/vip-side/special-reservation" element={<VipSpecialReservation  />} />} />
        <Route path="/vip-side" element={<ProtectedRoute path="/vip-side" element={<VipSide />} />} />
        <Route path="/vip-settings" element={<ProtectedRoute path="/vip-settings" element={<VipSettings />} />} />
        <Route path="/vip-manage-requests" element={<ProtectedRoute path="/vip-manage-requests" element={<VipManageRequest />} />} />
        <Route path="/admin-authentication" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute path="/admin" element={<AdminModule />} />} />
        <Route path="/admin-department" element={<ProtectedRoute path="/admin-department" element={<AdminDepartment />} />} />
        <Route path="/user-side" element={<ProtectedRoute path="/user-side" element={<UserSide />} />} />
        <Route path="/user-side/reservation" element={<ProtectedRoute path="/user-side/reservation" element={<Reservation />} />} />
        <Route path="/manage-requests" element={<ProtectedRoute path="/manage-requests" element={<ManageRequests />} />} />
        <Route path="/opc-bigcalendar" element={<ProtectedRoute path="/opc-bigcalendar" element={<OpcBigCalendar />} />} />
        <Route path="/settings" element={<ProtectedRoute path="/settings" element={<Settings />} />} />
        <Route path="/head-side" element={<ProtectedRoute path="/head-side" element={<HeadSide />} />} />
        <Route path="/head-approved-requests" element={<ProtectedRoute path="/head-approved-requests" element={<HeadApprovedRequests />} />} />
        <Route path="/head-settings" element={<ProtectedRoute path="/head-settings" element={<HeadSettings />} />} />
        <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" element={<OpcDashboard />} />} />
        <Route path="/opc-requests" element={<ProtectedRoute path="/opc-requests" element={<OpcRequests />} />} />
        <Route path="/opc-approved-requests" element={<ProtectedRoute path="/opc-approved-requests" element={<OpcApprovedRequests />} />} />
        <Route path="/vehicle-management" element={<ProtectedRoute path="/vehicle-management" element={<VehicleManagement />} />} />
        <Route path="/driver-management" element={<ProtectedRoute path="/driver-management" element={<DriverManagement />} />} />
        <Route path="/opc-settings" element={<ProtectedRoute path="/opc-settings" element={<OpcSettings />} />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);

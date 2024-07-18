import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for createRoot
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/UserSide/Login';
import ManageRequests from './Components/UserSide/ManageRequest';
import HeadApprovedRequests from './Components/HeadSide/HeadApprovedRequests';
import UserSide from './Components/UserSide/UserSide';
import Settings from './Components/UserSide/Settings';
import HeadSettings from './Components/HeadSide/HeadSettings';
import Reservation from './Components/UserSide/Reservation'
import HeadSide from './Components/HeadSide/HeadSide'
import OpcDashboard from './Components/OpcSide/OpcDashboard'

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manage-requests" element={<ManageRequests />} />
        <Route path="/head-approved-requests" element={<HeadApprovedRequests />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/head-settings" element={<HeadSettings/>} />
        <Route path="/user-side" element={<UserSide/>} />
        <Route path="/head-side" element={<HeadSide/>} />
        <Route path="/user-side/reservation" element={<Reservation/>} />
        <Route path="/dashboard" element={<OpcDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

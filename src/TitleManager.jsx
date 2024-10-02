import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titleMap = {
  '/': 'Home - CIT-U Transportation Reservation System',
  '/user-authentication': 'Login - CIT-U Transportation Reservation System',
  '/admin-authentication': 'Admin Login - CIT-U Transportation Reservation System',
  '/admin': 'Admin User Module - CIT-U Transportation Reservation System',
  '/admin-department': 'Admin Department Module - CIT-U Transportation Reservation System',
  '/user-side': 'User Module - CIT-U Transportation Reservation System',
  '/user-side/reservation': 'Reservation - CIT-U Transportation Reservation System',
  '/user-side/special-reservation': 'Special Reservation - CIT-U Transportation Reservation System',
  '/manage-requests': 'Manage Requests - CIT-U Transportation Reservation System',
  '/opc-bigcalendar': 'Big Calendar - CIT-U Transportation Reservation System',
  '/settings': 'Settings - CIT-U Transportation Reservation System',
  '/head-side': 'Head Module - CIT-U Transportation Reservation System',
  '/head-approved-requests': 'Head Approved Requests - CIT-U Transportation Reservation System',
  '/head-settings': 'Head Settings - CIT-U Transportation Reservation System',
  '/dashboard': 'Dashboard - CIT-U Transportation Reservation System',
  '/opc-requests': 'Requests - CIT-U Transportation Reservation System',
  '/opc-approved-requests': 'Approved Requests - CIT-U Transportation Reservation System',
  '/vehicle-management': 'Vehicle Management - CIT-U Transportation Reservation System',
  '/driver-management': 'Driver Management - CIT-U Transportation Reservation System',
  '/opc-settings': 'Settings - CIT-U Transportation Reservation System',
  '/vip-side': 'Vip - CIT-U Transportation Reservation System',
  '/vip-side/special-reservation': 'Special Reservation - CIT-U Transportation Reservation System',
  '/vip-manage-requests': 'Manage Requests - CIT-U Transportation Reservation System'
};

const TitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = titleMap[location.pathname] || 'Error 404';
  }, [location]);

  return null;
};

export default TitleManager;

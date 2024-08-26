import { roles } from './Roles'; 

export const checkAccess = (path) => {
    const userRole = localStorage.getItem('role');
    return userRole && roles[userRole]?.includes(path);
};

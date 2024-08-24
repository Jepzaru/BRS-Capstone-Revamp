import { roles } from './Roles'; 

export const checkAccess = (path) => {
    const userRole = localStorage.getItem('role');
    // console.log("User Role:", userRole);
    // console.log("Checking Path:", path);
    // console.log("Allowed Paths for Role:", roles[userRole]);

    return userRole && roles[userRole]?.includes(path);
};

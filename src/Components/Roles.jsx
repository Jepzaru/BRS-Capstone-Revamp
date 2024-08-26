export const roles = {
    ROLE_USER: ['/', '/user-authentication', '/user-side', '/user-side/reservation', '/manage-requests', '/settings'],
    ROLE_HEAD: ['/head-side', '/head-approved-requests', '/head-settings'],
    ROLE_OPC: ['/dashboard', '/opc-requests', '/vehicle-management', '/driver-management', '/opc-settings'],
    ROLE_ADMIN: ['/admin', '/admin-authentication']
};


export const user_roles = ['USER', 'HEAD', 'OPC', 'ADMIN'];
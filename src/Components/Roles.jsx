export const roles = {
    ROLE_USER: ['/', '/user-authentication', '/user-side', '/user-side/reservation', '/manage-requests', '/settings',  '/user-side/special-reservation'],
    ROLE_HEAD: ['/head-side', '/head-approved-requests', '/head-settings'],
    ROLE_OPC: ['/dashboard', '/opc-requests', '/vehicle-management', '/driver-management', '/opc-settings', '/opc-approved-requests', '/opc-bigcalendar'],
    ROLE_ADMIN: ['/admin', '/admin-department'],
    ROLE_VIP: ['/vip-side', '/vip-side/special-reservation', '/vip-manage-requests', '/vip-settings'  ]
};

export const user_roles = ['USER', 'HEAD', 'OPC', 'ADMIN', 'VIP'];
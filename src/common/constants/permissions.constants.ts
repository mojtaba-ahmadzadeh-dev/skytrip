export const PermissionsList = {
  // ==================== RBAC ====================
  CREATE_ROLE: 'create:role',
  FIND_ROLES: 'find:roles',
  FIND_ONE_ROLE: 'findOne:role',
  UPDATE_ROLE: 'update:role',
  REMOVE_ROLE: 'remove:role',

  CREATE_PERMISSION: 'create:permission',
  FIND_PERMISSIONS: 'find:permissions',
  FIND_ONE_PERMISSION: 'findOne:permission',
  UPDATE_PERMISSION: 'update:permission',
  REMOVE_PERMISSION: 'remove:permission',

  ASSIGN_PERMISSION_TO_ROLE: 'assign:permission_to_role',
  REMOVE_PERMISSION_FROM_ROLE: 'remove:permission_from_role',
  ASSIGN_ROLE_TO_USER: 'assign:role_to_user',

  // ==================== USER ====================
  CREATE_USER: 'create:user',
  FIND_USERS: 'find:users',
  FIND_ONE_USER: 'findOne:user',
  UPDATE_USER: 'update:user',
  REMOVE_USER: 'remove:user',
  BAN_USER: 'ban:user',
  UNBAN_USER: 'unban:user',
  MANAGE_USER_STATUS: 'manage:user_status',
  UPDATE_MY_PROFILE: 'update:my_profile',

  // ==================== FLIGHT ====================
  CREATE_FLIGHT: 'create:flight',
  FIND_FLIGHTS: 'find:flights',
  FIND_ONE_FLIGHT: 'findOne:flight',
  UPDATE_FLIGHT: 'update:flight',
  REMOVE_FLIGHT: 'remove:flight',

  // ==================== AIRLINE ====================
  CREATE_AIRLINE: 'create:airline',
  FIND_AIRLINES: 'find:airlines',
  FIND_ONE_AIRLINE: 'findOne:airline',
  UPDATE_AIRLINE: 'update:airline',
  REMOVE_AIRLINE: 'remove:airline',

  // ==================== AIRPORT ====================
  CREATE_AIRPORT: 'create:airport',
  FIND_AIRPORTS: 'find:airports',
  FIND_ONE_AIRPORT: 'findOne:airport',
  UPDATE_AIRPORT: 'update:airport',
  REMOVE_AIRPORT: 'remove:airport',

  // ==================== BOOKING ====================
  CREATE_BOOKING: 'create:booking',
  FIND_BOOKINGS: 'find:bookings',
  FIND_ONE_BOOKING: 'findOne:booking',
  UPDATE_BOOKING: 'update:booking',
  CANCEL_BOOKING: 'cancel:booking',
  REMOVE_BOOKING: 'remove:booking',

  // ==================== TICKET ====================
  CREATE_TICKET: 'create:ticket',
  FIND_TICKETS: 'find:tickets',
  FIND_ONE_TICKET: 'findOne:ticket',
  UPDATE_TICKET: 'update:ticket',
  CANCEL_TICKET: 'cancel:ticket',

  // ==================== PASSENGER ====================
  CREATE_PASSENGER: 'create:passenger',
  FIND_PASSENGERS: 'find:passengers',
  FIND_ONE_PASSENGER: 'findOne:passenger',
  UPDATE_PASSENGER: 'update:passenger',
  REMOVE_PASSENGER: 'remove:passenger',
  DELETE_PASSENGER: 'delete:passenger',
  RESTORE_PASSENGER: 'restore:passenger',

  CREATE_CITY: 'create_city',
  UPDATE_CITY: 'update_city',
  DELETE_CITY: 'delete_city',
  VIEW_CITY: 'view_city',
  RESTORE_CITY: 'restore_city',

  // ==================== PAYMENT ====================
  CREATE_PAYMENT: 'create:payment',
  FIND_PAYMENTS: 'find:payments',
  FIND_ONE_PAYMENT: 'findOne:payment',
  VERIFY_PAYMENT: 'verify:payment',
  REFUND_PAYMENT: 'refund:payment',

  // ==================== DISCOUNT ====================
  CREATE_DISCOUNT: 'create:discount',
  FIND_DISCOUNTS: 'find:discounts',
  FIND_ONE_DISCOUNT: 'findOne:discount',
  UPDATE_DISCOUNT: 'update:discount',
  REMOVE_DISCOUNT: 'remove:discount',
  APPLY_DISCOUNT: 'apply:discount',

  // ==================== SUPPORT ====================
  FIND_SUPPORT_TICKETS: 'find:support_tickets',
  FIND_ONE_SUPPORT_TICKET: 'findOne:support_ticket',
  CREATE_SUPPORT_TICKET: 'create:support_ticket',
  UPDATE_SUPPORT_TICKET: 'update:support_ticket',
  CLOSE_SUPPORT_TICKET: 'close:support_ticket',

  // ==================== REPORT ====================
  FIND_REPORTS: 'find:reports',
  FIND_SALES_REPORTS: 'find:sales_reports',
  FIND_BOOKING_REPORTS: 'find:booking_reports',
} as const;

export type PermissionType =
  (typeof PermissionsList)[keyof typeof PermissionsList];

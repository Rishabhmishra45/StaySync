const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CASH: 'cash',
};

const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SUITE: 'suite',
  DELUXE: 'deluxe',
  PRESIDENTIAL: 'presidential',
};

const AMENITIES = [
  'wifi',
  'tv',
  'ac',
  'heating',
  'minibar',
  'safe',
  'balcony',
  'pool_view',
  'sea_view',
  'breakfast_included',
  'room_service',
  'parking',
  'gym_access',
  'spa_access',
  'laundry',
];

const SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING_DESC: 'rating_desc',
  NEWEST: 'newest',
};

module.exports = {
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  ROOM_TYPES,
  AMENITIES,
  SORT_OPTIONS,
};
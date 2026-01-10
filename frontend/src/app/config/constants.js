export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out'
}

export const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SUITE: 'suite',
  DELUXE: 'deluxe',
  PRESIDENTIAL: 'presidential'
}

export const AMENITIES = [
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
  'room_service'
]

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CASH: 'cash'
}
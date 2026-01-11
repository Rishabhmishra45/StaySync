const { body, query } = require('express-validator');
const moment = require('moment');
const { PAYMENT_METHODS } = require('../utils/constants');

const createBookingValidation = [
  body('roomId')
    .notEmpty()
    .withMessage('Room ID is required')
    .isMongoId()
    .withMessage('Invalid Room ID'),

  body('checkIn')
    .notEmpty()
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value) => {
      const checkIn = moment(value);
      const today = moment().startOf('day');
      if (checkIn.isBefore(today)) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),

  body('checkOut')
    .notEmpty()
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value, { req }) => {
      const checkIn = moment(req.body.checkIn);
      const checkOut = moment(value);
      if (checkOut.isSameOrBefore(checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),

  body('guests.adults')
    .isInt({ min: 1 })
    .withMessage('At least 1 adult is required'),

  body('guests.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children must be 0 or more'),

  body('guests.infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Infants must be 0 or more'),

  body('paymentMethod')
    .isIn(Object.values(PAYMENT_METHODS))
    .withMessage('Invalid payment method'),

  body('specialRequests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Special requests cannot exceed 500 characters'),
];

const updateBookingValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'])
    .withMessage('Invalid status'),

  body('paymentStatus')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
];

const getBookingsValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'])
    .withMessage('Invalid status'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  createBookingValidation,
  updateBookingValidation,
  getBookingsValidation,
};
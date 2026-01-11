const { body, query } = require('express-validator');
const { ROOM_TYPES, AMENITIES, SORT_OPTIONS } = require('../utils/constants');

const createRoomValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Room name is required')
    .isLength({ max: 100 })
    .withMessage('Room name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('type')
    .isIn(Object.values(ROOM_TYPES))
    .withMessage('Invalid room type'),

  body('pricePerNight')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('capacity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Capacity must be between 1 and 10'),

  body('size')
    .isFloat({ min: 1 })
    .withMessage('Size must be at least 1 sqft'),

  body('beds')
    .trim()
    .notEmpty()
    .withMessage('Beds specification is required'),

  body('bathrooms')
    .isInt({ min: 1 })
    .withMessage('Must have at least 1 bathroom'),

  body('floor')
    .isInt({ min: 1 })
    .withMessage('Floor must be at least 1'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array')
    .custom((value) => {
      if (value) {
        const invalidAmenities = value.filter(
          (amenity) => !AMENITIES.includes(amenity)
        );
        if (invalidAmenities.length > 0) {
          throw new Error(`Invalid amenities: ${invalidAmenities.join(', ')}`);
        }
      }
      return true;
    }),

  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
];

const updateRoomValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Room name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('type')
    .optional()
    .isIn(Object.values(ROOM_TYPES))
    .withMessage('Invalid room type'),

  body('pricePerNight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Capacity must be between 1 and 10'),

  body('size')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Size must be at least 1 sqft'),

  body('beds')
    .optional()
    .trim(),

  body('bathrooms')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Must have at least 1 bathroom'),

  body('floor')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Floor must be at least 1'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array')
    .custom((value) => {
      if (value) {
        const invalidAmenities = value.filter(
          (amenity) => !AMENITIES.includes(amenity)
        );
        if (invalidAmenities.length > 0) {
          throw new Error(`Invalid amenities: ${invalidAmenities.join(', ')}`);
        }
      }
      return true;
    }),

  body('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be a boolean'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
];

const getRoomsValidation = [
  query('type')
    .optional()
    .isIn(Object.values(ROOM_TYPES))
    .withMessage('Invalid room type'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),

  query('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),

  query('amenities')
    .optional()
    .custom((value) => {
      if (value) {
        const amenities = value.split(',');
        const invalidAmenities = amenities.filter(
          (amenity) => !AMENITIES.includes(amenity)
        );
        if (invalidAmenities.length > 0) {
          throw new Error(`Invalid amenities: ${invalidAmenities.join(', ')}`);
        }
      }
      return true;
    }),

  query('sort')
    .optional()
    .isIn(Object.values(SORT_OPTIONS))
    .withMessage('Invalid sort option'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .trim(),
];

module.exports = {
  createRoomValidation,
  updateRoomValidation,
  getRoomsValidation,
};
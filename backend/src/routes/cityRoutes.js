const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  getCitiesByState,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require('../controllers/cityController');

// Public routes
router.get('/state/:stateId', getCitiesByState);
router.get('/:id', getCityById);

// Admin routes
router.post('/', protect, admin, createCity);
router.put('/:id', protect, admin, updateCity);
router.delete('/:id', protect, admin, deleteCity);

module.exports = router;
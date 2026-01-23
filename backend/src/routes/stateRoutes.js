const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  getStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  getFeaturedStates,
} = require('../controllers/stateController');

// Public routes
router.get('/', getStates);
router.get('/featured', getFeaturedStates);
router.get('/:id', getStateById);

// Admin routes
router.post('/', protect, admin, createState);
router.put('/:id', protect, admin, updateState);
router.delete('/:id', protect, admin, deleteState);

module.exports = router;
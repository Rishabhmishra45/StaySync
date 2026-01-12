// src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { featured } = req.query;
    
    let filter = { available: true };
    
    // Add featured filter if requested
    if (featured === 'true') {
      filter.featured = true;
    }
    
    const rooms = await Room.find(filter);
    res.json({
      success: true,
      message: 'Rooms retrieved successfully',
      data: rooms
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get featured rooms
// @route   GET /api/rooms/featured
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const rooms = await Room.find({ 
      featured: true, 
      available: true 
    }).limit(6);
    
    res.json({
      success: true,
      message: 'Featured rooms retrieved successfully',
      data: rooms
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room retrieved successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create room (admin only)
// @route   POST /api/rooms
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const roomData = req.body;
    roomData.createdBy = req.user.id;
    
    const room = await Room.create(roomData);
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update room (admin only)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    Object.assign(room, req.body);
    await room.save();

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete room (admin only)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await room.deleteOne();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    // Get room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check availability
    if (!room.isAvailable(checkIn, checkOut)) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for the selected dates'
      });
    }

    // Calculate total
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = nights * room.pricePerNight;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      paymentMethod: 'stripe',
      nights,
      roomSnapshot: {
        name: room.name,
        type: room.type,
        pricePerNight: room.pricePerNight,
        images: room.images.map(img => img.url)
      }
    });

    // Add booked dates to room
    room.bookedDates.push({
      from: checkIn,
      to: checkOut,
      bookingId: booking._id
    });
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'name type pricePerNight images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name type')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Remove booked dates from room
    const room = await Room.findById(booking.room);
    if (room) {
      room.bookedDates = room.bookedDates.filter(
        date => date.bookingId.toString() !== booking._id.toString()
      );
      await room.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
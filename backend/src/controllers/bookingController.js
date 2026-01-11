const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'name type pricePerNight images')
      .sort({ createdAt: -1 });

    // Return bookings directly in data property (not nested)
    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings  // Send bookings array directly
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentMethod = 'stripe', specialRequests } = req.body;

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

    // Check guests capacity
    const totalGuests = guests?.adults || 1;
    if (totalGuests > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `Room capacity is ${room.capacity} guests`
      });
    }

    // Calculate total amount
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
      guests: guests || { adults: 1, children: 0, infants: 0 },
      totalAmount,
      paymentMethod,
      specialRequests,
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

    // Populate the booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name type pricePerNight images');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
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
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);
    
    const bookings = await Booking.find(filter)
      .populate('room', 'name type pricePerNight images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'name type pricePerNight images amenities')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized (admin or booking owner)
    if (
      req.user.role !== 'admin' &&
      booking.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
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

    // Check if booking can be cancelled
    const hoursUntilCheckIn = (new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilCheckIn < 24 && booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 24 hours before check-in'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
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

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (status) {
      // If checking in/out, set timestamps
      if (status === 'checked_in' && !booking.checkedInAt) {
        booking.checkedInAt = new Date();
      }
      if (status === 'checked_out' && !booking.checkedOutAt) {
        booking.checkedOutAt = new Date();
      }
      booking.status = status;
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name type')
      .populate('user', 'name email');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { ROOM_TYPES, AMENITIES, SORT_OPTIONS } = require('../utils/constants');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const {
    type,
    minPrice,
    maxPrice,
    capacity,
    amenities,
    sort = 'newest',
    page = 1,
    limit = 10,
    search,
    available,
    featured,
  } = req.query;

  // Build filter
  const filter = {};

  if (type) filter.type = type;
  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }
  if (capacity) filter.capacity = { $gte: Number(capacity) };
  if (amenities) {
    const amenitiesArray = amenities.split(',');
    filter.amenities = { $all: amenitiesArray };
  }
  if (available !== undefined) filter.available = available === 'true';
  if (featured !== undefined) filter.featured = featured === 'true';
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort
  let sortOption = { createdAt: -1 }; // Default: newest first
  switch (sort) {
    case SORT_OPTIONS.PRICE_ASC:
      sortOption = { pricePerNight: 1 };
      break;
    case SORT_OPTIONS.PRICE_DESC:
      sortOption = { pricePerNight: -1 };
      break;
    case SORT_OPTIONS.RATING_DESC:
      sortOption = { rating: -1 };
      break;
  }

  // Pagination
  const skip = (page - 1) * limit;
  
  // Get total count
  const total = await Room.countDocuments(filter);
  
  // Get rooms
  const rooms = await Room.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate('reviews');

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  res.json(
    ApiResponse.success('Rooms retrieved successfully', rooms, {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    })
  );
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate('reviews');

  if (!room) {
    throw new ApiError('Room not found', 404);
  }

  res.json(ApiResponse.success('Room retrieved successfully', room));
});

// @desc    Create room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = asyncHandler(async (req, res) => {
  const roomData = req.body;
  
  // Add createdBy field
  roomData.createdBy = req.user.id;
  
  // If images are uploaded, process them
  if (req.files && req.files.images) {
    // This would be handled by upload middleware
    // Images would already be uploaded to Cloudinary
  }

  const room = await Room.create(roomData);

  res.status(201).json(
    ApiResponse.success('Room created successfully', room)
  );
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError('Room not found', 404);
  }

  // Update room
  Object.assign(room, req.body);
  await room.save();

  res.json(ApiResponse.success('Room updated successfully', room));
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError('Room not found', 404);
  }

  // Check if room has active bookings
  const activeBookings = await Booking.findOne({
    room: room._id,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (activeBookings) {
    throw new ApiError(
      'Cannot delete room with active bookings. Cancel bookings first.',
      400
    );
  }

  // Delete room
  await room.deleteOne();

  res.json(ApiResponse.success('Room deleted successfully'));
});

// @desc    Check room availability
// @route   GET /api/rooms/:id/availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    throw new ApiError('Check-in and check-out dates are required', 400);
  }

  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError('Room not found', 404);
  }

  const isAvailable = room.isAvailable(checkIn, checkOut);

  res.json(
    ApiResponse.success('Availability checked successfully', {
      available: isAvailable,
      checkIn,
      checkOut,
    })
  );
});

// @desc    Get featured rooms
// @route   GET /api/rooms/featured
// @access  Public
const getFeaturedRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ featured: true, available: true })
    .limit(6)
    .sort({ rating: -1 });

  res.json(ApiResponse.success('Featured rooms retrieved successfully', rooms));
});

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  getFeaturedRooms,
};
const asyncHandler = require('express-async-handler');
const City = require('../models/City');
const State = require('../models/State');
const Room = require('../models/Room');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// @desc    Get cities by state
// @route   GET /api/cities/state/:stateId
// @access  Public
const getCitiesByState = asyncHandler(async (req, res) => {
  const { stateId } = req.params;
  const { popular } = req.query;

  const filter = { state: stateId, isActive: true };
  if (popular === 'true') filter.popular = true;

  const cities = await City.find(filter)
    .sort({ order: 1, name: 1 })
    .populate('state', 'name');

  res.json(
    ApiResponse.success('Cities retrieved successfully', cities)
  );
});

// @desc    Get single city with hotels
// @route   GET /api/cities/:id
// @access  Public
const getCityById = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id)
    .populate('state', 'name');

  if (!city) {
    throw new ApiError('City not found', 404);
  }

  const rooms = await Room.find({ 
    city: city._id, 
    available: true 
  }).populate('state', 'name');

  const response = {
    ...city.toObject(),
    rooms,
  };

  res.json(
    ApiResponse.success('City retrieved successfully', response)
  );
});

// @desc    Create city
// @route   POST /api/cities
// @access  Private/Admin
const createCity = asyncHandler(async (req, res) => {
  const { state } = req.body;
  
  // Verify state exists
  const stateExists = await State.findById(state);
  if (!stateExists) {
    throw new ApiError('State not found', 404);
  }

  const city = await City.create(req.body);

  res.status(201).json(
    ApiResponse.success('City created successfully', city)
  );
});

// @desc    Update city
// @route   PUT /api/cities/:id
// @access  Private/Admin
const updateCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);

  if (!city) {
    throw new ApiError('City not found', 404);
  }

  Object.assign(city, req.body);
  await city.save();

  res.json(
    ApiResponse.success('City updated successfully', city)
  );
});

// @desc    Delete city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
const deleteCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);

  if (!city) {
    throw new ApiError('City not found', 404);
  }

  // Check if city has rooms
  const roomsCount = await Room.countDocuments({ city: city._id });
  if (roomsCount > 0) {
    throw new ApiError('Cannot delete city with existing rooms', 400);
  }

  await city.deleteOne();

  res.json(
    ApiResponse.success('City deleted successfully')
  );
});

module.exports = {
  getCitiesByState,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
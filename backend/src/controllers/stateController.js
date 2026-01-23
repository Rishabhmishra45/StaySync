const asyncHandler = require('express-async-handler');
const State = require('../models/State');
const City = require('../models/City');
const Room = require('../models/Room');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// @desc    Get all states
// @route   GET /api/states
// @access  Public
const getStates = asyncHandler(async (req, res) => {
  const { featured, active } = req.query;
  
  const filter = {};
  if (featured === 'true') filter.featured = true;
  if (active === 'true') filter.isActive = true;

  const states = await State.find(filter)
    .sort({ order: 1, name: 1 })
    .populate('cities');

  res.json(
    ApiResponse.success('States retrieved successfully', states)
  );
});

// @desc    Get single state with hotels
// @route   GET /api/states/:id
// @access  Public
const getStateById = asyncHandler(async (req, res) => {
  const state = await State.findById(req.params.id);
  
  if (!state) {
    throw new ApiError('State not found', 404);
  }

  const cities = await City.find({ state: state._id, isActive: true })
    .sort({ order: 1, name: 1 });

  const rooms = await Room.find({ state: state._id, available: true })
    .populate('city')
    .limit(20);

  const response = {
    ...state.toObject(),
    cities,
    rooms,
  };

  res.json(
    ApiResponse.success('State retrieved successfully', response)
  );
});

// @desc    Create state
// @route   POST /api/states
// @access  Private/Admin
const createState = asyncHandler(async (req, res) => {
  const state = await State.create(req.body);

  res.status(201).json(
    ApiResponse.success('State created successfully', state)
  );
});

// @desc    Update state
// @route   PUT /api/states/:id
// @access  Private/Admin
const updateState = asyncHandler(async (req, res) => {
  const state = await State.findById(req.params.id);

  if (!state) {
    throw new ApiError('State not found', 404);
  }

  Object.assign(state, req.body);
  await state.save();

  res.json(
    ApiResponse.success('State updated successfully', state)
  );
});

// @desc    Delete state
// @route   DELETE /api/states/:id
// @access  Private/Admin
const deleteState = asyncHandler(async (req, res) => {
  const state = await State.findById(req.params.id);

  if (!state) {
    throw new ApiError('State not found', 404);
  }

  // Check if state has rooms
  const roomsCount = await Room.countDocuments({ state: state._id });
  if (roomsCount > 0) {
    throw new ApiError('Cannot delete state with existing rooms', 400);
  }

  // Check if state has cities
  const citiesCount = await City.countDocuments({ state: state._id });
  if (citiesCount > 0) {
    throw new ApiError('Cannot delete state with existing cities', 400);
  }

  await state.deleteOne();

  res.json(
    ApiResponse.success('State deleted successfully')
  );
});

// @desc    Get featured states
// @route   GET /api/states/featured
// @access  Public
const getFeaturedStates = asyncHandler(async (req, res) => {
  const states = await State.find({ 
    featured: true, 
    isActive: true 
  })
    .sort({ order: 1 })
    .limit(8);

  // Get hotel counts for each state
  const statesWithCounts = await Promise.all(
    states.map(async (state) => {
      const hotelsCount = await Room.countDocuments({ 
        state: state._id, 
        available: true 
      });
      return {
        ...state.toObject(),
        hotelsCount,
      };
    })
  );

  res.json(
    ApiResponse.success('Featured states retrieved successfully', statesWithCounts)
  );
});

module.exports = {
  getStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  getFeaturedStates,
};
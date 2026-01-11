const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(filter);
  
  const users = await User.find(filter)
    .select('-password')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(total / limit);

  res.json(
    ApiResponse.success('Users retrieved successfully', users, {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  );
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  res.json(
    ApiResponse.success('Profile retrieved successfully', user.getProfile())
  );
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, preferences } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) {
    user.address = {
      ...user.address,
      ...address
    };
  }
  if (preferences) {
    user.preferences = {
      ...user.preferences,
      ...preferences
    };
  }

  await user.save();

  res.json(
    ApiResponse.success('Profile updated successfully', user.getProfile())
  );
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Prevent updating own role
  if (req.body.role && req.params.id === req.user.id) {
    throw new ApiError('Cannot update your own role', 400);
  }

  // Update user
  Object.keys(req.body).forEach(key => {
    if (key !== 'password') { // Password updates handled separately
      user[key] = req.body[key];
    }
  });

  await user.save();

  res.json(
    ApiResponse.success('User updated successfully', user.getProfile())
  );
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Prevent deleting self
  if (req.params.id === req.user.id) {
    throw new ApiError('Cannot delete your own account', 400);
  }

  await user.deleteOne();

  res.json(
    ApiResponse.success('User deleted successfully')
  );
});

// @desc    Toggle user active status
// @route   PATCH /api/users/:id/toggle-active
// @access  Private/Admin
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Prevent deactivating self
  if (req.params.id === req.user.id) {
    throw new ApiError('Cannot deactivate your own account', 400);
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json(
    ApiResponse.success(
      `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      { isActive: user.isActive }
    )
  );
});

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
  updateUser,
  deleteUser,
  toggleUserActive
};
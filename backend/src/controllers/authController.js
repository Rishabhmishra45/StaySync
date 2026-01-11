const asyncHandler = require('express-async-handler');
const User = require('../src/models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../utils/constants');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = USER_ROLES.CUSTOMER } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate token
  const token = user.generateAuthToken();

  // Remove password from response
  const userResponse = user.getProfile();

  res.status(201).json(
    ApiResponse.success('User registered successfully', {
      token,
      user: userResponse,
    })
  );
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError('Account is deactivated', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = user.generateAuthToken();

  // Remove password from response
  const userResponse = user.getProfile();

  res.json(
    ApiResponse.success('Login successful', {
      token,
      user: userResponse,
    })
  );
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  res.json(
    ApiResponse.success('User retrieved successfully', user.getProfile())
  );
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, preferences } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = { ...user.address, ...address };
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  await user.save();

  res.json(
    ApiResponse.success('Profile updated successfully', user.getProfile())
  );
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // In JWT-based auth, logout is handled client-side by removing token
  res.json(ApiResponse.success('Logout successful'));
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Check current password
  const isPasswordMatch = await user.comparePassword(currentPassword);

  if (!isPasswordMatch) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json(ApiResponse.success('Password changed successfully'));
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  changePassword,
};
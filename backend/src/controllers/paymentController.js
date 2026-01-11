const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId, amount } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user.id,
  });

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  // Verify amount matches booking total
  if (amount !== booking.totalAmount) {
    throw new ApiError('Amount does not match booking total', 400);
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      bookingId: booking._id.toString(),
      userId: req.user.id,
    },
  });

  res.json(
    ApiResponse.success('Payment intent created successfully', {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  );
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, bookingId } = req.body;

  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new ApiError('Payment not successful', 400);
  }

  // Update booking payment status
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  // Verify payment intent amount matches booking amount
  const paidAmount = paymentIntent.amount / 100; // Convert from cents
  if (paidAmount !== booking.totalAmount) {
    throw new ApiError('Payment amount mismatch', 400);
  }

  // Update booking
  booking.paymentStatus = 'completed';
  booking.paymentId = paymentIntentId;
  booking.status = 'confirmed';
  await booking.save();

  res.json(
    ApiResponse.success('Payment confirmed successfully', {
      booking: booking.getSummary(),
    })
  );
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  // For demo purposes, return static payment methods
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: 'credit-card',
      enabled: true,
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      icon: 'credit-card',
      enabled: true,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: 'stripe',
      enabled: !!process.env.STRIPE_SECRET_KEY,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'paypal',
      enabled: false, // Would require PayPal integration
    },
    {
      id: 'cash',
      name: 'Cash',
      icon: 'dollar-sign',
      enabled: true,
    },
  ];

  res.json(
    ApiResponse.success(
      'Payment methods retrieved successfully',
      paymentMethods.filter((method) => method.enabled)
    )
  );
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
};
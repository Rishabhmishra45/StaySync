const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        min: [1, 'At least 1 adult is required'],
        default: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: [0, 'Children cannot be negative'],
      },
      infants: {
        type: Number,
        default: 0,
        min: [0, 'Infants cannot be negative'],
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    cancellationReason: String,
    checkedInAt: Date,
    checkedOutAt: Date,
    nights: {
      type: Number,
      required: true,
      min: [1, 'Minimum 1 night required'],
    },
    roomSnapshot: {
      name: String,
      type: String,
      pricePerNight: Number,
      images: [String],
    },
    userSnapshot: {
      name: String,
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ paymentStatus: 1 });

// Virtual for calculating duration
bookingSchema.virtual('duration').get(function () {
  return this.nights;
});

// Pre-save middleware
bookingSchema.pre('save', function (next) {
  // Calculate nights
  const checkIn = new Date(this.checkIn);
  const checkOut = new Date(this.checkOut);
  this.nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function () {
  const hoursUntilCheckIn = (new Date(this.checkIn) - new Date()) / (1000 * 60 * 60);
  return hoursUntilCheckIn > 24 && this.status === 'confirmed';
};

// Method to get booking summary
bookingSchema.methods.getSummary = function () {
  return {
    _id: this._id,
    checkIn: this.checkIn,
    checkOut: this.checkOut,
    nights: this.nights,
    totalAmount: this.totalAmount,
    status: this.status,
    paymentStatus: this.paymentStatus,
    room: this.roomSnapshot,
    createdAt: this.createdAt,
  };
};

// Method to generate invoice
bookingSchema.methods.generateInvoice = function () {
  return {
    bookingId: this._id,
    invoiceNumber: `INV-${this._id.toString().slice(-8).toUpperCase()}`,
    date: this.createdAt,
    guest: this.userSnapshot,
    room: this.roomSnapshot,
    checkIn: this.checkIn,
    checkOut: this.checkOut,
    nights: this.nights,
    subtotal: this.totalAmount,
    tax: this.totalAmount * 0.1, // 10% tax
    total: this.totalAmount * 1.1,
    paymentMethod: this.paymentMethod,
    paymentStatus: this.paymentStatus,
  };
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
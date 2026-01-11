const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide room name'],
      trim: true,
      maxlength: [100, 'Room name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide room description'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify room type'],
      enum: ['single', 'double', 'suite', 'deluxe', 'presidential'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify room capacity'],
      min: [1, 'Capacity must be at least 1'],
      max: [10, 'Capacity cannot exceed 10'],
    },
    size: {
      type: Number,
      required: [true, 'Please provide room size'],
      min: [1, 'Size must be at least 1 sqft'],
    },
    beds: {
      type: String,
      required: [true, 'Please specify beds'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [1, 'Must have at least 1 bathroom'],
    },
    floor: {
      type: Number,
      required: [true, 'Please specify floor'],
      min: [1, 'Floor must be at least 1'],
    },
    images: [
      {
        url: String,
        publicId: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    amenities: [
      {
        type: String,
        enum: [
          'wifi',
          'tv',
          'ac',
          'heating',
          'minibar',
          'safe',
          'balcony',
          'pool_view',
          'sea_view',
          'breakfast_included',
          'room_service',
          'parking',
          'gym_access',
          'spa_access',
          'laundry',
        ],
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
    parkingIncluded: {
      type: Boolean,
      default: false,
    },
    breakfastIncluded: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    bookedDates: [
      {
        from: Date,
        to: Date,
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
roomSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'room',
});

// Indexes for better query performance
roomSchema.index({ type: 1, pricePerNight: 1 });
roomSchema.index({ available: 1 });
roomSchema.index({ featured: 1 });
roomSchema.index({ rating: -1 });
roomSchema.index({ 'bookedDates.from': 1, 'bookedDates.to': 1 });

// Method to check if room is available for dates
roomSchema.methods.isAvailable = function (checkIn, checkOut) {
  if (!this.available) return false;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  for (const bookedDate of this.bookedDates) {
    const bookedFrom = new Date(bookedDate.from);
    const bookedTo = new Date(bookedDate.to);

    // Check for overlap
    if (
      (checkInDate >= bookedFrom && checkInDate < bookedTo) ||
      (checkOutDate > bookedFrom && checkOutDate <= bookedTo) ||
      (checkInDate <= bookedFrom && checkOutDate >= bookedTo)
    ) {
      return false;
    }
  }

  return true;
};

// Method to calculate total price
roomSchema.methods.calculateTotalPrice = function (checkIn, checkOut) {
  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );
  return nights * this.pricePerNight;
};

// Method to get room summary
roomSchema.methods.getSummary = function () {
  return {
    _id: this._id,
    name: this.name,
    type: this.type,
    pricePerNight: this.pricePerNight,
    capacity: this.capacity,
    images: this.images,
    rating: this.rating,
    reviewsCount: this.reviewsCount,
    available: this.available,
    featured: this.featured,
  };
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
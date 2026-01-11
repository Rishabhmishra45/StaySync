const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a review title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpful: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Compound index for room reviews
reviewSchema.index({ room: 1, createdAt: -1 });

// Pre-save middleware to update room rating
reviewSchema.post('save', async function () {
  const Review = this.constructor;
  
  const stats = await Review.aggregate([
    {
      $match: { room: this.room }
    },
    {
      $group: {
        _id: '$room',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Room').findByIdAndUpdate(this.room, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewsCount: stats[0].numberOfReviews
    });
  }
});

// Pre-remove middleware to update room rating
reviewSchema.post('remove', async function () {
  const Review = this.constructor;
  
  const stats = await Review.aggregate([
    {
      $match: { room: this.room }
    },
    {
      $group: {
        _id: '$room',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Room').findByIdAndUpdate(this.room, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewsCount: stats[0].numberOfReviews
    });
  } else {
    await mongoose.model('Room').findByIdAndUpdate(this.room, {
      rating: 0,
      reviewsCount: 0
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
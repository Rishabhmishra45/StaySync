const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      maxlength: [100, 'City name cannot exceed 100 characters'],
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hotelsCount: {
      type: Number,
      default: 0,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for rooms
citySchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'city',
});

// Indexes
citySchema.index({ name: 1 });
citySchema.index({ state: 1 });
citySchema.index({ isActive: 1 });
citySchema.index({ popular: 1 });

const City = mongoose.model('City', citySchema);

module.exports = City;
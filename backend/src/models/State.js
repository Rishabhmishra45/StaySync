const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'State name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'State name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        image: {
            url: String,
            publicId: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        hotelsCount: {
            type: Number,
            default: 0,
        },
        featured: {
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

// Virtual for cities
stateSchema.virtual('cities', {
    ref: 'City',
    localField: '_id',
    foreignField: 'state',
});

// Virtual for rooms
stateSchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'state',
});

// Indexes
stateSchema.index({ name: 1 });
stateSchema.index({ isActive: 1 });
stateSchema.index({ featured: 1 });
stateSchema.index({ order: 1 });

const State = mongoose.model('State', stateSchema);

module.exports = State;
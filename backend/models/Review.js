const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  ratings: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    accuracy: { type: Number, min: 1, max: 5 },
    checkin: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  hostResponse: {
    comment: String,
    respondedAt: Date
  },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

// One review per booking
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ property: 1, guest: 1 });

// Update property rating after review
reviewSchema.post('save', async function () {
  const Property = mongoose.model('Property');
  const Review = mongoose.model('Review');

  const stats = await Review.aggregate([
    { $match: { property: this.property, isVisible: true } },
    { $group: { _id: '$property', avgRating: { $avg: '$ratings.overall' }, count: { $sum: 1 } } }
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(this.property, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);

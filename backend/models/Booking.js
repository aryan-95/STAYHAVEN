const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
    pets: { type: Number, default: 0 }
  },
  totalGuests: { type: Number, required: true },
  nights: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  },
  paymentMethod: { type: String, default: 'card' },
  specialRequests: { type: String, default: '', maxlength: 500 },
  confirmationCode: { type: String, unique: true },
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  hasReview: { type: Boolean, default: false }
}, { timestamps: true });

// Generate confirmation code
bookingSchema.pre('save', function (next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'SH' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

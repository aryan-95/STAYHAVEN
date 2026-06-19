const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['beach', 'mountain', 'city', 'countryside', 'lake', 'desert', 'cabin', 'villa', 'apartment', 'treehouse', 'boat', 'farm']
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String }
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    zipCode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [1, 'Price must be at least 1']
  },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  bedrooms: { type: Number, required: true, min: 0 },
  beds: { type: Number, required: true, min: 1 },
  bathrooms: { type: Number, required: true, min: 0.5 },
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Heating',
      'TV', 'Pool', 'Hot Tub', 'Free Parking', 'EV Charger',
      'Gym', 'BBQ Grill', 'Fireplace', 'Balcony', 'Garden',
      'Beach Access', 'Ski Access', 'Breakfast Included',
      'Workspace', 'Pet Friendly', 'Wheelchair Accessible'
    ]
  }],
  houseRules: {
    checkIn: { type: String, default: '15:00' },
    checkOut: { type: String, default: '11:00' },
    noSmoking: { type: Boolean, default: true },
    noPets: { type: Boolean, default: false },
    noParties: { type: Boolean, default: true },
    selfCheckIn: { type: Boolean, default: false }
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  bookedDates: [{
    checkIn: Date,
    checkOut: Date,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }]
}, { timestamps: true });

// Index for search
propertySchema.index({ 'location.city': 'text', 'location.country': 'text', title: 'text' });
propertySchema.index({ pricePerNight: 1, rating: -1 });

module.exports = mongoose.model('Property', propertySchema);

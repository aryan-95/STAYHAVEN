const Property = require('../models/Property');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @GET /api/properties
exports.getProperties = async (req, res) => {
  try {
    const {
      search, category, minPrice, maxPrice, guests,
      bedrooms, bathrooms, amenities, sortBy = 'createdAt',
      order = 'desc', page = 1, limit = 12
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (guests) query.guests = { $gte: Number(guests) };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    const sortOptions = {};
    if (sortBy === 'price') sortOptions.pricePerNight = order === 'asc' ? 1 : -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('host', 'name avatar rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/:id
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('host', 'name avatar bio phone createdAt');

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, host: req.user._id });
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, property: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Property.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/host/my-properties
exports.getHostProperties = async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/host/stats
exports.getHostStats = async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user._id, isActive: true });
    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({ host: req.user._id });
    const totalEarnings = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyBookings = bookings.filter(b => new Date(b.createdAt) >= thisMonth);
    const monthlyEarnings = monthlyBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      success: true,
      stats: {
        totalProperties: properties.length,
        totalBookings: bookings.length,
        totalEarnings,
        monthlyEarnings,
        monthlyBookings: monthlyBookings.length,
        avgRating: properties.reduce((sum, p) => sum + p.rating, 0) / (properties.length || 1)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/host/bookings
exports.getHostBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate('property', 'title images location')
      .populate('guest', 'name avatar email')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/featured
exports.getFeatured = async (req, res) => {
  try {
    const properties = await Property.find({ isActive: true, isFeatured: true })
      .populate('host', 'name avatar')
      .limit(6);
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [users, properties, bookings, reviews] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Review.countDocuments()
    ]);

    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentBookings = await Booking.find()
      .populate('property', 'title')
      .populate('guest', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users, properties, bookings, reviews,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await User.countDocuments();
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('host', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/admin/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title')
      .populate('guest', 'name email')
      .populate('host', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { bookingId, ratings, comment } = req.body;

    const booking = await Booking.findById(bookingId).populate('property');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the guest can review this booking' });
    }

    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review confirmed bookings' });
    }

    if (booking.hasReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      property: booking.property._id,
      guest: req.user._id,
      booking: bookingId,
      ratings,
      comment
    });

    await Booking.findByIdAndUpdate(bookingId, { hasReview: true });

    const populated = await Review.findById(review._id).populate('guest', 'name avatar createdAt');
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this booking' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/reviews/property/:propertyId
exports.getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId, isVisible: true })
      .populate('guest', 'name avatar createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.guest.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

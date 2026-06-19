const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, specialRequests } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ success: false, message: 'Check-in cannot be in the past' });
    }

    // Check availability
    const conflict = property.bookedDates.some(bd => {
      const bookedIn = new Date(bd.checkIn);
      const bookedOut = new Date(bd.checkOut);
      return checkInDate < bookedOut && checkOutDate > bookedIn;
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'Property is not available for these dates' });
    }

    const totalGuests = (guests.adults || 1) + (guests.children || 0);
    if (totalGuests > property.guests) {
      return res.status(400).json({ success: false, message: `Property max guests is ${property.guests}` });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const subtotal = nights * property.pricePerNight;
    const cleaningFee = property.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * 0.12);
    const taxes = Math.round(subtotal * 0.08);
    const totalPrice = subtotal + cleaningFee + serviceFee + taxes;

    const booking = await Booking.create({
      property: propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalGuests,
      nights,
      pricePerNight: property.pricePerNight,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes,
      totalPrice,
      specialRequests
    });

    // Block these dates on the property
    await Property.findByIdAndUpdate(propertyId, {
      $push: { bookedDates: { checkIn: checkInDate, checkOut: checkOutDate, bookingId: booking._id } }
    });

    const populated = await Booking.findById(booking._id)
      .populate('property', 'title images location pricePerNight')
      .populate('guest', 'name email avatar')
      .populate('host', 'name email avatar');

    res.status(201).json({ success: true, booking: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('property', 'title images location pricePerNight rating category')
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title images location pricePerNight houseRules amenities')
      .populate('guest', 'name email avatar phone')
      .populate('host', 'name email avatar phone bio');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (
      booking.guest._id.toString() !== req.user._id.toString() &&
      booking.host._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.guest.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by guest';
    booking.cancelledAt = new Date();
    await booking.save();

    // Remove from property booked dates
    await Property.findByIdAndUpdate(booking.property, {
      $pull: { bookedDates: { bookingId: booking._id } }
    });

    res.json({ success: true, booking, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/check-availability
exports.checkAvailability = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.query;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflict = property.bookedDates.some(bd => {
      const bookedIn = new Date(bd.checkIn);
      const bookedOut = new Date(bd.checkOut);
      return checkInDate < bookedOut && checkOutDate > bookedIn;
    });

    res.json({ success: true, available: !conflict, bookedDates: property.bookedDates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

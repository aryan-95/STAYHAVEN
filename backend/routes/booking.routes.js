const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getBooking, cancelBooking, checkAvailability
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/check-availability', checkAvailability);
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

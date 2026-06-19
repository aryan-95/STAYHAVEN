const express = require('express');
const router = express.Router();
const {
  getProperties, getProperty, createProperty, updateProperty,
  deleteProperty, getHostProperties, getHostStats, getHostBookings, getFeatured
} = require('../controllers/property.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/featured', getFeatured);
router.get('/host/my-properties', protect, authorize('host', 'admin'), getHostProperties);
router.get('/host/stats', protect, authorize('host', 'admin'), getHostStats);
router.get('/host/bookings', protect, authorize('host', 'admin'), getHostBookings);

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', protect, authorize('host', 'admin'), createProperty);
router.put('/:id', protect, authorize('host', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('host', 'admin'), deleteProperty);

module.exports = router;

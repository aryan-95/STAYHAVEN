const express = require('express');
const router = express.Router();
const { getStats, getUsers, toggleUserStatus, getProperties, deleteProperty, getBookings } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/properties', getProperties);
router.delete('/properties/:id', deleteProperty);
router.get('/bookings', getBookings);

module.exports = router;

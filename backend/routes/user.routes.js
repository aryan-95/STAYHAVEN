const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, toggleWishlist, getWishlist } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:propertyId', protect, toggleWishlist);

module.exports = router;

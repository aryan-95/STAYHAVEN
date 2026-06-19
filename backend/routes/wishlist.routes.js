const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getWishlist, toggleWishlist } = require('../controllers/user.controller');

router.get('/', protect, getWishlist);
router.post('/:propertyId', protect, toggleWishlist);

module.exports = router;

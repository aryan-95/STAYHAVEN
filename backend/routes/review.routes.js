// review.routes.js
const express = require('express');
const router = express.Router();
const { createReview, getPropertyReviews, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createReview);
router.get('/property/:propertyId', getPropertyReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;

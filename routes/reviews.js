const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews')
const { validateReviews, isReviewAuthor, isLoggedIn } = require('../middleware');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReviews,  catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
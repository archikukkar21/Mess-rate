const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// @route POST /api/reviews — Submit a review
router.post('/', protect, async (req, res) => {
  try {
    const { hostel, mealTiming, date, ratings, comment, menuItems } = req.body;

    const existing = await Review.findOne({
      user: req.user._id,
      hostel,
      mealTiming,
      date
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this meal for the selected hostel and date'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      hostel,
      mealTiming,
      date,
      ratings,
      comment,
      menuItems
    });

    await review.populate('user', 'fullName uid hostel');

    res.status(201).json({ success: true, message: 'Review submitted!', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/reviews — Get all reviews (with filters)
router.get('/', async (req, res) => {
  try {
    const { hostel, mealTiming, date, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (hostel) filter.hostel = hostel;
    if (mealTiming) filter.mealTiming = mealTiming;
    if (date) filter.date = date;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('user', 'fullName uid hostel')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/reviews/my — Get logged-in user's reviews
router.get('/my', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/reviews/stats — Hostel/meal stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: { hostel: '$hostel', mealTiming: '$mealTiming' },
          avgTaste: { $avg: '$ratings.taste' },
          avgHygiene: { $avg: '$ratings.hygiene' },
          avgQuantity: { $avg: '$ratings.quantity' },
          avgVariety: { $avg: '$ratings.variety' },
          avgOverall: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 }
        }
      },
      {
        $project: {
          hostel: '$_id.hostel',
          mealTiming: '$_id.mealTiming',
          avgTaste: { $round: ['$avgTaste', 1] },
          avgHygiene: { $round: ['$avgHygiene', 1] },
          avgQuantity: { $round: ['$avgQuantity', 1] },
          avgVariety: { $round: ['$avgVariety', 1] },
          avgOverall: { $round: ['$avgOverall', 1] },
          totalReviews: 1,
          _id: 0
        }
      },
      { $sort: { avgOverall: -1 } }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/reviews/:id — Delete own review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

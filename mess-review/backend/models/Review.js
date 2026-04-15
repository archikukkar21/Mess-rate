const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostel: {
    type: String,
    required: [true, 'Hostel is required'],
    enum: ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E']
  },
  mealTiming: {
    type: String,
    required: [true, 'Meal timing is required'],
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  ratings: {
    taste: { type: Number, required: true, min: 1, max: 5 },
    hygiene: { type: Number, required: true, min: 1, max: 5 },
    quantity: { type: Number, required: true, min: 1, max: 5 },
    variety: { type: Number, required: true, min: 1, max: 5 }
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true
  },
  menuItems: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate overall rating before save
reviewSchema.pre('save', function (next) {
  const { taste, hygiene, quantity, variety } = this.ratings;
  this.overallRating = parseFloat(((taste + hygiene + quantity + variety) / 4).toFixed(1));
  next();
});

// Prevent duplicate review per user per hostel per meal per date
reviewSchema.index({ user: 1, hostel: 1, mealTiming: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);

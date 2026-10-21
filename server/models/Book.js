// server/models/Book.js
// Mongoose schema and model for storing PDF books on the Pooja shelf/altar

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // The display title of the book (defaults to original filename if not provided)
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // The unique stored filename inside the /uploads folder
  filename: {
    type: String,
    required: true,
  },
  // Whether the book has been placed on the Saraswati Devi altar
  placed: {
    type: Boolean,
    default: false,
  },
  // The unique owner / devotee ID (isolates each user's personal shelf)
  userId: {
    type: String,
    required: true,
    index: true,
  },
  // When the book was uploaded to the shelf
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);

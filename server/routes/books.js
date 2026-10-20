// server/routes/books.js
// Routes for managing PDF books: upload, list, toggle placed, and delete

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage to keep original extension and ensure unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp and safe characters
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitizedName);
  },
});

// File filter: accept only application/pdf
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Multer upload middleware with 20MB file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max
  },
  fileFilter: fileFilter,
});

/**
 * @route   GET /api/books
 * @desc    Get all books on the shelf/altar
 */
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books from database' });
  }
});

/**
 * @route   POST /api/books
 * @desc    Upload a PDF book to the shelf
 */
router.post('/', upload.single('book'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a PDF file to upload' });
    }

    // If user provided a title, use it. Otherwise, default to original filename without '.pdf'
    let title = req.body.title ? req.body.title.trim() : '';
    if (!title) {
      // Remove extension from original filename
      title = path.parse(req.file.originalname).name;
    }

    const newBook = new Book({
      title: title,
      filename: req.file.filename,
      placed: false,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error uploading book:', error);
    // If an uploaded file was saved before the error, remove it
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Error cleaning up file:', unlinkErr);
      }
    }
    res.status(500).json({ error: error.message || 'Failed to upload book' });
  }
});

/**
 * @route   PATCH /api/books/:id/place
 * @desc    Toggle the 'placed' status of a book (shelf <-> altar)
 */
router.patch('/:id/place', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Toggle placed status
    book.placed = !book.placed;
    await book.save();

    res.json(book);
  } catch (error) {
    console.error('Error toggling placed status:', error);
    res.status(500).json({ error: 'Failed to update book status' });
  }
});

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book record and remove the PDF file from disk
 */
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Path to the physical file
    const filePath = path.join(uploadsDir, book.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (fileErr) {
        console.warn(`Could not delete file ${filePath}:`, fileErr.message);
      }
    }

    // Delete record from MongoDB
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

/**
 * @route   PATCH /api/books/return-all
 * @desc    Pooja Eduppu: return all placed books from the altar back to the shelf
 */
router.patch('/return-all', async (req, res) => {
  try {
    await Book.updateMany({ placed: true }, { placed: false });
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error returning all books:', error);
    res.status(500).json({ error: 'Failed to return books to shelf' });
  }
});

module.exports = router;

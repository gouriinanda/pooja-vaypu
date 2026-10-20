// server/server.js
// Main entry point for the Pooja Vaypu Express backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pooja_vaypu';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Normalize duplicate slashes in URLs (e.g. //api/books -> /api/books)
app.use((req, res, next) => {
  req.url = req.url.replace(/\/{2,}/g, '/');
  next();
});

// Serve uploaded PDF files statically under /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pooja Vaypu server is running smoothly 🪔',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Connect to MongoDB Atlas (or local fallback)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    console.log(' Starting server anyway so routes can be inspected (database operations will fail until MONGO_URI is set correctly in .env)');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT} (without active DB connection)`);
    });
  });

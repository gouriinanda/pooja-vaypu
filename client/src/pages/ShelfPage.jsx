// client/src/pages/ShelfPage.jsx
// Bookshelf view: upload PDF books, view colored spines, open PDFs, toggle altar placement, and delete

import React, { useState, useEffect } from 'react';
import { getBooks, uploadBook, togglePlaceBook, deleteBook, getPdfUrl } from '../api';
import { POOJA_VAYPU_DATE, POOJA_EDUPPU_DATE } from '../config';

// Predefined traditional spine color classes to rotate through
const SPINE_COLORS = [
  'spine-saffron',
  'spine-maroon',
  'spine-gold',
  'spine-green',
  'spine-blue',
  'spine-plum',
  'spine-terracotta',
];

// Slight heights to give authentic shelf variety (in pixels)
const SPINE_HEIGHTS = [240, 255, 230, 265, 245, 250];

export default function ShelfPage() {
  // State for all books fetched from server
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for uploading a new book
  const [titleInput, setTitleInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Feedback notifications
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load books when the component mounts
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books:', err);
      setErrorMessage('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection from the file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate PDF format client-side for immediate feedback
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please select a valid PDF file.');
        setSelectedFile(null);
        return;
      }
      // Check 20MB limit
      if (file.size > 20 * 1024 * 1024) {
        setErrorMessage('File size exceeds 20MB limit.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  // Handle book upload submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose a PDF file to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage('');
      const newBook = await uploadBook(selectedFile, titleInput);
      
      // Prepend the new book to our local list
      setBooks((prev) => [newBook, ...prev]);
      
      // Reset form fields
      setTitleInput('');
      setSelectedFile(null);
      // Reset the file input element value if present
      const fileInputEl = document.getElementById('book-file-input');
      if (fileInputEl) fileInputEl.value = '';

      setSuccessMessage(`"${newBook.title}" was added to the shelf! 📖`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMessage(err.message || 'Failed to upload book.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle toggling placed on altar
  const handleTogglePlace = async (bookId) => {
    try {
      const updated = await togglePlaceBook(bookId);
      // Update local state with the returned book
      setBooks((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
      if (updated.placed) {
        setSuccessMessage(`"${updated.title}" placed on the altar for blessings 🪔`);
      } else {
        setSuccessMessage(`"${updated.title}" returned back to your shelf 📚`);
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Toggle placed error:', err);
      setErrorMessage('Failed to update book status.');
    }
  };

  // Handle book deletion
  const handleDeleteBook = async (bookId, bookTitle) => {
    const confirmDelete = window.confirm(`Remove "${bookTitle}" from your shelf?`);
    if (!confirmDelete) return;

    try {
      await deleteBook(bookId);
      // Remove from local state
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      setSuccessMessage(`"${bookTitle}" was deleted.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage('Failed to delete book.');
    }
  };

  // Handle opening PDF in new tab
  const handleOpenPdf = (filename) => {
    window.open(getPdfUrl(filename), '_blank', 'noopener,noreferrer');
  };

  // Check whether the festival is currently in the sacred resting period
  // (Between POOJA_VAYPU_DATE and POOJA_EDUPPU_DATE)
  const isLockedPeriod = (() => {
    const now = new Date().getTime();
    const vaypu = new Date(`${POOJA_VAYPU_DATE}T00:00:00`).getTime();
    const eduppu = new Date(`${POOJA_EDUPPU_DATE}T08:00:00`).getTime();
    return now >= vaypu && now < eduppu;
  })();

  const placedCount = books.filter((b) => b.placed).length;

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Digital Pooja Shelf</h1>
        <p className="page-description">
          Keep your PDF study books here. Click any book spine to read it, or place it on Saraswati Devi's altar.
        </p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="toast-msg error">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}
      {successMessage && (
        <div className="toast-msg success">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* Upload Card */}
      <div className="upload-card">
        <div className="upload-title-row">
          <span>📜</span>
          <h3>Add a PDF Book to Your Shelf</h3>
        </div>
        
        <form onSubmit={handleUploadSubmit} className="upload-form">
          <div className="form-inputs">
            {/* Optional Title input */}
            <input
              type="text"
              className="input-field"
              placeholder="Book Title (optional, defaults to file name)"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />

            {/* Styled File Input */}
            <div className="file-input-wrapper">
              <label htmlFor="book-file-input" className="file-input-styled">
                <span>📁</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFile ? selectedFile.name : 'Choose PDF file (Max 20MB)...'}
                </span>
              </label>
              <input
                id="book-file-input"
                type="file"
                accept="application/pdf"
                className="file-input-hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Place on Shelf 📥'}
            </button>
          </div>
        </form>
      </div>

      {/* Bookshelf Visual Display */}
      <section className="bookshelf-section">
        <div className="shelf-status-bar">
          <div className="shelf-count">
            Total Books: <strong>{books.length}</strong>
            {books.length > 0 && (
              <span style={{ marginLeft: '1rem', color: 'var(--gold-dark)' }}>
                • On Altar: <strong>{placedCount}</strong> 🪔
              </span>
            )}
          </div>
        </div>

        {/* The Bookshelf Cabinet */}
        <div className="bookshelf-unit">
          {loading ? (
            <div className="empty-shelf-box">
              <div className="empty-icon">🕯️</div>
              <p>Gathering your sacred books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="empty-shelf-box">
              <div className="empty-icon">📖</div>
              <h3 className="empty-title">Your bookshelf is empty</h3>
              <p>Upload a PDF above to begin preparing your books for Pooja Vaypu.</p>
            </div>
          ) : (
            <div className="spines-row">
              {books.map((book, index) => {
                // Determine spine color and height variety deterministically
                const colorClass = SPINE_COLORS[index % SPINE_COLORS.length];
                const heightStyle = `${SPINE_HEIGHTS[index % SPINE_HEIGHTS.length]}px`;

                return (
                  <div key={book._id} className="book-slot">
                    {/* The Clickable Vertical Spine */}
                    <div
                      className={`book-spine ${colorClass} ${book.placed ? 'spine-placed-glow' : ''}`}
                      style={{ height: heightStyle }}
                      onClick={() => handleOpenPdf(book.filename)}
                      title={`Click to read "${book.title}" in a new tab`}
                    >
                      {/* Top decorative gold band or lamp indicator */}
                      {book.placed ? (
                        <span className="placed-lamp-badge" title="Currently on Saraswati Devi's Altar">🪔</span>
                      ) : (
                        <div className="spine-gold-band" />
                      )}

                      {/* Vertical Title */}
                      <div className="spine-title-container">
                        <span className="spine-title">{book.title}</span>
                      </div>

                      {/* Bottom decorative gold band */}
                      <div className="spine-gold-band" />
                    </div>

                    {/* Controls beneath the book */}
                    <div className="book-actions-overlay">
                      {book.placed && isLockedPeriod ? (
                        <button
                          type="button"
                          disabled
                          className="btn-place-toggle is-locked"
                          title="Pooja Eduppu hasn't happened yet! Books must remain sanctified on the altar until Vijayadashami."
                        >
                          🔒 Resting (Locked)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTogglePlace(book._id)}
                          className={`btn-place-toggle ${book.placed ? 'is-placed' : ''}`}
                          title={book.placed ? 'Return this book to the regular shelf' : 'Place this book on the sacred altar'}
                        >
                          {book.placed ? '✓ On Altar' : '+ Altar'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book._id, book.title)}
                        className="btn-delete-book"
                        title="Delete book from shelf"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Wooden Shelf Plank & Edge */}
          <div className="wood-shelf-plank" />
          <div className="wood-shelf-edge" />
        </div>
      </section>
    </div>
  );
}

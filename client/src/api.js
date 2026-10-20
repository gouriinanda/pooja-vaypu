// client/src/api.js
// Centralized API utility for interacting with the Pooja Vaypu Express backend

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Get the full URL to view an uploaded PDF
 */
export const getPdfUrl = (filename) => {
  return `${API_BASE}/uploads/${filename}`;
};

/**
 * Fetch all books from the backend
 */
export const getBooks = async () => {
  const response = await fetch(`${API_BASE}/api/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
};

/**
 * Upload a new PDF book
 * @param {File} file - PDF file object
 * @param {string} title - Optional title (defaults to filename on server if empty)
 */
export const uploadBook = async (file, title) => {
  const formData = new FormData();
  formData.append('book', file);
  if (title && title.trim()) {
    formData.append('title', title.trim());
  }

  let response;
  try {
    response = await fetch(`${API_BASE}/api/books`, {
      method: 'POST',
      body: formData,
    });
  } catch (netErr) {
    throw new Error(
      `Cannot connect to backend (${API_BASE || 'local'}). If using Render free tier, it may be waking up—please try again in 30 seconds.`
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed (Status ${response.status})`);
  }

  return response.json();
};

/**
 * Toggle the 'placed' status of a book (shelf <-> altar)
 * @param {string} id - Book ID
 */
export const togglePlaceBook = async (id) => {
  const response = await fetch(`${API_BASE}/api/books/${id}/place`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to update book status');
  }

  return response.json();
};

/**
 * Delete a book from database and disk
 * @param {string} id - Book ID
 */
export const deleteBook = async (id) => {
  const response = await fetch(`${API_BASE}/api/books/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }

  return response.json();
};

/**
 * Return all placed books back to the shelf (Pooja Eduppu)
 */
export const returnAllBooks = async () => {
  const response = await fetch(`${API_BASE}/api/books/return-all`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to return books to shelf');
  }

  return response.json();
};


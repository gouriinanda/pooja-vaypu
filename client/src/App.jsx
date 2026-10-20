// client/src/App.jsx
// Main application component connecting routes for Shelf, Altar, and Vidyarambham

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ShelfPage from './pages/ShelfPage';
import AltarPage from './pages/AltarPage';
import VidyarambhamPage from './pages/VidyarambhamPage';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Top traditional navigation */}
        <Navbar />

        {/* Route views */}
        <Routes>
          <Route path="/" element={<ShelfPage />} />
          <Route path="/altar" element={<AltarPage />} />
          <Route path="/vidyarambham" element={<VidyarambhamPage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

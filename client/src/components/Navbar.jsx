// client/src/components/Navbar.jsx
// Top navigation bar connecting Shelf, Altar, and Vidyarambham routes with Kerala temple styling

import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand identity: Lamp icon + Title with Malayalam subtitle */}
        <NavLink to="/" className="brand">
          <span className="brand-icon">🪔</span>
          <div>
            <div className="brand-title">Pooja Vaypu</div>
            <div className="brand-subtitle malayalam-text">സരസ്വതീ പൂജ • പുസ്തകം വെയ്പ്പ്</div>
          </div>
        </NavLink>

        {/* Navigation links */}
        <nav className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <span>📚</span> Bookshelf
          </NavLink>
          <NavLink 
            to="/altar" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>🪔</span> Altar
          </NavLink>
          <NavLink 
            to="/vidyarambham" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>✍️</span> Vidyarambham
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

// client/src/components/Nilavilakku.jsx
// Traditional Kerala brass standing lamp (Nilavilakku) drawn with vector SVG
// Clicking toggles the flame with warm flickering animations and radial illumination

import React from 'react';

export default function Nilavilakku({ isLit, onToggle, side = 'left' }) {
  return (
    <div
      className={`nilavilakku-wrapper ${side} ${isLit ? 'lit' : 'unlit'}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
      title={isLit ? "Click to extinguish the lamp" : "Click to light the sacred Nilavilakku"}
    >
      {/* Background glow when lamp is illuminated */}
      {isLit && <div className="lamp-halo-glow" />}

      <svg
        className="nilavilakku-svg"
        viewBox="0 0 120 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Brass metallic gradients */}
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87581B" />
            <stop offset="35%" stopColor="#F5D77F" />
            <stop offset="70%" stopColor="#C9972C" />
            <stop offset="100%" stopColor="#673F0D" />
          </linearGradient>

          <linearGradient id="brassDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5E380E" />
            <stop offset="50%" stopColor="#A87724" />
            <stop offset="100%" stopColor="#432607" />
          </linearGradient>

          <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="40%" stopColor="#FFA500" />
            <stop offset="90%" stopColor="#FFFF66" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#FFFFCC" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* FLAME (Visible only when isLit is true) */}
        {isLit && (
          <g className="lamp-flame-group" filter="url(#flameGlow)">
            {/* Outer flame body */}
            <path
              d="M 60,18 C 53,28 50,38 52,48 C 54,58 66,58 68,48 C 70,38 67,28 60,18 Z"
              fill="url(#flameOuter)"
              className="flame-outer"
            />
            {/* Inner intense flame core */}
            <path
              d="M 60,26 C 56,33 55,40 56,47 C 57,54 63,54 64,47 C 65,40 64,33 60,26 Z"
              fill="url(#flameInner)"
              className="flame-inner"
            />
          </g>
        )}

        {/* THE BRASS NILAVILAKKU STRUCTURE */}

        {/* Wick holder (Thiri peedam) at the top of the bowl */}
        <ellipse cx="60" cy="54" rx="4" ry="2" fill="#3D1D03" />

        {/* Top Pinnacle / Crown (Annapakshi / Bud ornament) */}
        <path
          d="M 60,40 Q 56,46 59,51 L 61,51 Q 64,46 60,40 Z"
          fill="url(#brassGrad)"
          stroke="#5E380E"
          strokeWidth="0.5"
        />

        {/* Upper Oil Plate / Thattu (Circular bowl holding oil & wicks) */}
        {/* Top rim of bowl */}
        <ellipse cx="60" cy="56" rx="28" ry="7" fill="url(#brassGrad)" />
        <ellipse cx="60" cy="55.5" rx="25" ry="5.5" fill="#4B2706" />
        {/* Bowl body sloping down */}
        <path
          d="M 32,56 C 36,68 48,72 60,72 C 72,72 84,68 88,56 Z"
          fill="url(#brassGrad)"
          stroke="#4B2706"
          strokeWidth="0.5"
        />
        {/* Upper decorative lip rings */}
        <rect x="52" y="72" width="16" height="5" rx="2" fill="url(#brassDark)" />

        {/* Central Turned Brass Column (Thandu) with decorative balusters */}
        {/* Upper baluster bulb */}
        <ellipse cx="60" cy="85" rx="10" ry="8" fill="url(#brassGrad)" />
        <rect x="55" y="93" width="10" height="25" rx="2" fill="url(#brassGrad)" />

        {/* Middle decorative disc (Ida thattu) */}
        <ellipse cx="60" cy="120" rx="16" ry="4" fill="url(#brassDark)" />
        <ellipse cx="60" cy="122" rx="14" ry="3" fill="url(#brassGrad)" />

        {/* Middle shaft */}
        <rect x="55" y="125" width="10" height="40" rx="2" fill="url(#brassGrad)" />
        
        {/* Lower baluster bulb */}
        <ellipse cx="60" cy="172" rx="12" ry="10" fill="url(#brassGrad)" />
        <rect x="54" y="182" width="12" height="28" rx="2" fill="url(#brassDark)" />

        {/* Secondary lower rim disc */}
        <ellipse cx="60" cy="212" rx="20" ry="5" fill="url(#brassDark)" />
        <ellipse cx="60" cy="214" rx="18" ry="4" fill="url(#brassGrad)" />

        {/* Stepped Bell-Shaped Base (Adithattu / Peedam) */}
        <path
          d="M 52,216 L 42,246 C 40,252 32,260 22,266 C 18,269 18,272 20,274 L 100,274 C 102,272 102,269 98,266 C 88,260 80,252 78,246 L 68,216 Z"
          fill="url(#brassGrad)"
          stroke="#4B2706"
          strokeWidth="0.75"
        />
        {/* Pedestal base rim */}
        <ellipse cx="60" cy="274" rx="42" ry="7" fill="url(#brassDark)" />
        <path
          d="M 18,274 L 18,284 C 18,288 38,292 60,292 C 82,292 102,288 102,284 L 102,274 Z"
          fill="url(#brassGrad)"
        />
        <ellipse cx="60" cy="284" rx="42" ry="6" fill="#3D1D03" />
      </svg>

      <span className="lamp-hint-label">
        {isLit ? '🔥 Lit' : 'Touch to light'}
      </span>
    </div>
  );
}

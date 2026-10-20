// client/src/components/Garland.jsx
// Traditional Marigold (Chendumalli) and Jasmine (Mulla) garland draped over Saraswati Devi's frame

import React from 'react';

export default function Garland() {
  // Predefined garland flowers: alternating golden marigolds, orange marigolds, and white jasmine clusters
  return (
    <div className="garland-container" aria-hidden="true">
      {/* Top draped garland string */}
      <svg
        className="garland-svg-top"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Marigold radial gradients */}
          <radialGradient id="marigoldOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="60%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#D95300" />
          </radialGradient>
          <radialGradient id="marigoldYellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#CC8400" />
          </radialGradient>
          <radialGradient id="jasmineWhite" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F5F5DC" />
            <stop offset="100%" stopColor="#D4D4B0" />
          </radialGradient>
        </defs>

        {/* Gentle curved garland thread */}
        <path
          d="M 10,10 Q 200,45 390,10"
          fill="none"
          stroke="#556B2F"
          strokeWidth="2.5"
        />

        {/* Dense Marigold and Jasmine clusters following the arch */}
        {[
          { cx: 20, cy: 12, type: 'orange', r: 10 },
          { cx: 38, cy: 16, type: 'jasmine', r: 6 },
          { cx: 55, cy: 20, type: 'yellow', r: 11 },
          { cx: 75, cy: 25, type: 'orange', r: 10 },
          { cx: 95, cy: 29, type: 'jasmine', r: 6 },
          { cx: 115, cy: 32, type: 'yellow', r: 12 },
          { cx: 140, cy: 35, type: 'orange', r: 11 },
          { cx: 162, cy: 37, type: 'jasmine', r: 6 },
          { cx: 180, cy: 38, type: 'yellow', r: 13 },
          { cx: 200, cy: 39, type: 'orange', r: 14 },
          { cx: 220, cy: 38, type: 'yellow', r: 13 },
          { cx: 238, cy: 37, type: 'jasmine', r: 6 },
          { cx: 260, cy: 35, type: 'orange', r: 11 },
          { cx: 285, cy: 32, type: 'yellow', r: 12 },
          { cx: 305, cy: 29, type: 'jasmine', r: 6 },
          { cx: 325, cy: 25, type: 'orange', r: 10 },
          { cx: 345, cy: 20, type: 'yellow', r: 11 },
          { cx: 362, cy: 16, type: 'jasmine', r: 6 },
          { cx: 380, cy: 12, type: 'orange', r: 10 },
        ].map((f, i) => (
          <g key={i}>
            <circle
              cx={f.cx}
              cy={f.cy}
              r={f.r}
              fill={
                f.type === 'orange'
                  ? 'url(#marigoldOrange)'
                  : f.type === 'yellow'
                  ? 'url(#marigoldYellow)'
                  : 'url(#jasmineWhite)'
              }
              stroke={f.type === 'jasmine' ? '#A2A27A' : '#8B4500'}
              strokeWidth="0.5"
            />
            {/* Flower texture dots */}
            {f.type !== 'jasmine' && (
              <circle cx={f.cx} cy={f.cy} r={f.r * 0.45} fill="#FF4500" opacity="0.6" />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

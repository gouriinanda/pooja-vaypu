// client/src/components/CountdownBanner.jsx
// Live countdown timer according to festival dates, with demo mode override and Pooja Eduppu trigger

import React, { useState, useEffect } from 'react';
import { POOJA_VAYPU_DATE, POOJA_EDUPPU_DATE } from '../config';

export default function CountdownBanner({
  demoState,
  setDemoState,
  onPoojaEduppu,
  placedBooksCount = 0,
}) {
  // Real-time state
  const [timeLeft, setTimeLeft] = useState({
    status: 'between', // 'before' | 'between' | 'after'
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    daysUntilVaypu: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      // Vaypu starts at beginning of VAYPU_DATE (e.g. 00:00:00)
      const vaypuTime = new Date(`${POOJA_VAYPU_DATE}T00:00:00`).getTime();
      // Eduppu starts at 08:00:00 on EDUPPU_DATE
      const eduppuTime = new Date(`${POOJA_EDUPPU_DATE}T08:00:00`).getTime();

      if (now < vaypuTime) {
        const diff = vaypuTime - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setTimeLeft({
          status: 'before',
          daysUntilVaypu: days,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else if (now >= vaypuTime && now < eduppuTime) {
        const diff = eduppuTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({
          status: 'between',
          days,
          hours,
          minutes,
          seconds,
          daysUntilVaypu: 0,
        });
      } else {
        setTimeLeft({
          status: 'after',
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          daysUntilVaypu: 0,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine effective status considering Demo Mode override
  // demoState: 'auto' | 'before' | 'between' | 'after'
  const effectiveStatus = demoState === 'auto' ? timeLeft.status : demoState;

  return (
    <div className="countdown-container">
      {/* Demo Mode switcher */}
      <div className="demo-mode-bar">
        <span className="demo-badge">🧪 Demo Mode Override:</span>
        <div className="demo-options">
          <button
            type="button"
            className={`demo-btn ${demoState === 'auto' ? 'active' : ''}`}
            onClick={() => setDemoState('auto')}
            title="Use actual calendar date/time"
          >
            Auto (Real Date)
          </button>
          <button
            type="button"
            className={`demo-btn ${demoState === 'before' ? 'active' : ''}`}
            onClick={() => setDemoState('before')}
            title="Simulate before Pooja Vaypu"
          >
            Before Vaypu
          </button>
          <button
            type="button"
            className={`demo-btn ${demoState === 'between' ? 'active' : ''}`}
            onClick={() => setDemoState('between')}
            title="Simulate locked pooja period"
          >
            Between Dates (Locked 🔒)
          </button>
          <button
            type="button"
            className={`demo-btn ${demoState === 'after' ? 'active' : ''}`}
            onClick={() => setDemoState('after')}
            title="Simulate Pooja Eduppu time"
          >
            Pooja Eduppu (Unlocked 🔓)
          </button>
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className={`countdown-banner status-${effectiveStatus}`}>
        {effectiveStatus === 'before' && (
          <div className="banner-content">
            <span className="banner-icon">🪔</span>
            <div>
              <h3>Pooja Vaypu in {timeLeft.daysUntilVaypu || 1} day(s)</h3>
              <p>Prepare your study books on the shelf for Saraswati Devi's blessings.</p>
            </div>
          </div>
        )}

        {effectiveStatus === 'between' && (
          <div className="banner-content live-timer">
            <div className="banner-info">
              <span className="banner-icon">🔒</span>
              <div>
                <h3>Books Resting on the Sacred Altar</h3>
                <p>Books are sanctified with Goddess Saraswati. Studies are paused until Pooja Eduppu.</p>
              </div>
            </div>

            <div className="timer-boxes">
              <div className="timer-box">
                <span className="timer-val">{timeLeft.days}</span>
                <span className="timer-lbl">Days</span>
              </div>
              <div className="timer-box">
                <span className="timer-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="timer-lbl">Hours</span>
              </div>
              <div className="timer-box">
                <span className="timer-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="timer-lbl">Mins</span>
              </div>
              <div className="timer-box">
                <span className="timer-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="timer-lbl">Secs</span>
              </div>
            </div>
          </div>
        )}

        {effectiveStatus === 'after' && (
          <div className="banner-content eduppu-celebration">
            <div className="banner-info">
              <span className="banner-icon">✨</span>
              <div>
                <h3>Pooja Eduppu time! Take your books and start studying</h3>
                <p className="malayalam-text">
                  വിജയദശമി ശുഭദിനം! ദേവിയുടെ അനുഗ്രഹത്തോടെ പഠനം പുനരാരംഭിക്കാം.
                </p>
              </div>
            </div>

            {placedBooksCount > 0 && (
              <button
                type="button"
                className="btn-eduppu-action"
                onClick={onPoojaEduppu}
              >
                🪔 Pooja Eduppu (Take All {placedBooksCount} Books)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// client/src/pages/AltarPage.jsx
// Sacred Saraswati Devi Altar with Nilavilakku lamps, garland, offerings, audio, and placed books

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, returnAllBooks, getPdfUrl } from '../api';
import Nilavilakku from '../components/Nilavilakku';
import Garland from '../components/Garland';
import OfferingsTray from '../components/OfferingsTray';
import CountdownBanner from '../components/CountdownBanner';
import { POOJA_VAYPU_DATE, POOJA_EDUPPU_DATE } from '../config';

export default function AltarPage() {
  // Books state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nilavilakku lamp states (left and right)
  const [leftLampLit, setLeftLampLit] = useState(true);
  const [rightLampLit, setRightLampLit] = useState(true);

  // Offerings states
  const [isIncenseActive, setIsIncenseActive] = useState(false);
  const [hasTilak, setHasTilak] = useState(true);
  const [fallingPetals, setFallingPetals] = useState([]);

  // Image fallback state
  const [imageFailed, setImageFailed] = useState(false);

  // Demo mode state for festival countdown ('auto' | 'before' | 'between' | 'after')
  const [demoState, setDemoState] = useState('auto');

  // Status message
  const [feedback, setFeedback] = useState('');

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error('Error loading altar books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine whether books are currently locked
  // If demoState is active, override with demoState === 'between'
  // Otherwise check if current date is between POOJA_VAYPU_DATE and POOJA_EDUPPU_DATE
  const isLocked = (() => {
    if (demoState === 'between') return true;
    if (demoState === 'after' || demoState === 'before') return false;
    const now = new Date().getTime();
    const vaypu = new Date(`${POOJA_VAYPU_DATE}T00:00:00`).getTime();
    const eduppu = new Date(`${POOJA_EDUPPU_DATE}T08:00:00`).getTime();
    return now >= vaypu && now < eduppu;
  })();

  // Filter books currently placed on the altar
  const placedBooks = books.filter((b) => b.placed);

  // Handle Flower Shower offering
  const triggerFlowerShower = () => {
    // Generate 25 floating petals with random paths
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 90 + 5, // percentage across width
      delay: Math.random() * 0.8, // seconds delay
      size: Math.random() * 14 + 12, // px
      type: i % 3 === 0 ? 'jasmine' : i % 2 === 0 ? 'marigold-orange' : 'marigold-yellow',
      rotation: Math.random() * 360,
    }));

    setFallingPetals(newPetals);
    setFeedback('🌸 Fresh flower petals offered to Devi Saraswati');
    setTimeout(() => {
      setFallingPetals([]);
      setFeedback('');
    }, 4000);
  };

  // Handle Pooja Eduppu: return all books to shelf
  const handlePoojaEduppu = async () => {
    try {
      const updated = await returnAllBooks();
      setBooks(updated);
      setFeedback('🎉 Pooja Eduppu completed! All books have received blessings and returned to your shelf.');
      setTimeout(() => setFeedback(''), 5000);
    } catch (err) {
      console.error('Pooja Eduppu error:', err);
      setFeedback('Failed to return books. Please try again.');
    }
  };

  // Calculate overall glow level: 0 = none, 1 = one lamp, 2 = both lamps
  const litCount = (leftLampLit ? 1 : 0) + (rightLampLit ? 1 : 0);

  return (
    <div className={`altar-view-wrapper glow-level-${litCount}`}>
      {/* Floating flower petals layer */}
      {fallingPetals.length > 0 && (
        <div className="petals-canvas-overlay" aria-hidden="true">
          {fallingPetals.map((petal) => (
            <div
              key={petal.id}
              className={`falling-petal petal-${petal.type}`}
              style={{
                left: `${petal.left}%`,
                animationDelay: `${petal.delay}s`,
                width: `${petal.size}px`,
                height: `${petal.size}px`,
                transform: `rotate(${petal.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Countdown and Festival Lock Banner */}
      <div className="altar-top-banner">
        <CountdownBanner
          demoState={demoState}
          setDemoState={setDemoState}
          onPoojaEduppu={handlePoojaEduppu}
          placedBooksCount={placedBooks.length}
        />
      </div>

      {/* Notification banner */}
      {feedback && <div className="toast-msg success altar-toast">{feedback}</div>}

      {/* The Sacred Pooja Altar Assembly */}
      <div className="altar-sacred-setting">
        {/* Left Nilavilakku */}
        <div className="altar-side-lamp lamp-col-left">
          <Nilavilakku
            isLit={leftLampLit}
            onToggle={() => setLeftLampLit((prev) => !prev)}
            side="left"
          />
        </div>

        {/* Central Shrine with Saraswati Devi portrait */}
        <div className="altar-center-shrine">
          {/* Framed Devi Portrait */}
          <div className="devi-frame-container">
            {/* Traditional floral garland draped over the frame */}
            <Garland />

            {/* Sacred Chandanam & Kumkum Tilak */}
            {hasTilak && (
              <div className="sacred-tilak-mark" title="Sandalwood & Kumkum Tilak">
                <span className="tilak-sandal" />
                <span className="tilak-kumkum" />
              </div>
            )}

            {/* Incense Smoke Wisps Animation */}
            {isIncenseActive && (
              <div className="incense-burner-shrine">
                <div className="agarbatti-stick" />
                <div className="smoke-wisp smoke-1" />
                <div className="smoke-wisp smoke-2" />
                <div className="smoke-wisp smoke-3" />
              </div>
            )}

            {/* Portrait frame & image */}
            <div className="devi-golden-frame">
              {imageFailed ? (
                <div className="saraswati-placeholder-box">
                  <div className="placeholder-deity-icon">🕉️</div>
                  <h4 className="placeholder-deity-title">Saraswati Devi</h4>
                  <p className="placeholder-instruction">
                    Add <strong>saraswati.jpg</strong> to
                    <br />
                    <code>client/public/assets/saraswati.jpg</code>
                  </p>
                  <div className="placeholder-sub">
                    നമസ്തേ ശാരദേ ദേവി കാശ്മീരപുരവാസിനി
                  </div>
                </div>
              ) : (
                <img
                  src="/assets/saraswati.jpg"
                  alt="Goddess Saraswati Devi on Altar"
                  className="devi-portrait-image"
                  onError={() => setImageFailed(true)}
                />
              )}
            </div>
          </div>

          {/* Low Wooden Platform / Peedam holding the placed books */}
          <div className="wooden-peedam-table">
            <div className="peedam-top-surface">
              {/* Placed Books List */}
              {loading ? (
                <div className="altar-books-loading">Invoking blessings...</div>
              ) : placedBooks.length === 0 ? (
                <div className="altar-empty-state">
                  <p className="empty-altar-text">
                    No books have been placed on Devi's altar yet.
                  </p>
                  <Link to="/" className="btn-go-shelf">
                    📚 Go to Bookshelf to Place Books
                  </Link>
                </div>
              ) : (
                <div className="placed-books-grid">
                  {placedBooks.map((book) => (
                    <div
                      key={book._id}
                      className="altar-book-item"
                      onClick={() => window.open(getPdfUrl(book.filename), '_blank')}
                      title={`"${book.title}" - Click to open PDF`}
                    >
                      {/* Mini traditional book cover */}
                      <div className="altar-book-cover">
                        {isLocked ? (
                          <span className="altar-lock-indicator" title="Locked during Pooja Vaypu">
                            🔒
                          </span>
                        ) : (
                          <span className="altar-sanctified-star">✨</span>
                        )}
                        <div className="book-cover-ribbon" />
                        <span className="book-cover-title">{book.title}</span>
                      </div>
                      <span className="book-cover-caption">{book.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Peedam Wooden Front Edge and Brass Feet */}
            <div className="peedam-front-plank">
              <div className="peedam-carving-motif">❖ ❖ ❖</div>
            </div>
            <div className="peedam-feet">
              <span className="brass-foot left" />
              <span className="brass-foot right" />
            </div>
          </div>
        </div>

        {/* Right Nilavilakku */}
        <div className="altar-side-lamp lamp-col-right">
          <Nilavilakku
            isLit={rightLampLit}
            onToggle={() => setRightLampLit((prev) => !prev)}
            side="right"
          />
        </div>
      </div>

      {/* Offerings Tray and Chanting Player Section */}
      <section className="altar-offerings-section">
        <OfferingsTray
          onShowerFlowers={triggerFlowerShower}
          isIncenseActive={isIncenseActive}
          onToggleIncense={() => setIsIncenseActive((prev) => !prev)}
          hasTilak={hasTilak}
          onApplyTilak={() => setHasTilak((prev) => !prev)}
        />
      </section>
    </div>
  );
}

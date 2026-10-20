// client/src/components/OfferingsTray.jsx
// Traditional offerings tray (Pooja Thalam) with Flowers, Incense, Kumkum/Chandan, Bell, and Chanting Player

import React, { useState, useRef, useEffect } from 'react';

export default function OfferingsTray({
  onShowerFlowers,
  isIncenseActive,
  onToggleIncense,
  hasTilak,
  onApplyTilak,
}) {
  // Bell audio & animation states
  const [bellRinging, setBellRinging] = useState(false);
  const [bellError, setBellError] = useState(false);
  const bellAudioRef = useRef(null);

  // Chant player states
  const [isChanting, setIsChanting] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [chantError, setChantError] = useState(false);
  const chantAudioRef = useRef(null);

  // Initialize bell audio
  useEffect(() => {
    const audio = new Audio('/assets/bell.mp3');
    audio.preload = 'auto';
    audio.onerror = () => {
      // Graceful fallback if bell.mp3 has not yet been added by user
      setBellError(true);
    };
    bellAudioRef.current = audio;

    return () => {
      if (bellAudioRef.current) {
        bellAudioRef.current.pause();
      }
    };
  }, []);

  // Initialize chant audio
  useEffect(() => {
    const audio = new Audio('/assets/chant.mp3');
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'none'; // Don't autoplay or force preload
    audio.onerror = () => {
      // Graceful fallback if chant.mp3 has not yet been added by user
      setChantError(true);
      setIsChanting(false);
    };
    chantAudioRef.current = audio;

    return () => {
      if (chantAudioRef.current) {
        chantAudioRef.current.pause();
      }
    };
  }, []);

  // Update chant volume
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (chantAudioRef.current) {
      chantAudioRef.current.volume = val;
    }
  };

  // Ring temple bell
  const ringBell = () => {
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 900);

    if (bellAudioRef.current && !bellError) {
      bellAudioRef.current.currentTime = 0;
      bellAudioRef.current.play().catch((err) => {
        console.warn('Bell audio playback prevented or file missing:', err);
        setBellError(true);
      });
    }
  };

  // Toggle devotional chant
  const toggleChant = () => {
    if (!chantAudioRef.current) return;

    if (isChanting) {
      chantAudioRef.current.pause();
      setIsChanting(false);
    } else {
      setChantError(false);
      chantAudioRef.current
        .play()
        .then(() => {
          setIsChanting(true);
        })
        .catch((err) => {
          console.warn('Chant audio playback prevented or missing:', err);
          setChantError(true);
          setIsChanting(false);
        });
    }
  };

  return (
    <div className="offerings-wrapper">
      {/* Devotional Offerings Tray */}
      <div className="offerings-tray">
        <div className="tray-title">
          <span>🪔</span> Pooja Offerings (പൂജ വഴിപാടുകൾ)
        </div>

        <div className="tray-buttons">
          {/* 1. Flowers Offering */}
          <button
            type="button"
            className="offering-btn"
            onClick={onShowerFlowers}
            title="Shower fresh marigold & jasmine petals on the altar"
          >
            <span className="offering-icon">🌸</span>
            <span className="offering-label">Pushpam (Flowers)</span>
          </button>

          {/* 2. Incense (Agarbatti) Offering */}
          <button
            type="button"
            className={`offering-btn ${isIncenseActive ? 'active' : ''}`}
            onClick={onToggleIncense}
            title="Light sacred incense stick with fragrant smoke"
          >
            <span className="offering-icon">💨</span>
            <span className="offering-label">
              {isIncenseActive ? 'Dhoopam (Active)' : 'Dhoopam (Incense)'}
            </span>
          </button>

          {/* 3. Kumkum / Sandalwood Offering */}
          <button
            type="button"
            className={`offering-btn ${hasTilak ? 'active' : ''}`}
            onClick={onApplyTilak}
            title="Apply sacred Chandanam & Kumkumam tilak"
          >
            <span className="offering-icon">🔴</span>
            <span className="offering-label">
              {hasTilak ? 'Tilak Applied ✓' : 'Chandanam / Kumkum'}
            </span>
          </button>

          {/* 4. Temple Bell Offering */}
          <button
            type="button"
            className={`offering-btn ${bellRinging ? 'bell-shake' : ''}`}
            onClick={ringBell}
            title="Ring auspicious bronze temple bell"
          >
            <span className="offering-icon">🔔</span>
            <span className="offering-label">Mani (Bell)</span>
          </button>
        </div>

        {bellError && (
          <div className="audio-missing-note">
            ℹ️ <em>assets/bell.mp3</em> not found (add to <code>/client/public/assets/</code> to hear sound).
          </div>
        )}
      </div>

      {/* Devotional Chanting Audio Player */}
      <div className="chant-player-card">
        <div className="player-top">
          <div className="player-label">
            <span className="audio-note-icon">🎵</span>
            <div>
              <strong>Saraswati Vandana</strong>
              <div className="player-sub">Devotional Stotram Chant</div>
            </div>
          </div>

          <div className="player-controls">
            <button
              type="button"
              className={`chant-toggle-btn ${isChanting ? 'playing' : ''}`}
              onClick={toggleChant}
              title={isChanting ? "Pause Chant" : "Play Saraswati Stotram"}
            >
              {isChanting ? '⏸ Pause Chant' : '▶ Play Chant'}
            </button>

            <div className="volume-control" title="Audio Volume">
              <span style={{ fontSize: '0.85rem' }}>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span style={{ fontSize: '0.85rem' }}>🔊</span>
            </div>
          </div>
        </div>

        {chantError && (
          <div className="audio-missing-note">
            ℹ️ <em>assets/chant.mp3</em> not found. (Add to <code>/client/public/assets/</code> for looping chants).
          </div>
        )}

        {/* Devotional lyrics / caption box */}
        <div className="chant-lyrics-box">
          <p className="lyrics-malayalam">
            "സരസ്വതീ നമസ്തുഭ്യം വരദേ കാമരൂപിണി ।<br />
            വിദ്യാരംഭം കരിഷ്യാമി സിദ്ധിർഭവതു മേ സദാ ॥"
          </p>
          <p className="lyrics-sanskrit">
            "सरस्वती नमस्तुभ्यं वरदे कामरूपिणि । विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥"
          </p>
          <span className="lyrics-trans">
            <em>O Goddess Saraswati, salutations unto you who grants boons. As I commence my learning, may there always be success and wisdom for me.</em>
          </span>
        </div>
      </div>
    </div>
  );
}

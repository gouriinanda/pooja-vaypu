// client/src/pages/VidyarambhamPage.jsx
// Interactive Kerala Vidyarambham ceremony: Write sacred Malayalam letters on a traditional brass rice tray (Ari Thalam)

import React, { useRef, useEffect, useState } from 'react';

export default function VidyarambhamPage() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [isSweeping, setIsSweeping] = useState(false);
  const [hasWritten, setHasWritten] = useState(false);

  // Initialize and paint realistic rice texture on the canvas
  const drawRiceTexture = (ctx, width, height) => {
    // 1. Base cream/rice warmth
    ctx.fillStyle = '#F4EDE0';
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle rice grain layers
    const grainColors = ['#ECE2CF', '#FAF5EB', '#DFD3BC', '#E8DEC7', '#FFFDF8'];
    const totalGrains = Math.floor((width * height) / 35);

    for (let i = 0; i < totalGrains; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = Math.random() * 4 + 2;
      const angle = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = grainColors[Math.floor(Math.random() * grainColors.length)];

      // Draw rice grain ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, length, length * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  // Set up canvas sizing and initial texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use high resolution for retina screens
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    drawRiceTexture(ctx, rect.width, rect.height);
  }, []);

  // Helper to extract canvas coordinates from mouse or touch event
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Start stroke
  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getCoordinates(e);
    if (!pos) return;
    setIsDrawing(true);
    setLastPos(pos);
    setHasWritten(true);
  };

  // Draw indented finger groove in rice
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getCoordinates(e);
    if (!pos || !lastPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    // Normalize scale to internal coordinate system
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1. Light highlight rim on top-left edge (raised displaced rice)
    ctx.beginPath();
    ctx.moveTo(lastPos.x - 2, lastPos.y - 2);
    ctx.lineTo(pos.x - 2, pos.y - 2);
    ctx.strokeStyle = 'rgba(255, 255, 245, 0.5)';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 2. Soft shadow underneath the furrow
    ctx.beginPath();
    ctx.moveTo(lastPos.x + 2, lastPos.y + 2);
    ctx.lineTo(pos.x + 2, pos.y + 2);
    ctx.strokeStyle = 'rgba(168, 148, 120, 0.35)';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 3. Central recessed groove (slightly darker pressed-in raw grain tone)
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#BFA98A';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 4. Deeper center trace
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = 'rgba(148, 125, 95, 0.45)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();
    setLastPos(pos);
  };

  // End stroke
  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  // Smooth the rice tray (clear canvas with sweep animation)
  const handleSmoothTray = () => {
    setIsSweeping(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawRiceTexture(ctx, rect.width * dpr, rect.height * dpr);
        ctx.restore();
      }
      setIsSweeping(false);
      setHasWritten(false);
    }, 450);
  };

  return (
    <div className="main-content vidyarambham-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Vidyarambham Rice Tray</h1>
        <p className="page-description">
          On Vijayadashami, learners begin their journey into knowledge by tracing auspicious words in raw rice.
        </p>
      </div>

      {/* Sacred Mantra Guide to write */}
      <div className="mantra-guide-banner">
        <span className="mantra-badge">✍️ Trace with finger or mouse:</span>
        <h2 className="sacred-mantra-text malayalam-text">
          ഹരിശ്രീ ഗണപതയേ നമഃ
        </h2>
        <p className="mantra-meaning">
          <em>"Hari Sri Ganapataye Namah" — Salutations to the Divine, to Saraswati (Goddess of Prosperity & Learning), and to Lord Ganesha.</em>
        </p>
      </div>

      {/* The Brass Uruli Tray */}
      <div className="tray-display-container">
        <div className={`brass-uruli-rim ${isSweeping ? 'sweeping' : ''}`}>
          {/* Internal level surface filled with rice canvas */}
          <div className="rice-canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="rice-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />

            {/* Sweep sweeper animation overlay */}
            {isSweeping && <div className="rice-sweep-effect" />}

            {!hasWritten && (
              <div className="touch-guide-overlay" aria-hidden="true">
                <span>👆 Write here with finger or mouse</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="tray-action-bar">
          <button
            type="button"
            className="btn-smooth-tray"
            onClick={handleSmoothTray}
            disabled={isSweeping}
            title="Smooth and level the rice tray again"
          >
            <span>🌾</span> Smooth Tray (നിരപ്പാക്കുക)
          </button>
        </div>
      </div>

      {/* Cultural significance note */}
      <div className="vidyarambham-info-card">
        <h3>About Kerala's Vidyarambham Ceremony</h3>
        <p>
          In Kerala temples like Panachikkadu and Dakshina Mookambika, thousands of children and devotees
          write the mantra <strong>"ഹരിശ്രീ ഗണപതയേ നമഃ"</strong> with their index finger on golden plates of raw rice.
          Afterwards, the letters are inscribed with gold on the child's tongue, welcoming speech and supreme wisdom.
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import './ConfiguratorUI.css';
import rim1 from './assets/rim1.png';
import rim2 from './assets/rim2.png';

export default function ConfiguratorUI({
  useNewWheels,
  setUseNewWheels,
  suspensionY,
  setSuspensionY,
  showSpoiler,
  setShowSpoiler,
  bodyColor,
  setBodyColor,
  glassTint,
  setGlassTint,
}) {
  // Calculate fill percent for the slider
  const percent = ((suspensionY + 0.25) / 0.5) * 100;

  const colorOptions = ['#00123A', '#F8F3F9', '#0A1204', '#262122'];
  const tintOptions = ['#bfc5c6', '#5a6a6c', '#23272a'];

  return (
    <div className="config-ui">
      <div className="config-section">
        <div className="config-title">Color</div>
        <div className="color-thumbnails grid">
          {colorOptions.map((color) => (
            <button
              key={color}
              className={`color-thumb grid${bodyColor === color ? ' selected' : ''}`}
              style={{ background: color, border: bodyColor === color ? '2px solid #222' : '2px solid transparent' }}
              onClick={() => setBodyColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>
      <div className="config-section">
        <div className="config-title">Tint</div>
        <div className="color-thumbnails grid">
          {tintOptions.map((tint) => (
            <button
              key={tint}
              className={`color-thumb grid${glassTint === tint ? ' selected' : ''}`}
              style={{ background: tint, border: glassTint === tint ? '2px solid #222' : '2px solid transparent' }}
              onClick={() => setGlassTint(tint)}
              aria-label={`Select glass tint ${tint}`}
            />
          ))}
        </div>
      </div>
      <div className="config-section">
        <div className="config-title">Rims</div>
        <div className="rim-thumbnails grid">
          <button
            className={`rim-thumb grid ${!useNewWheels ? 'selected' : ''}`}
            onClick={() => setUseNewWheels(false)}
            aria-label="Rim 1"
          >
            <img src={rim1} alt="Rim 1" />
          </button>
          <button
            className={`rim-thumb grid ${useNewWheels ? 'selected' : ''}`}
            onClick={() => setUseNewWheels(true)}
            aria-label="Rim 2"
          >
            <img src={rim2} alt="Rim 2" />
          </button>
        </div>
      </div>
      <div className="config-section">
        <div className="config-title">Ride Height</div>
        <div className="slider-outer">
          <div className="slider-track-wrapper">
            <div className="slider-track-bg">
              <div className="slider-track-fill" style={{ width: `${percent}%` }} />
            </div>
            <input
              type="range"
              min={-0.25}
              max={0.25}
              step={0.01}
              value={suspensionY}
              onChange={e => setSuspensionY(Number(e.target.value))}
              className="suspension-slider"
            />
          </div>
          <div className="slider-label-row">
            <span className="slider-label">Low</span>
            <span className="slider-label">High</span>
          </div>
        </div>
      </div>
      <div className="config-section">
        <div className="config-title">Accessories</div>
        <div className="accessory-row">
          <span className="accessory-label">Spoiler</span>
          <label className="switch">
            <input type="checkbox" checked={showSpoiler} onChange={() => setShowSpoiler(v => !v)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
} 
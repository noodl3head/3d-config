import React from 'react';
import './ConfiguratorUI.css';
import rim1 from './assets/rim1.png';
import rim2 from './assets/rim2.png';

export default function ConfiguratorUI({
  useNewWheels,
  setUseNewWheels,
  suspensionY,
  setSuspensionY,
}) {
  // Calculate fill percent for the slider
  const percent = ((suspensionY + 0.25) / 0.5) * 100;

  return (
    <div className="config-ui">
      <div className="config-section">
        <div className="config-title">Rims</div>
        <div className="rim-thumbnails">
          <button
            className={`rim-thumb ${!useNewWheels ? 'selected' : ''}`}
            onClick={() => setUseNewWheels(false)}
            aria-label="Rim 1"
          >
            <img src={rim1} alt="Rim 1" />
          </button>
          <button
            className={`rim-thumb ${useNewWheels ? 'selected' : ''}`}
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
    </div>
  );
} 
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import './ConfiguratorMenu.css';
import { BodyColorIcon, TintIcon, RimsIcon, RideHeightIcon, SpoilerIcon, HideSpoilerIcon, Spoiler1Icon } from './SVGIcons';
import rim1 from './assets/rim1.png';
import rim2 from './assets/rim2.png';
import rim3 from './assets/rim3.png';

function isDark(color) {
  if (!color) return false;
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
}

function BodyColorPopup({ bodyColor, setBodyColor, popupTop, ref }) {
  const COLORS = [
    '#00123A',
    '#F6F3F8',
    '#0A0F08',
    '#282324',
  ];
  return (
    <div className="popup-panel" style={{ top: popupTop, left: 90 }} ref={ref}>
      <div className="popup-title">Body Paint</div>
      <div className="color-options">
        {COLORS.map(color => {
          const selected = bodyColor === color;
          return (
            <div
              key={color}
              className={`color-circle${selected ? ' selected' : ''}`}
              style={{
                background: color,
                border: selected ? '2px solid #fff' : 'none',
                boxShadow: selected ? '0 0 0 3px #A2A2A2' : 'none',
              }}
              onClick={() => setBodyColor(color)}
            />
          );
        })}
      </div>
    </div>
  );
}

function TintPopup({ glassTint, setGlassTint, popupTop, ref }) {
  const TINTS = [
    '#bfc5c6', // original default
    '#e0e0e0',
    '#7f8c8d',
    '#222',
  ];
  return (
    <div className="popup-panel" style={{ top: popupTop, left: 90 }} ref={ref}>
      <div className="popup-title">Tint</div>
      <div className="color-options">
        {TINTS.map(tint => {
          const selected = glassTint === tint;
          return (
            <div
              key={tint}
              className={`color-circle${selected ? ' selected' : ''}`}
              style={{
                background: tint,
                border: selected ? '2px solid #fff' : 'none',
                boxShadow: selected ? '0 0 0 3px #A2A2A2' : 'none',
              }}
              onClick={() => setGlassTint(tint)}
            />
          );
        })}
      </div>
    </div>
  );
}

function RideHeightPopup({ suspensionY, setSuspensionY, popupTop, ref }) {
  const percent = ((suspensionY + 0.25) / 0.5) * 100;
  return (
    <div className="popup-panel" style={{ top: popupTop, left: 90 }} ref={ref}>
      <div className="popup-title">Ride Height</div>
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
  );
}

function RimsPopup({ wheelSetIndex, setWheelSetIndex, popupTop, ref }) {
  return (
    <div className="popup-panel" style={{ top: popupTop, left: 90 }} ref={ref}>
      <div className="popup-title">Rims</div>
      <div className="rim-options">
        <div
          className={`rim-thumb${wheelSetIndex === 0 ? ' selected' : ''}`}
          style={{
            border: wheelSetIndex === 0 ? '2px solid #fff' : 'none',
            boxShadow: wheelSetIndex === 0 ? '0 0 0 3px #A2A2A2' : 'none',
          }}
          onClick={() => setWheelSetIndex(0)}
        >
          <img src={rim1} alt="Rim 1" />
        </div>
        <div
          className={`rim-thumb${wheelSetIndex === 1 ? ' selected' : ''}`}
          style={{
            border: wheelSetIndex === 1 ? '2px solid #fff' : 'none',
            boxShadow: wheelSetIndex === 1 ? '0 0 0 3px #A2A2A2' : 'none',
          }}
          onClick={() => setWheelSetIndex(1)}
        >
          <img src={rim2} alt="Rim 2" />
        </div>
        <div
          className={`rim-thumb${wheelSetIndex === 2 ? ' selected' : ''}`}
          style={{
            border: wheelSetIndex === 2 ? '2px solid #fff' : 'none',
            boxShadow: wheelSetIndex === 2 ? '0 0 0 3px #A2A2A2' : 'none',
          }}
          onClick={() => setWheelSetIndex(2)}
        >
          <img src={rim3} alt="Rim 3" />
        </div>
      </div>
    </div>
  );
}

function SpoilerPopup({ showSpoiler, setShowSpoiler, popupTop, ref }) {
  return (
    <div className="popup-panel" style={{ top: popupTop, left: 90 }} ref={ref}>
      <div className="popup-title">Spoiler</div>
      <div className="color-options">
        <div
          className={`color-circle${!showSpoiler ? ' selected' : ''}`}
          style={{
            border: !showSpoiler ? '2px solid #fff' : 'none',
            boxShadow: !showSpoiler ? '0 0 0 3px #A2A2A2' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setShowSpoiler(false)}
        >
          <HideSpoilerIcon width={28} height={28} />
        </div>
        <div
          className={`color-circle${showSpoiler ? ' selected' : ''}`}
          style={{
            border: showSpoiler ? '2px solid #fff' : 'none',
            boxShadow: showSpoiler ? '0 0 0 3px #A2A2A2' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setShowSpoiler(true)}
        >
          <Spoiler1Icon width={28} height={28} />
        </div>
      </div>
    </div>
  );
}

const MENU_ITEMS = [
  { key: 'bodyColor', label: 'Body Color', icon: <BodyColorIcon width={32} height={32} /> },
  { key: 'tint', label: 'Tint', icon: <TintIcon width={32} height={32} /> },
  { key: 'rims', label: 'Rims', icon: <RimsIcon width={32} height={32} /> },
  { key: 'rideHeight', label: 'Ride Height', icon: <RideHeightIcon width={32} height={32} /> },
  { key: 'spoiler', label: 'Spoiler', icon: <SpoilerIcon width={32} height={32} /> },
];

export default function ConfiguratorMenu({ bodyColor, setBodyColor, wheelSetIndex, setWheelSetIndex, glassTint, setGlassTint, suspensionY, setSuspensionY, showSpoiler, setShowSpoiler, appContainerRef }) {
  const [selected, setSelected] = useState(null);
  const itemRefs = useRef([]);
  const [popupTop, setPopupTop] = useState(24);
  const [popupHeight, setPopupHeight] = useState(0);
  const popupRef = useRef(null);

  useLayoutEffect(() => {
    if (selected) {
      const idx = MENU_ITEMS.findIndex(item => item.key === selected);
      const ref = itemRefs.current[idx];
      if (ref && popupRef.current && appContainerRef && appContainerRef.current) {
        const itemRect = ref.getBoundingClientRect();
        const popupHeight = popupRef.current.offsetHeight;
        const appRect = appContainerRef.current.getBoundingClientRect();
        const minTop = appRect.top + 8; // add a little margin from the top
        const maxTop = appRect.bottom - popupHeight - 16; // 16px margin from bottom
        const desiredTop = itemRect.top;
        setPopupTop(Math.max(minTop, Math.min(desiredTop, maxTop)));
      } else if (ref) {
        const rect = ref.getBoundingClientRect();
        setPopupTop(rect.top);
      }
    }
  }, [selected, appContainerRef]);

  useEffect(() => {
    if (popupRef.current) {
      setPopupHeight(popupRef.current.offsetHeight);
    }
  }, [selected, popupRef.current]);

  // Helper to pass ref and adjusted top to popups
  function renderPopup(popup) {
    if (!popup) return null;
    return React.cloneElement(popup, { popupTop, ref: popupRef });
  }

  return (
    <>
      <div className="config-menu-bar">
        {MENU_ITEMS.map((item, idx) => (
          <React.Fragment key={item.key}>
            <div
              ref={el => itemRefs.current[idx] = el}
              className={`config-menu-item${selected === item.key ? ' selected' : ''}`}
              onClick={() => setSelected(selected === item.key ? null : item.key)}
            >
              <div
                className="icon-placeholder"
                style={{ background: selected === item.key ? '#EBEBEB' : undefined }}
              >
                {item.icon}
              </div>
              <span className="visually-hidden">{item.label}</span>
            </div>
            {idx === 3 && <div className="config-menu-divider" />}
          </React.Fragment>
        ))}
      </div>
      {selected === 'bodyColor' && renderPopup(<BodyColorPopup bodyColor={bodyColor} setBodyColor={setBodyColor} />)}
      {selected === 'tint' && renderPopup(<TintPopup glassTint={glassTint} setGlassTint={setGlassTint} />)}
      {selected === 'rims' && renderPopup(<RimsPopup wheelSetIndex={wheelSetIndex} setWheelSetIndex={setWheelSetIndex} />)}
      {selected === 'rideHeight' && renderPopup(<RideHeightPopup suspensionY={suspensionY} setSuspensionY={setSuspensionY} />)}
      {selected === 'spoiler' && renderPopup(<SpoilerPopup showSpoiler={showSpoiler} setShowSpoiler={setShowSpoiler} />)}
    </>
  );
} 
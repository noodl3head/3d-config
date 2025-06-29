import React from 'react'

export default function SuspensionControl({ value, onChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        background: '#ffffffcc',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif',
      }}
    >
      <label style={{ display: 'block', fontWeight: 'bold', color: 'black' }}>
        Suspension Height (±0.25)
      </label>
      <input
        type="range"
        min={-0.25}
        max={0.25}
        step={0.005}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '200px' }}
      />
      <div style={{ fontSize: '0.85rem', marginTop: '4px', color: 'black' }}>
        {value.toFixed(3)} units
      </div>
    </div>
  )
}

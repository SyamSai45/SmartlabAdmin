// src/components/ui/Toggle.js
import React from 'react';

export function Toggle({ checked, onChange, onClick }) {
  return (
    <label className="toggle" onClick={e => e.stopPropagation()}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange || (() => {})}
        onClick={onClick}
      />
      <span className="toggle-slider" />
    </label>
  );
}
import React from 'react';
import './ThemeSelector.css';

const THEMES = [
  {
    id: 'netflix',
    label: 'Netflix',
    description: 'Dark cinematic experience',
  },
  {
    id: 'disney',
    label: 'Disney+',
    description: 'Family-friendly blue glow',
  },
  {
    id: 'google-play',
    label: 'Google Play',
    description: 'Clean and vibrant',
  },
  {
    id: 'salesforce',
    label: 'Salesforce',
    description: 'Enterprise cloud style',
  },
];

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="theme-selector">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
          onClick={() => onThemeChange(theme.id)}
        >
          <div className={`theme-swatch theme-${theme.id}`} />
          <div className="theme-info">
            <h5>{theme.label}</h5>
            <p>{theme.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import './ThemeSelector.css';

const THEMES = [
  {
    id: 'clear-sky',
    labelKey: 'themes.clearSky',
    descriptionKey: 'themes.clearSkyDesc',
  },
  {
    id: 'night-shade',
    labelKey: 'themes.nightShade',
    descriptionKey: 'themes.nightShadeDesc',
  },
  {
    id: 'corporate',
    labelKey: 'themes.corporate',
    descriptionKey: 'themes.corporateDesc',
  },
  {
    id: 'techie',
    labelKey: 'themes.techie',
    descriptionKey: 'themes.techieDesc',
  },
];

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  const { t } = useTranslation();
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
            <h5>{t(theme.labelKey)}</h5>
            <p>{t(theme.descriptionKey)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

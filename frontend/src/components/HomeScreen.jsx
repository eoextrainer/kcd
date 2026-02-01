import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './HomeScreen.css';

const getVideoId = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('v');
  } catch (err) {
    return '';
  }
};

const buildEmbedUrl = (url) => {
  const id = getVideoId(url);
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&loop=1&playlist=${id}`;
};

const VideoTile = ({ title, subtitle, url }) => (
  <div className="video-tile">
    <div className="video-frame">
      <iframe
        className="tile-video"
        src={buildEmbedUrl(url)}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
    <div className="tile-caption">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  </div>
);

export default function HomeScreen({ onLoginClick }) {
  const { t } = useTranslation();
  const [navOpen, setNavOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroVideos = useMemo(
    () => [
      'https://www.youtube.com/watch?v=7KleXMtVBSs',
      'https://www.youtube.com/watch?v=m5FPAvHLEVM',
      'https://www.youtube.com/watch?v=5aFWNrRG7qw',
      'https://www.youtube.com/watch?v=J1GCDcbYIRI',
      'https://www.youtube.com/watch?v=WK5GbfGULpk',
    ],
    []
  );

  const featuredEvents = useMemo(
    () => [
      'https://www.youtube.com/watch?v=B3dl7nCEO2c',
      'https://www.youtube.com/watch?v=afbCCkgVGHY',
      'https://www.youtube.com/watch?v=qYaDIZE8o-A',
    ],
    []
  );

  const featuredCreators = useMemo(
    () => [
      'https://www.youtube.com/watch?v=3MeQlr0wSAs',
      'https://www.youtube.com/watch?v=zxw-_OFwb7o',
      'https://www.youtube.com/watch?v=lRL24v3syCk',
    ],
    []
  );

  const featuredTalents = useMemo(
    () => [
      'https://www.youtube.com/watch?v=CwmKr-wkj1M',
      'https://www.youtube.com/watch?v=HgTSS7Lgw3M',
      'https://www.youtube.com/watch?v=GsyTVrbgfYI',
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroVideos.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [heroVideos.length]);

  const heroVideoUrl = buildEmbedUrl(heroVideos[heroIndex]);

  return (
    <div className="home-screen">
      <nav className="home-nav">
        <div className="nav-brand">
          <h1>KCD</h1>
          <p>{t('app.title')}</p>
        </div>

        <button
          className={`nav-toggle ${navOpen ? 'active' : ''}`}
          onClick={() => setNavOpen(!navOpen)}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${navOpen ? 'active' : ''}`}>
          <li><a href="#explore">{t('navigation.explore')}</a></li>
          <li><a href="#creators">{t('navigation.creators')}</a></li>
          <li><a href="#about">{t('navigation.about')}</a></li>
          <li>
            <button
              className="nav-login-btn"
              onClick={onLoginClick}
              type="button"
            >
              {t('home.login')}
            </button>
          </li>
        </ul>
      </nav>

      <section className="hero-section" id="explore">
        <div className="hero-video-wrapper">
          <iframe
            className="hero-video"
            key={heroVideoUrl}
            src={heroVideoUrl}
            title="KCD Hero"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{t('home.discover')}</h1>
          <button className="cta-button" onClick={onLoginClick} type="button">
            {t('home.getStarted')}
          </button>
        </div>
      </section>

      <section className="featured-section" id="events">
        <h2>{t('sections.featuredEvents')}</h2>
        <div className="tiles-grid">
          {featuredEvents.map((video, index) => (
            <VideoTile
              key={video}
              url={video}
              title={`${t('labels.event')} ${index + 1}`}
              subtitle={t('labels.specializing')}
            />
          ))}
        </div>
      </section>

      <section className="featured-section" id="creators">
        <h2>{t('sections.featuredCreators')}</h2>
        <div className="tiles-grid">
          {featuredCreators.map((video, index) => (
            <VideoTile
              key={video}
              url={video}
              title={`${t('labels.creator')} ${index + 1}`}
              subtitle={t('labels.specializing')}
            />
          ))}
        </div>
      </section>

      <section className="featured-section" id="talents">
        <h2>{t('sections.featuredTalents')}</h2>
        <div className="tiles-grid">
          {featuredTalents.map((video, index) => (
            <VideoTile
              key={video}
              url={video}
              title={`${t('labels.talent')} ${index + 1}`}
              subtitle={t('labels.specializing')}
            />
          ))}
        </div>
      </section>

      <footer className="home-footer" id="about">
        <p>&copy; 2026 {t('app.title')}</p>
      </footer>
    </div>
  );
}

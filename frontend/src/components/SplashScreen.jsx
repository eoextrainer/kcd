import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const { t } = useTranslation();
  const [fadeOut, setFadeOut] = useState(false);

  const splashVideos = useMemo(
    () => [
      'https://www.youtube.com/watch?v=7KleXMtVBSs',
      'https://www.youtube.com/watch?v=m5FPAvHLEVM',
      'https://www.youtube.com/watch?v=5aFWNrRG7qw',
      'https://www.youtube.com/watch?v=J1GCDcbYIRI',
      'https://www.youtube.com/watch?v=WK5GbfGULpk',
    ],
    []
  );

  const getVideoId = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get('v');
    } catch (err) {
      return '';
    }
  };

  const getEmbedUrl = (url) => {
    const id = getVideoId(url);
    if (!id) return '';
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&loop=1&playlist=${id}`;
  };

  const [selectedVideo, setSelectedVideo] = useState(
    () => getEmbedUrl(splashVideos[0])
  );

  useEffect(() => {
    const randomVideo = splashVideos[Math.floor(Math.random() * splashVideos.length)];
    setSelectedVideo(getEmbedUrl(randomVideo));

    // Video duration: 10 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete before calling onComplete
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete, splashVideos]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* YouTube Video Background */}
      <div className="splash-video-container">
        <iframe
          className="splash-video"
          src={selectedVideo}
          title="Paris Fashion Week 2026 Runway"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Overlay with gradient for elegance */}
      <div className="splash-overlay"></div>

      {/* Branding */}
      <div className="splash-branding">
        <div className="splash-logo">
          <h1>KCD</h1>
          <p>{t('app.title')}</p>
        </div>
      </div>

      <button type="button" className="splash-skip" onClick={handleSkip}>
        {t('splash.skip')}
      </button>

      {/* Timer indicator */}
      <div className="splash-timer">
        <div className="timer-bar"></div>
      </div>
    </div>
  );
}

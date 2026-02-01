import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Video duration: 15 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete before calling onComplete
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 15000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* YouTube Video Background */}
      <div className="splash-video-container">
        <iframe
          className="splash-video"
          src="https://www.youtube.com/embed/m5FPAvHLEVM?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0"
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
          <p>Creative Directory</p>
        </div>
      </div>

      {/* Timer indicator */}
      <div className="splash-timer">
        <div className="timer-bar"></div>
      </div>
    </div>
  );
}

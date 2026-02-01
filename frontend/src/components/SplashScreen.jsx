import React from 'react';
import './SplashScreen.css';

export default function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="splash-background">
        <div className="gradient-bg"></div>
        <div className="animated-bg"></div>
      </div>

      <div className="splash-content">
        <div className="letters-container">
          <div className="letter k">K</div>
          <div className="letter c">C</div>
          <div className="letter d">D</div>
        </div>

        <h1 className="splash-title">KCD</h1>
        <p className="splash-subtitle">Experience Excellence</p>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen

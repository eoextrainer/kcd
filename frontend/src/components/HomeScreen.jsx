import React, { useState } from 'react';
import './HomeScreen.css';

export default function HomeScreen({ onLoginClick }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="home-screen">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-brand">
          <h1>KCD</h1>
          <p>Creative Directory</p>
        </div>

        <button
          className={`nav-toggle ${navOpen ? 'active' : ''}`}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${navOpen ? 'active' : ''}`}>
          <li><a href="#explore">Explore</a></li>
          <li><a href="#creators">Creators</a></li>
          <li><a href="#about">About</a></li>
          <li>
            <button 
              className="nav-login-btn"
              onClick={onLoginClick}
            >
              Login
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to KCD</h1>
          <p className="hero-subtitle">Discover Creative Excellence</p>
          <button 
            className="cta-button"
            onClick={onLoginClick}
          >
            Get Started
          </button>
        </div>

        {/* Animated Background */}
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <h2>Featured Creators</h2>
        <div className="creators-grid">
          {[1, 2, 3].map((item) => (
            <div key={item} className="creator-card">
              <div className="creator-placeholder"></div>
              <h3>Creator {item}</h3>
              <p>Specializing in Fashion & Design</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2026 KCD - Creative Directory. All rights reserved.</p>
      </footer>
    </div>
  );
}

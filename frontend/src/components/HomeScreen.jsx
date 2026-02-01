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
          </button>
        </div>
      </div>

      {/* Featured Content Section (Netflix Style) */}
      <div className="netflix-section">
        <div className="section-header">
          <h2>Features</h2>
          <p>Explore what we offer</p>
        </div>

        <div className="featured-row">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`featured-item ${hoveredCard === feature.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ '--accent-color': feature.color }}
            >
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="feature-button">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Showcase */}
      <div className="showcase-section">
        <div className="section-header">
          <h2>Your Workspace</h2>
          <p>Personalized experience for each user</p>
        </div>

        <div className="showcase-grid">
          <div className="showcase-item large">
            <div className="showcase-placeholder">
              <span>Admin Dashboard</span>
            </div>
          </div>
          <div className="showcase-item">
            <div className="showcase-placeholder">
              <span>Analytics</span>
            </div>
          </div>
          <div className="showcase-item">
            <div className="showcase-placeholder">
              <span>Reports</span>
            </div>
          </div>
          <div className="showcase-item">
            <div className="showcase-placeholder">
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>KCD Platform for brand verification and management</p>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <p>24/7 Customer support available</p>
          </div>
          <div className="footer-section">
            <h4>Security</h4>
            <p>Enterprise-grade security features</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 KCD Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

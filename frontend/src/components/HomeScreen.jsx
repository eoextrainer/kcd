import React, { useState } from 'react';
import './HomeScreen.css';

export default function HomeScreen({ onNavigate }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      title: 'Brand Verification',
      description: 'Verify and authenticate your brand account',
      icon: '✓',
      color: '#e74c3c'
    },
    {
      id: 2,
      title: 'Analytics',
      description: 'Track performance and insights',
      icon: '📊',
      color: '#3498db'
    },
    {
      id: 3,
      title: 'Content Management',
      description: 'Manage your digital content',
      icon: '📁',
      color: '#2ecc71'
    },
    {
      id: 4,
      title: 'User Profiles',
      description: 'Customize your workspace',
      icon: '👤',
      color: '#f39c12'
    }
  ];

  return (
    <div className="home-screen">
      {/* Hero Section with Video Background */}
      <div className="hero-section">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="https://storage.coverr.co/videos/coverr-mountains-sunrise-1097/1080p.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to KCD Platform</h1>
          <p className="hero-subtitle">Knowledge Conversion Dashboard</p>
          <button className="cta-button" onClick={() => onNavigate('dashboard')}>
            Get Started
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

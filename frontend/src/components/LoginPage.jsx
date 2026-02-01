import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: '1',
      email: 'demo@kcd.com',
      name: 'Demo User',
      role: 'user',
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    onLogin(demoUser);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-bg-login"></div>
        <div className="animated-bg-login"></div>
      </div>

      <div className="login-content">
        <div className="login-box">
          <div className="login-header">
            <h1 className="login-logo">KCD</h1>
            <p className="login-tagline">Experience Excellence</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading || !email || !password}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="demo-button"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Try Demo Account
          </button>

          <div className="login-footer">
            <p>Don't have an account? <span className="signup-link">Sign up here</span></p>
          </div>
        </div>

        <div className="login-side-text">
          <h2>Welcome to KCD</h2>
          <p>Your platform for excellence in digital transformation</p>
          <ul className="features-list">
            <li>✨ Advanced Analytics</li>
            <li>🎯 Real-time Insights</li>
            <li>🔐 Enterprise Security</li>
            <li>📱 Cross-platform Access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ThemeSelector from './ThemeSelector';
import './Dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('workspaces');
  const [userData, setUserData] = useState(user);
  const [workspace, setWorkspace] = useState(null);
  const [theme, setTheme] = useState('netflix');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchWorkspace();
  }, []);

  useEffect(() => {
    const body = document.body;
    body.classList.remove(
      'theme-netflix',
      'theme-disney',
      'theme-google-play',
      'theme-salesforce'
    );
    if (theme) {
      body.classList.add(`theme-${theme}`);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspace = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/workspaces/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspace(data);
        setTheme(data.theme || localStorage.getItem('theme') || 'netflix');
      }
    } catch (err) {
      console.error('Failed to fetch workspace:', err);
    }
  };

  const handleThemeChange = async (nextTheme) => {
    setTheme(nextTheme);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/workspaces/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: nextTheme }),
      });
    } catch (err) {
      console.error('Failed to update theme:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect fill='%23000' width='1200' height='600'/%3E%3C/svg%3E"
        >
          <source src="https://storage.coverr.co/videos/coverr-typing-on-a-laptop-1586/1080p.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome, {userData?.full_name || 'User'}!</h1>
          <p className="hero-subtitle">Experience Excellence in Digital Transformation</p>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="header-left">
          <h2 className="dashboard-title">KCD Platform</h2>
          <p className="user-role">{userData?.role?.toUpperCase() || 'USER'}</p>
        </div>
        <div className="header-right">
          <button className="icon-button notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-button settings-btn">⚙️</button>
          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'workspaces' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspaces')}
          >
            🎯 Workspaces
          </button>
          <button
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'workspaces' && (
          <div className="workspaces-section">
            <div className="section-header">
              <div>
                <h3>Your Workspace</h3>
                <p className="workspace-subtitle">{workspace?.workspace_name || 'Personalized Workspace'}</p>
              </div>
              <button className="create-button">+ New Workspace</button>
            </div>

            {workspace && (
              <div className="workspace-summary">
                <div className="workspace-meta">
                  <span className="meta-label">Role</span>
                  <span className="meta-value">{workspace.role}</span>
                </div>
                <div className="workspace-meta">
                  <span className="meta-label">Theme</span>
                  <span className="meta-value">{workspace.theme}</span>
                </div>
                <div className="workspace-meta">
                  <span className="meta-label">Widgets</span>
                  <span className="meta-value">{workspace.widgets?.length || 0}</span>
                </div>
              </div>
            )}

            <div className="workspaces-grid">
              {userData?.role === 'admin' && (
                <>
                  <div className="workspace-card admin-card">
                    <div className="card-icon">👥</div>
                    <h4>User Management</h4>
                    <p>Manage platform users and roles</p>
                    <button className="card-button">Access</button>
                  </div>
                  <div className="workspace-card admin-card">
                    <div className="card-icon">📈</div>
                    <h4>System Analytics</h4>
                    <p>View system performance metrics</p>
                    <button className="card-button">Access</button>
                  </div>
                  <div className="workspace-card admin-card">
                    <div className="card-icon">🔒</div>
                    <h4>Security Control</h4>
                    <p>Manage security settings</p>
                    <button className="card-button">Access</button>
                  </div>
                </>
              )}

              {userData?.role === 'moderator' && (
                <>
                  <div className="workspace-card moderator-card">
                    <div className="card-icon">✓</div>
                    <h4>Content Moderation</h4>
                    <p>Review and approve submissions</p>
                    <button className="card-button">Access</button>
                  </div>
                  <div className="workspace-card moderator-card">
                    <div className="card-icon">📋</div>
                    <h4>Reports</h4>
                    <p>View activity reports</p>
                    <button className="card-button">Access</button>
                  </div>
                </>
              )}

              {userData?.role === 'user' && (
                <>
                  <div className="workspace-card user-card">
                    <div className="card-icon">📝</div>
                    <h4>My Projects</h4>
                    <p>Create and manage projects</p>
                    <button className="card-button">Access</button>
                  </div>
                  <div className="workspace-card user-card">
                    <div className="card-icon">👥</div>
                    <h4>Collaboration</h4>
                    <p>Work with team members</p>
                    <button className="card-button">Access</button>
                  </div>
                  <div className="workspace-card user-card">
                    <div className="card-icon">📚</div>
                    <h4>Resources</h4>
                    <p>Access learning materials</p>
                    <button className="card-button">Access</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h3>Analytics & Insights</h3>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">2,459</div>
                <div className="stat-label">Active Users</div>
                <div className="stat-change positive">↑ 12% this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">894</div>
                <div className="stat-label">Projects</div>
                <div className="stat-change positive">↑ 3% this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">98.5%</div>
                <div className="stat-label">Uptime</div>
                <div className="stat-change neutral">Excellent</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.9</div>
                <div className="stat-label">User Rating</div>
                <div className="stat-change positive">★★★★★</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Account Settings</h3>
            </div>

            <div className="settings-card theme-card">
              <h4>Theme Selector</h4>
              <p>Choose your preferred workspace theme</p>
              <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <h4>Profile Information</h4>
                <div className="settings-item">
                  <label>Email</label>
                  <p>{userData?.email || 'N/A'}</p>
                </div>
                <div className="settings-item">
                  <label>Name</label>
                  <p>{userData?.full_name || 'N/A'}</p>
                </div>
                <div className="settings-item">
                  <label>Role</label>
                  <p>{userData?.role?.toUpperCase() || 'N/A'}</p>
                </div>
                <button className="edit-button">Edit Profile</button>
              </div>

              <div className="settings-card">
                <h4>Security Settings</h4>
                <div className="settings-item">
                  <label>Password</label>
                  <p>Last changed 3 months ago</p>
                </div>
                <div className="settings-item">
                  <label>Two-Factor Authentication</label>
                  <p>Not enabled</p>
                </div>
                <button className="edit-button">Update Security</button>
              </div>

              <div className="settings-card">
                <h4>Preferences</h4>
                <div className="settings-item">
                  <label>Theme</label>
                  <p>Dark Mode</p>
                </div>
                <div className="settings-item">
                  <label>Notifications</label>
                  <p>Enabled</p>
                </div>
                <button className="edit-button">Manage Preferences</button>
              </div>

              <div className="settings-card danger-zone">
                <h4>Danger Zone</h4>
                <p>Irreversible actions</p>
                <button className="delete-button">Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

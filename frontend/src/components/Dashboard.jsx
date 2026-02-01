import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeSelector from './ThemeSelector';
import './Dashboard.css';
import { getApiBaseUrl } from '../config/api';

export default function Dashboard({ user, onLogout }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('workspaces');
  const [userData, setUserData] = useState(user);
  const [workspace, setWorkspace] = useState(null);
  const [theme, setTheme] = useState('night-shade');
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

  const roleThemeMap = useMemo(() => ({
    admin: 'corporate',
    community_admin: 'corporate',
    moderator: 'clear-sky',
    brand: 'disney',
    premium: 'night-shade',
    free: 'night-shade',
  }), []);

  const normalizeTheme = (value) => {
    const mapping = {
      netflix: 'night-shade',
      'google-play': 'clear-sky',
      salesforce: 'corporate',
      disney: 'disney',
    };
    return mapping[value] || value;
  };
  const effectiveRole = userData?.role === 'user'
    ? (userData?.subscription_tier || 'free')
    : (userData?.role || 'free');

  const featureMap = useMemo(() => ({
    admin: [
      { titleKey: 'admin.features.privileges', descKey: 'admin.features.privileges_desc' },
      { titleKey: 'admin.features.platformDashboard', descKey: 'admin.features.platformDashboard_desc' },
      { titleKey: 'admin.features.userManager', descKey: 'admin.features.userManager_desc' },
      { titleKey: 'admin.features.services', descKey: 'admin.features.services_desc' },
      { titleKey: 'admin.features.integrations', descKey: 'admin.features.integrations_desc' },
      { titleKey: 'admin.features.aiRequests', descKey: 'admin.features.aiRequests_desc' },
    ],
    community_admin: [
      { titleKey: 'community.features.dashboard', descKey: 'community.features.dashboard_desc' },
      { titleKey: 'community.features.subscriptions', descKey: 'community.features.subscriptions_desc' },
      { titleKey: 'community.features.marketing', descKey: 'community.features.marketing_desc' },
      { titleKey: 'community.features.vetting', descKey: 'community.features.vetting_desc' },
    ],
    moderator: [
      { titleKey: 'moderator.features.journey', descKey: 'moderator.features.journey_desc' },
      { titleKey: 'moderator.features.opportunities', descKey: 'moderator.features.opportunities_desc' },
      { titleKey: 'moderator.features.issues', descKey: 'moderator.features.issues_desc' },
      { titleKey: 'moderator.features.qa', descKey: 'moderator.features.qa_desc' },
      { titleKey: 'moderator.features.impersonate', descKey: 'moderator.features.impersonate_desc' },
    ],
    brand: [
      { titleKey: 'brand.features.showcase', descKey: 'brand.features.showcase_desc' },
      { titleKey: 'brand.features.partnerships', descKey: 'brand.features.partnerships_desc' },
      { titleKey: 'brand.features.analytics', descKey: 'brand.features.analytics_desc' },
    ],
    premium: [
      { titleKey: 'premium.features.highlights', descKey: 'premium.features.highlights_desc' },
      { titleKey: 'premium.features.topFive', descKey: 'premium.features.topFive_desc' },
      { titleKey: 'premium.features.modules', descKey: 'premium.features.modules_desc' },
      { titleKey: 'premium.features.subscriptions', descKey: 'premium.features.subscriptions_desc' },
      { titleKey: 'premium.features.chatbox', descKey: 'premium.features.chatbox_desc' },
      { titleKey: 'premium.features.aiPrompt', descKey: 'premium.features.aiPrompt_desc' },
    ],
    free: [
      { titleKey: 'free.features.limited', descKey: 'free.features.limited_desc' },
    ],
  }), []);

  useEffect(() => {
    fetchUserData();
    fetchWorkspace();
  }, []);

  useEffect(() => {
    if (!workspace && userData) {
      const roleDefault = roleThemeMap[effectiveRole] || 'night-shade';
      setTheme(localStorage.getItem('theme') || roleDefault);
    }
  }, [effectiveRole, roleThemeMap, userData, workspace]);

  useEffect(() => {
    const body = document.body;
    body.classList.remove(
      'theme-clear-sky',
      'theme-night-shade',
      'theme-corporate',
      'theme-techie',
      'theme-disney'
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
      const response = await fetch(`${apiBaseUrl}/v1/users/me`, {
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
      const response = await fetch(`${apiBaseUrl}/v1/workspaces/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspace(data);
        const rawRole = data.role === 'user' ? (data.subscription_tier || 'free') : data.role;
        const roleDefault = roleThemeMap[rawRole] || 'night-shade';
        const normalized = normalizeTheme(data.theme);
        setTheme(normalized || localStorage.getItem('theme') || roleDefault);
      }
    } catch (err) {
      console.error('Failed to fetch workspace:', err);
    }
  };

  const handleThemeChange = async (nextTheme) => {
    setTheme(nextTheme);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiBaseUrl}/v1/workspaces/me`, {
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
          <h1 className="hero-title">{t('dashboard.welcome')}, {userData?.full_name || 'Utilisateur'}!</h1>
          <p className="hero-subtitle">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="header-left">
          <h2 className="dashboard-title">{t('dashboard.title')}</h2>
          <p className="user-role">{t(`roles.${effectiveRole}`)}</p>
        </div>
        <div className="header-right">
          <button className="icon-button notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-button settings-btn">⚙️</button>
          <button className="logout-button" onClick={handleLogout}>
            {t('dashboard.signOut')}
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'workspaces' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspaces')}
          >
            🎯 {t('dashboard.workspaces')}
          </button>
          <button
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 {t('dashboard.analytics')}
          </button>
          <button
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ {t('dashboard.settings')}
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'workspaces' && (
          <div className="workspaces-section">
            <div className="section-header">
              <div>
                <h3>{t('dashboard.workspace')}</h3>
                <p className="workspace-subtitle">{workspace?.workspace_name || t('dashboard.workspace')}</p>
              </div>
              <button className="create-button">{t('dashboard.newWorkspace')}</button>
            </div>

            {workspace && (
              <div className="workspace-summary">
                <div className="workspace-meta">
                  <span className="meta-label">{t('dashboard.role')}</span>
                  <span className="meta-value">{t(`roles.${effectiveRole}`)}</span>
                </div>
                <div className="workspace-meta">
                  <span className="meta-label">{t('dashboard.theme')}</span>
                  <span className="meta-value">{workspace.theme}</span>
                </div>
                <div className="workspace-meta">
                  <span className="meta-label">{t('dashboard.widgets')}</span>
                  <span className="meta-value">{workspace.widgets?.length || 0}</span>
                </div>
              </div>
            )}
            <div className="workspaces-grid">
              {(featureMap[effectiveRole] || []).map((feature) => (
                <div key={feature.titleKey} className={`workspace-card ${effectiveRole}-card`}>
                  <div className="card-icon">✨</div>
                  <h4>{t(feature.titleKey)}</h4>
                  <p>{t(feature.descKey)}</p>
                  <button className="card-button">{t('cta.getStarted')}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h3>{t('analytics.title')}</h3>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">2,459</div>
                <div className="stat-label">{t('stats.activeUsers')}</div>
                <div className="stat-change positive">{t('stats.activeUsersChange')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">894</div>
                 <div className="stat-label">{t('stats.projects')}</div>
                 <div className="stat-change positive">{t('stats.projectsChange')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">98.5%</div>
                 <div className="stat-label">{t('stats.uptime')}</div>
                 <div className="stat-change neutral">{t('stats.uptimeStatus')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.9</div>
                 <div className="stat-label">{t('stats.userRating')}</div>
                 <div className="stat-change positive">★★★★★</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>{t('settings.title')}</h3>
            </div>

            <div className="settings-card theme-card">
              <h4>{t('settings.themeSelector')}</h4>
              <p>{t('settings.themeSelectorDesc')}</p>
              <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <h4>{t('settings.profile')}</h4>
                <div className="settings-item">
                  <label>Email</label>
                  <p>{userData?.email || 'N/A'}</p>
                </div>
                <div className="settings-item">
                  <label>{t('settings.name')}</label>
                  <p>{userData?.full_name || 'N/A'}</p>
                </div>
                <div className="settings-item">
                  <label>{t('settings.role')}</label>
                  <p>{t(`roles.${effectiveRole}`)}</p>
                </div>
                <button className="edit-button">{t('settings.editProfile')}</button>
              </div>

              <div className="settings-card">
                <h4>{t('settings.security')}</h4>
                <div className="settings-item">
                  <label>{t('settings.password')}</label>
                  <p>{t('settings.passwordHint')}</p>
                </div>
                <div className="settings-item">
                  <label>{t('settings.mfa')}</label>
                  <p>{t('settings.mfaStatus')}</p>
                </div>
                <button className="edit-button">{t('settings.updateSecurity')}</button>
              </div>

              <div className="settings-card">
                <h4>{t('settings.preferences')}</h4>
                <div className="settings-item">
                  <label>{t('settings.theme')}</label>
                  <p>{t('settings.themeDefault')}</p>
                </div>
                <div className="settings-item">
                  <label>{t('settings.notifications')}</label>
                  <p>{t('settings.notificationsStatus')}</p>
                </div>
                <button className="edit-button">{t('settings.managePreferences')}</button>
              </div>

              <div className="settings-card danger-zone">
                <h4>{t('settings.dangerZone')}</h4>
                <p>{t('settings.dangerDesc')}</p>
                <button className="delete-button">{t('settings.deleteAccount')}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="theme-selector-bar">
        <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
      </div>
    </div>
  );
}

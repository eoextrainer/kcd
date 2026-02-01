import { useState } from 'react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [user, setUser] = useState({
    name: 'User',
    email: 'user@example.com',
    role: 'Admin'
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
  }

  if (!isLoggedIn) {
    return (
      <div className="app-container login-page">
        <div className="login-box">
          <h1>KCD Platform</h1>
          <p>Knowledge Conversion Dashboard</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">KCD</div>
          <div className="nav-links">
            <button 
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${currentPage === 'brand' ? 'active' : ''}`}
              onClick={() => setCurrentPage('brand')}
            >
              Brand Verification
            </button>
            <button 
              className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={() => setCurrentPage('settings')}
            >
              Settings
            </button>
            <button className="nav-link logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="app-container">
        <div className="header">
          <h1>Welcome, {user.name}</h1>
          <p className="role-badge">{user.role}</p>
        </div>

        {currentPage === 'dashboard' && (
          <div className="page dashboard-page">
            <div className="page-header">
              <h2>Dashboard</h2>
              <p>Overview of your account and activities</p>
            </div>
            
            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">📊</div>
                <h3>Analytics</h3>
                <p>View your performance metrics</p>
              </div>
              
              <div className="card">
                <div className="card-icon">✓</div>
                <h3>Brand Verification</h3>
                <p>Verify your brand account</p>
              </div>
              
              <div className="card">
                <div className="card-icon">⚙️</div>
                <h3>Settings</h3>
                <p>Configure your preferences</p>
              </div>
              
              <div className="card">
                <div className="card-icon">🔒</div>
                <h3>Security</h3>
                <p>Manage your security settings</p>
              </div>
            </div>

            <div className="status-section">
              <h3>Account Status</h3>
              <div className="status-item">
                <span>Email Verified</span>
                <span className="status-badge verified">✓</span>
              </div>
              <div className="status-item">
                <span>Brand Verified</span>
                <span className="status-badge">Pending</span>
              </div>
              <div className="status-item">
                <span>2FA Enabled</span>
                <span className="status-badge verified">✓</span>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'brand' && (
          <div className="page brand-page">
            <div className="page-header">
              <h2>Brand Verification</h2>
              <p>Complete the verification process for your brand account</p>
            </div>
            
            <div className="verification-section">
              <div className="verification-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Basic Information</h3>
                  <p>Provide your brand name and description</p>
                  <button className="btn-primary">Verify</button>
                </div>
              </div>

              <div className="verification-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Documentation</h3>
                  <p>Upload required business documents</p>
                  <button className="btn-primary">Upload</button>
                </div>
              </div>

              <div className="verification-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Review</h3>
                  <p>Our team will review your application</p>
                  <span className="status-badge">In Progress</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="page settings-page">
            <div className="page-header">
              <h2>Settings</h2>
              <p>Manage your account preferences</p>
            </div>
            
            <div className="settings-section">
              <h3>Profile Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" defaultChecked />
                  Email notifications
                </label>
                <label>
                  <input type="checkbox" defaultChecked />
                  SMS alerts
                </label>
                <label>
                  <input type="checkbox" />
                  Marketing emails
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>&copy; 2026 KCD Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App

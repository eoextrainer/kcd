import { useState, useEffect } from 'react'
import './App.css'
import SplashScreen from './components/SplashScreen'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'

function App() {
  const [appState, setAppState] = useState('splash') // splash, login, dashboard
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setAppState('login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setAppState('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setAppState('login')
  }

  if (appState === 'splash') {
    return <SplashScreen />
  }

  if (appState === 'login') {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App

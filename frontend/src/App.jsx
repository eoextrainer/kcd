import React, { useState, useEffect } from 'react';
import SplashScreen3D from './components/SplashScreen3D';
import LoginPage from './components/LoginPage';
import HomeScreen from './components/HomeScreen';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        setCurrentPage('home');
      } catch (err) {
        console.error('Error parsing stored user:', err);
        setCurrentPage('login');
      }
    } else {
      setCurrentPage('splash');
    }
    setIsLoading(false);
  }, []);

  const handleSplashComplete = () => {
    setCurrentPage('login');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      {currentPage === 'splash' && (
        <SplashScreen3D onComplete={handleSplashComplete} />
      )}
      
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentPage === 'home' && user && (
        <HomeScreen onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'dashboard' && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;

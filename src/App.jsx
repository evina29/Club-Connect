import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NavigationChatbot from './components/NavigationChatbot';
import AccessibilityChatbot from './components/AccessibilityChatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClubList from './pages/ClubList';
import ClubDetails from './pages/ClubDetails';
import EventDetails from './pages/EventDetails';        
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Projects from './pages/Projects';
import Voting from './pages/Voting';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Gamification from './pages/Gamification';
import Analytics from './pages/Analytics';
import SocialFeed from './pages/SocialFeed';
import Portfolio from './pages/Portfolio';
import QRAttendance from './pages/QRAttendance';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/app/login" replace />;
  }
  
  return children;
}

function App() {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Unregister any existing service workers first (avoid cached white-screen bundles during dev)
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
      }).catch(() => {});

      // Only register service worker in production
      if (import.meta.env && import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => console.log('SW registered:', registration))
          .catch(error => console.log('SW registration failed:', error));
      }
    }
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app/login" element={<Login />} />
            <Route path="/app/register" element={<Register />} />
            
            <Route path="/clubs" element={<ProtectedRoute><AppContent /></ProtectedRoute>}>
              <Route index element={<ClubList />} />
            </Route>
            <Route path="/clubs/:id" element={<ProtectedRoute><AppContent /></ProtectedRoute>}>
              <Route index element={<ClubDetails />} />
            </Route>
            <Route path="/app" element={<ProtectedRoute><AppContent /></ProtectedRoute>}>
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="messages" element={<Messages />} />
              <Route path="projects" element={<Projects />} />
              <Route path="voting" element={<Voting />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="qr-attendance" element={<QRAttendance />} />
              <Route path="gamification" element={<Gamification />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="feed" element={<SocialFeed />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="settings" element={<Settings />} />
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

function AppContent() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
      <NavigationChatbot />
      <AccessibilityChatbot />
      <Navbar />
    </div>
  );
}

export default App;
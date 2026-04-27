import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="gradient-mesh" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 10 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>Loading CartIQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-mesh noise-bg" style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div style={{ position: 'relative', zIndex: 10 }}>
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={!user ? <Landing /> : (profile?.onboarded ? <Navigate to="/dashboard" /> : <Navigate to="/onboarding" />)} />
          <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

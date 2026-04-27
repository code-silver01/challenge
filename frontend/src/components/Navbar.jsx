import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, demoMode, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={18} color="#fff" />
        </div>
        <span className="font-heading" style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
          Cart<span style={{ color: 'var(--accent)' }}>IQ</span>
        </span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {demoMode && (
          <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', fontWeight: 500 }}>
            Demo Mode
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-2)' }}>
          <User size={16} />
          <span>{user?.displayName || user?.email || 'User'}</span>
        </div>
        <button
          onClick={logout}
          style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--danger)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

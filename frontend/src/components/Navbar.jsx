import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, demoMode, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
          <ShoppingCart size={18} className="text-white" />
        </div>
        <span className="font-[var(--font-display)] font-bold text-lg tracking-tight">
          Cart<span className="text-[var(--color-accent)]">IQ</span>
        </span>
      </button>

      <div className="flex items-center gap-3">
        {demoMode && (
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] font-medium">
            Demo Mode
          </span>
        )}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <User size={16} />
          <span className="hidden sm:inline">{user?.displayName || user?.email || 'User'}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-danger)] cursor-pointer"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

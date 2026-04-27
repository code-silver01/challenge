import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getUserProfile } from '../services/dataLayer';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const p = await getUserProfile(fbUser.uid);
          setProfile(p);
        } catch { setProfile(null); }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    setDemoMode(false);
  };

  const enterDemoMode = (demoProfile) => {
    setDemoMode(true);
    setUser({ uid: 'demo-user', displayName: 'Demo User', email: 'demo@cartiq.app' });
    setProfile(demoProfile);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading, demoMode, loginWithGoogle, logout, enterDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

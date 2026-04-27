import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Zap, Brain, TrendingUp, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { loginWithGoogle, enterDemoMode } = useAuth();

  const handleDemo = () => {
    enterDemoMode({
      dietType: 'non-veg',
      cookingFrequency: 'rarely',
      lifestyle: 'working professional',
      goal: 'eat healthier',
      onboarded: true,
      neverSuggest: [],
    });
  };

  const features = [
    { icon: <ShoppingCart size={24} />, title: 'Smart Cart Parsing', desc: 'Paste your cart or scan a receipt — instant nutrition breakdown' },
    { icon: <Brain size={24} />, title: 'Behavior Intelligence', desc: 'Learns your habits and spots patterns you might miss' },
    { icon: <Zap size={24} />, title: 'AI Optimization', desc: '3-5 high-impact swaps, zero extra effort' },
    { icon: <TrendingUp size={24} />, title: 'Visual Impact', desc: 'See before vs after — protein up, junk down, effort same' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-[var(--color-text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            AI-Powered Grocery Intelligence
          </div>

          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Stop shopping on
            <span className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-accent)] bg-clip-text text-transparent"> autopilot</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 max-w-lg mx-auto leading-relaxed">
            CartIQ analyzes your grocery cart and gives you the minimum changes for maximum nutritional impact. Same effort, better food.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={loginWithGoogle}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold text-lg shadow-lg glow-primary cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDemo}
              className="px-8 py-4 rounded-2xl glass text-[var(--color-text-primary)] font-semibold text-lg cursor-pointer flex items-center justify-center gap-2 hover:border-[var(--color-primary)]/40 transition-colors"
            >
              Try Demo
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl w-full px-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card p-6 flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-primary-light)]">
                {f.icon}
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-[var(--color-text-muted)]">
        Built with AI agents on Google Cloud
      </footer>
    </div>
  );
}

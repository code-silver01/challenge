import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { parseCart, computeCartStats } from '../agents/cartParser';
import { analyzeBehavior } from '../agents/behaviorAgent';
import { getContextSignals } from '../agents/contextEngine';
import { generateOptimizations, computeImpact } from '../agents/optimizationAgent';
import CartInput from '../components/CartInput';
import CartSummary from '../components/CartSummary';
import InsightCard from '../components/InsightCard';
import SuggestionCard from '../components/SuggestionCard';
import ImpactChart from '../components/ImpactChart';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const cart = useCart();
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = useCallback(async (text) => {
    setAnalyzing(true);
    cart.setRawInput(text);

    // Small delay so the loading overlay renders
    await new Promise(r => setTimeout(r, 300));

    const items = await parseCart(text);
    cart.setParsedItems(items);
    const stats = computeCartStats(items);
    cart.setCartStats(stats);

    const behavior = analyzeBehavior([]);
    cart.setBehaviorProfile(behavior);

    const ctx = getContextSignals(profile || {});
    cart.setContextSignals(ctx);

    const suggs = generateOptimizations(items, behavior, ctx, profile?.neverSuggest || []);
    cart.setSuggestions(suggs);

    const imp = computeImpact(items, suggs);
    cart.setImpact(imp);

    cart.setStep('results');
    setAnalyzing(false);
  }, [profile, cart]);

  const handleReset = () => cart.reset();

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 80px' }}>
      <AnimatePresence mode="wait">
        {cart.step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 className="font-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 12 }}>
                What's in your cart?
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-2)' }}>
                Paste your grocery list and let AI optimize it
              </p>
            </div>
            <CartInput onAnalyze={runAnalysis} analyzing={analyzing} />
          </motion.div>
        )}

        {cart.step === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={24} color="var(--accent)" />
                  Cart Analysis
                </h1>
                <p style={{ color: 'var(--text-2)', marginTop: 4, fontSize: 14 }}>
                  {cart.parsedItems.length} items analyzed · {cart.suggestions.length} optimizations found
                </p>
              </div>
              <button className="btn-glass" onClick={handleReset} style={{ padding: '10px 20px', fontSize: 14 }}>
                <RotateCcw size={16} /> New Cart
              </button>
            </div>

            {/* Results sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <CartSummary items={cart.parsedItems} stats={cart.cartStats} />
              {cart.behaviorProfile && cart.contextSignals && (
                <InsightCard behavior={cart.behaviorProfile} context={cart.contextSignals} />
              )}
              {cart.suggestions.length > 0 && (
                <div>
                  <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recommended Changes</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {cart.suggestions.map((s, i) => (
                      <SuggestionCard key={i} suggestion={s} index={i} />
                    ))}
                  </div>
                </div>
              )}
              {cart.impact && <ImpactChart impact={cart.impact} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,17,23,0.85)', backdropFilter: 'blur(8px)' }}>
            <div className="glass-card" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div className="spinner" />
              <div style={{ textAlign: 'center' }}>
                <p className="font-heading" style={{ fontWeight: 600, fontSize: 18 }}>Analyzing your cart...</p>
                <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>Running 4 AI agents</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

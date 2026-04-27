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
import { Sparkles, RotateCcw, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const cart = useCart();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = useCallback(async (text) => {
    setAnalyzing(true);
    cart.setRawInput(text);

    // Agent 1: Parse cart
    const items = await parseCart(text);
    cart.setParsedItems(items);
    const stats = computeCartStats(items);
    cart.setCartStats(stats);

    // Agent 2: Behavior analysis
    const behavior = analyzeBehavior([]);
    cart.setBehaviorProfile(behavior);

    // Agent 3: Context signals
    const ctx = getContextSignals(profile || {});
    cart.setContextSignals(ctx);

    // Agent 4: Optimization
    const suggs = generateOptimizations(items, behavior, ctx, profile?.neverSuggest || []);
    cart.setSuggestions(suggs);

    const imp = computeImpact(items, suggs);
    cart.setImpact(imp);

    cart.setStep('results');
    setAnalyzing(false);
  }, [profile, cart]);

  const handleReset = () => {
    cart.reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      <AnimatePresence mode="wait">
        {cart.step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold mb-3">
                What's in your cart?
              </h1>
              <p className="text-[var(--color-text-secondary)] text-lg">
                Paste your grocery list and let AI optimize it
              </p>
            </div>
            <CartInput onAnalyze={handleAnalyze} analyzing={analyzing} />
          </motion.div>
        )}

        {cart.step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <Sparkles size={24} className="text-[var(--color-accent)]" />
                  Cart Analysis
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  {cart.parsedItems.length} items analyzed · {cart.suggestions.length} optimizations found
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl glass text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw size={16} /> New Cart
              </button>
            </div>

            {/* Cart Summary */}
            <CartSummary items={cart.parsedItems} stats={cart.cartStats} />

            {/* Insight Card */}
            {cart.behaviorProfile && cart.contextSignals && (
              <InsightCard behavior={cart.behaviorProfile} context={cart.contextSignals} />
            )}

            {/* Optimization Suggestions */}
            {cart.suggestions.length > 0 && (
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-semibold mb-4">
                  Recommended Changes
                </h2>
                <div className="space-y-3">
                  {cart.suggestions.map((s, i) => (
                    <SuggestionCard key={i} suggestion={s} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Before vs After */}
            {cart.impact && (
              <ImpactChart impact={cart.impact} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-surface)]/80 backdrop-blur-sm"
          >
            <div className="glass-card p-8 flex flex-col items-center gap-4">
              <Loader2 size={40} className="text-[var(--color-primary)] animate-spin" />
              <div className="text-center">
                <p className="font-[var(--font-display)] font-semibold text-lg">Analyzing your cart...</p>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">Running 4 AI agents</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

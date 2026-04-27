import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveUserProfile } from '../services/dataLayer';
import { Salad, Beef, Leaf, ChefHat, Clock, Zap, Heart, DollarSign, Recycle, Dumbbell, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const STEPS = [
  {
    title: 'What do you eat?',
    subtitle: 'This helps us filter suggestions',
    field: 'dietType',
    options: [
      { value: 'veg', label: 'Vegetarian', icon: <Salad size={28} />, color: '#06d6a0' },
      { value: 'non-veg', label: 'Non-Vegetarian', icon: <Beef size={28} />, color: '#ef4444' },
      { value: 'vegan', label: 'Vegan', icon: <Leaf size={28} />, color: '#22c55e' },
    ],
  },
  {
    title: 'How often do you cook?',
    subtitle: 'We won\'t suggest complex recipes if you rarely cook',
    field: 'cookingFrequency',
    options: [
      { value: 'daily', label: 'Daily', icon: <ChefHat size={28} />, color: '#06d6a0' },
      { value: 'a few times a week', label: 'A few times/week', icon: <Clock size={28} />, color: '#f59e0b' },
      { value: 'rarely', label: 'Rarely', icon: <Zap size={28} />, color: '#ef4444' },
    ],
  },
  {
    title: 'What\'s your goal?',
    subtitle: 'We\'ll prioritize suggestions accordingly',
    field: 'goal',
    options: [
      { value: 'eat healthier', label: 'Eat Healthier', icon: <Heart size={28} />, color: '#06d6a0' },
      { value: 'save money', label: 'Save Money', icon: <DollarSign size={28} />, color: '#f59e0b' },
      { value: 'reduce waste', label: 'Reduce Waste', icon: <Recycle size={28} />, color: '#22c55e' },
      { value: 'build muscle', label: 'Build Muscle', icon: <Dumbbell size={28} />, color: '#6366f1' },
    ],
  },
];

export default function Onboarding() {
  const { user, setProfile, demoMode } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const step = STEPS[current];
  const selected = answers[step.field];

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [step.field]: value }));
  };

  const handleNext = async () => {
    if (current < STEPS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setSaving(true);
      const profile = {
        ...answers,
        lifestyle: 'working professional',
        onboarded: true,
        neverSuggest: [],
      };
      if (!demoMode) {
        try { await saveUserProfile(user.uid, profile); } catch (e) { console.warn('Firestore save failed:', e); }
      }
      setProfile(profile);
      setSaving(false);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--color-surface-elevated)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                initial={{ width: 0 }}
                animate={{ width: i <= current ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-2">{step.title}</h2>
            <p className="text-[var(--color-text-secondary)] mb-8">{step.subtitle}</p>

            <div className="grid grid-cols-1 gap-3">
              {step.options.map(opt => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full p-5 rounded-2xl flex items-center gap-4 text-left cursor-pointer transition-all duration-200 ${
                    selected === opt.value
                      ? 'glass border-[var(--color-primary)]/50 glow-primary'
                      : 'glass-card hover:border-[var(--color-border)]'
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${opt.color}15`, color: opt.color }}
                  >
                    {opt.icon}
                  </div>
                  <span className="font-semibold text-lg">{opt.label}</span>
                  {selected === opt.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center"
                    >
                      <Check size={16} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="px-6 py-3 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <motion.button
            whileHover={{ scale: selected ? 1.03 : 1 }}
            whileTap={{ scale: selected ? 0.97 : 1 }}
            onClick={handleNext}
            disabled={!selected || saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-lg"
          >
            {saving ? 'Saving...' : current === STEPS.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

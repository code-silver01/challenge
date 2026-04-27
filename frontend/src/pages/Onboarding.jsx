import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveUserProfile } from '../services/dataLayer';
import { Salad, Beef, Leaf, ChefHat, Clock, Zap, Heart, DollarSign, Recycle, Dumbbell, ArrowRight, ArrowLeft, Check, Briefcase, Laptop, Home } from 'lucide-react';

const STEPS = [
  { title: "What's your primary occupation?", subtitle: "Helps us understand your daily schedule and lifestyle", field: 'lifestyle', options: [
    { value: 'student', label: 'Student', icon: <Laptop size={28} />, color: '#6366f1' },
    { value: 'working professional', label: 'Working Professional', icon: <Briefcase size={28} />, color: '#06d6a0' },
    { value: 'homemaker', label: 'Homemaker', icon: <Home size={28} />, color: '#f59e0b' },
  ]},
  { title: "What do you eat?", subtitle: "This helps us filter suggestions", field: 'dietType', options: [
    { value: 'veg', label: 'Vegetarian', icon: <Salad size={28} />, color: '#06d6a0' },
    { value: 'non-veg', label: 'Non-Vegetarian', icon: <Beef size={28} />, color: '#ef4444' },
    { value: 'vegan', label: 'Vegan', icon: <Leaf size={28} />, color: '#22c55e' },
  ]},
  { title: "How often do you cook?", subtitle: "We won't suggest complex recipes if you rarely cook", field: 'cookingFrequency', options: [
    { value: 'daily', label: 'Daily', icon: <ChefHat size={28} />, color: '#06d6a0' },
    { value: 'a few times a week', label: 'A few times/week', icon: <Clock size={28} />, color: '#f59e0b' },
    { value: 'rarely', label: 'Rarely', icon: <Zap size={28} />, color: '#ef4444' },
  ]},
  { title: "What's your primary goal?", subtitle: "We'll prioritize suggestions accordingly", field: 'goal', options: [
    { value: 'eat healthier', label: 'Eat Healthier', icon: <Heart size={28} />, color: '#06d6a0' },
    { value: 'save money', label: 'Save Money', icon: <DollarSign size={28} />, color: '#f59e0b' },
    { value: 'reduce waste', label: 'Reduce Waste', icon: <Recycle size={28} />, color: '#22c55e' },
    { value: 'build muscle', label: 'Build Muscle', icon: <Dumbbell size={28} />, color: '#6366f1' },
  ]},
];

export default function Onboarding() {
  const { user, setProfile, demoMode } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const step = STEPS[current];
  const selected = answers[step.field];

  const handleNext = async () => {
    if (current < STEPS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setSaving(true);
      const profile = { ...answers, onboarded: true, neverSuggest: [] };
      if (!demoMode) {
        try { await saveUserProfile(user.uid, profile); } catch (e) { console.warn('Save failed:', e); }
      }
      setProfile(profile);
      setSaving(false);
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--surface-elevated)' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
                initial={{ width: 0 }}
                animate={{ width: i <= current ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{step.title}</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>{step.subtitle}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {step.options.map(opt => {
                const isSelected = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers(prev => ({ ...prev, [step.field]: opt.value }))}
                    className={isSelected ? 'glow-primary' : ''}
                    style={{
                      width: '100%', padding: 20, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16,
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                      background: isSelected ? 'rgba(99,102,241,0.12)' : 'rgba(37,40,56,0.5)',
                      border: isSelected ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.1)',
                      color: 'var(--text-1)',
                    }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${opt.color}18`, color: opt.color, flexShrink: 0 }}>
                      {opt.icon}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 17 }}>{opt.label}</span>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={16} color="#fff" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button onClick={() => current > 0 && setCurrent(c => c - 1)} disabled={current === 0}
            style={{ padding: '12px 24px', borderRadius: 12, background: 'none', border: 'none', color: current === 0 ? 'var(--text-3)' : 'var(--text-2)', cursor: current === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: current === 0 ? 0.3 : 1 }}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="btn-primary" onClick={handleNext} disabled={!selected || saving}
            style={{ padding: '12px 32px', opacity: !selected ? 0.4 : 1 }}>
            {saving ? 'Saving...' : current === STEPS.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

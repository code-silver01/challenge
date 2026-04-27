import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, ArrowRight, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addToNeverSuggest } from '../services/dataLayer';

const BADGE_MAP = {
  'ADD': { icon: <Plus size={14} />, class: 'badge-add', color: '#06d6a0' },
  'REPLACE': { icon: <ArrowRight size={14} />, class: 'badge-replace', color: '#818cf8' },
  'REMOVE': { icon: <X size={14} />, class: 'badge-remove', color: '#ef4444' },
};

export default function SuggestionCard({ suggestion, index }) {
  const { user, demoMode, profile, setProfile } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleFeedback = async (type) => {
    setFeedback(type);
    if (type === 'down' && user && !demoMode) {
      try {
        const itemName = suggestion.replacement || suggestion.item;
        const newNever = [...(profile?.neverSuggest || []), itemName];
        await addToNeverSuggest(user.uid, itemName);
        setProfile(p => ({ ...p, neverSuggest: newNever }));
      } catch (e) {
        console.warn('Feedback save failed', e);
      }
      setTimeout(() => setDismissed(true), 1500);
    } else if (type === 'down' && demoMode) {
      setTimeout(() => setDismissed(true), 1500);
    }
  };

  const badge = BADGE_MAP[suggestion.type] || BADGE_MAP.ADD;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className={badge.class} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {badge.icon} {suggestion.type}
            </span>
            {suggestion.proteinDelta > 0 && (
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>+{suggestion.proteinDelta}g Protein</span>
            )}
          </div>
          
          <div className="font-heading" style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {suggestion.type === 'REPLACE' ? (
              <>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-3)' }}>{suggestion.item}</span>
                <ArrowRight size={18} color="var(--text-3)" />
                <span style={{ color: badge.color }}>{suggestion.replacement}</span>
              </>
            ) : suggestion.type === 'REMOVE' ? (
              <span style={{ textDecoration: 'line-through', color: 'var(--danger)' }}>{suggestion.item}</span>
            ) : (
              <span style={{ color: badge.color }}>{suggestion.item}</span>
            )}
          </div>
          
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
            {suggestion.reason}
          </p>
        </div>

        {/* Feedback buttons */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => handleFeedback('up')} disabled={feedback !== null}
            style={{ padding: 8, borderRadius: 8, border: 'none', cursor: feedback ? 'default' : 'pointer', transition: 'all 0.2s',
              background: feedback === 'up' ? 'rgba(6,214,160,0.2)' : 'rgba(255,255,255,0.05)',
              color: feedback === 'up' ? '#06d6a0' : 'var(--text-3)' }}>
            <ThumbsUp size={16} />
          </button>
          <button onClick={() => handleFeedback('down')} disabled={feedback !== null}
            style={{ padding: 8, borderRadius: 8, border: 'none', cursor: feedback ? 'default' : 'pointer', transition: 'all 0.2s',
              background: feedback === 'down' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
              color: feedback === 'down' ? '#ef4444' : 'var(--text-3)' }}>
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {feedback === 'down' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8 }}>
            Got it. We won't suggest {suggestion.replacement || suggestion.item} again.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

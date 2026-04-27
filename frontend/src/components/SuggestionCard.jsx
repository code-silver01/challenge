import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { addToNeverSuggest, saveSuggestionFeedback } from '../services/dataLayer';
import { Plus, ArrowRightLeft, Trash2, ThumbsUp, ThumbsDown, Check } from 'lucide-react';

const TYPE_CONFIG = {
  ADD: { icon: <Plus size={16} />, class: 'badge-add', label: 'ADD' },
  REPLACE: { icon: <ArrowRightLeft size={16} />, class: 'badge-replace', label: 'REPLACE' },
  REMOVE: { icon: <Trash2 size={16} />, class: 'badge-remove', label: 'REMOVE' },
};

export default function SuggestionCard({ suggestion, index }) {
  const { user, demoMode } = useAuth();
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null
  const config = TYPE_CONFIG[suggestion.type] || TYPE_CONFIG.ADD;

  const handleFeedback = async (type) => {
    setFeedback(type);
    if (!demoMode && user?.uid) {
      try {
        await saveSuggestionFeedback(user.uid, suggestion, type === 'up');
        if (type === 'down') {
          const item = suggestion.replacement || suggestion.item;
          await addToNeverSuggest(user.uid, item);
        }
      } catch (e) { console.warn('Feedback save failed:', e); }
    }
  };

  const buildDescription = () => {
    if (suggestion.type === 'REPLACE') {
      return `Swap ${suggestion.item} → ${suggestion.replacement}`;
    }
    if (suggestion.type === 'REMOVE') {
      return `Remove ${suggestion.item}`;
    }
    return `Add ${suggestion.item}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="glass-card p-4 sm:p-5 flex items-start gap-4 group hover:border-[var(--color-primary)]/30 transition-colors"
    >
      {/* Badge */}
      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1 shrink-0 ${config.class}`}>
        {config.icon}
        {config.label}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base">{buildDescription()}</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{suggestion.reason}</p>
        {suggestion.proteinDelta > 0 && (
          <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
            +{suggestion.proteinDelta}g protein/week
          </span>
        )}
      </div>

      {/* Feedback */}
      <div className="flex flex-col gap-1 shrink-0">
        {feedback ? (
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <Check size={14} className="text-[var(--color-accent)]" />
            {feedback === 'down' ? "Won't suggest again" : 'Noted!'}
          </div>
        ) : (
          <>
            <button
              onClick={() => handleFeedback('up')}
              className="p-2 rounded-lg hover:bg-[var(--color-accent)]/15 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
              title="Good suggestion"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              className="p-2 rounded-lg hover:bg-[var(--color-danger)]/15 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
              title="Don't suggest this"
            >
              <ThumbsDown size={16} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

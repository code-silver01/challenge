import { motion } from 'framer-motion';
import { Brain, Calendar, Sun } from 'lucide-react';

export default function InsightCard({ behavior, context }) {
  // Build conversational insight
  const lines = [];
  if (behavior.traits.includes('low-protein buyer')) {
    lines.push(`You tend to skip protein${context.isWeekday ? ' on weekdays' : ''}.`);
  }
  if (behavior.traits.includes('snack-heavy')) {
    lines.push(`Snacks make up ${behavior.snackDependencyRatio}% of your usual cart.`);
  }
  if (behavior.traits.includes('quick-meal dependent')) {
    lines.push("You lean toward quick meals — we'll keep suggestions low-effort.");
  }
  if (context.isWeekday) {
    lines.push(`It's ${context.dayName} — a busy day. No complex recipes today.`);
  }
  if (lines.length === 0) {
    lines.push("Looking at your patterns to find smart swaps...");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 border-l-4 border-[var(--color-primary)]"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center shrink-0 mt-0.5">
          <Brain size={20} className="text-[var(--color-primary-light)]" />
        </div>
        <div className="flex-1">
          <h3 className="font-[var(--font-display)] font-semibold text-base mb-1.5">Behavior Insight</h3>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            {lines.join(' ')}
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Calendar size={12} /> {context.dayName}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Sun size={12} /> {context.season} season
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-light)]">
              {behavior.profileSummary}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { TrendingUp, Equal } from 'lucide-react';

function Bar({ label, before, after, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-mono text-xs text-[var(--color-text-muted)]">{before}% → {after}%</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-6 rounded-lg bg-[var(--color-surface-elevated)] overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${before}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-lg opacity-40"
            style={{ background: color }}
          />
          <span className="absolute inset-0 flex items-center pl-2 text-xs font-medium opacity-60">Before</span>
        </div>
        <div className="flex-1 h-6 rounded-lg bg-[var(--color-surface-elevated)] overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${after}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-lg"
            style={{ background: color }}
          />
          <span className="absolute inset-0 flex items-center pl-2 text-xs font-medium text-white mix-blend-difference">After</span>
        </div>
      </div>
    </div>
  );
}

export default function ImpactChart({ impact }) {
  if (!impact) return null;

  const { before, after, totalProteinDelta, effortChange } = impact;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[var(--font-display)] text-xl font-semibold flex items-center gap-2">
          <TrendingUp size={20} className="text-[var(--color-accent)]" />
          Before vs After
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <Equal size={16} className="text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-text-secondary)]">Effort: {effortChange}</span>
        </div>
      </div>

      <div className="space-y-5">
        <Bar
          label="Protein"
          before={before.proteinPercent}
          after={after.proteinPercent}
          color="#06d6a0"
        />
        <Bar
          label="Junk Food"
          before={before.junkPercent}
          after={after.junkPercent}
          color="#ef4444"
        />
        <Bar
          label="Fresh Produce"
          before={before.freshPercent}
          after={after.freshPercent}
          color="#22c55e"
        />
      </div>

      {totalProteinDelta > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent border border-[var(--color-accent)]/20 text-center"
        >
          <span className="text-[var(--color-accent)] font-bold text-lg">+{totalProteinDelta}g protein/week</span>
          <span className="text-[var(--color-text-secondary)] text-sm ml-2">with the same effort</span>
        </motion.div>
      )}
    </motion.div>
  );
}

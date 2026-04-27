import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  'Protein': '#06d6a0',
  'Carbs': '#f59e0b',
  'Fats': '#f97316',
  'Processed/Junk': '#ef4444',
  'Fresh Produce': '#22c55e',
  'Dairy': '#60a5fa',
  'Beverages': '#a78bfa',
  'Other': '#94a3b8',
};

export default function CartSummary({ items, stats }) {
  if (!items || !stats) return null;

  const statCards = [
    { label: 'Total Protein', value: `${stats.totalProteinG}g`, sub: `${stats.proteinPercent}% of cart`, color: '#06d6a0' },
    { label: 'Total Carbs', value: `${stats.totalCarbsG}g`, sub: '', color: '#f59e0b' },
    { label: 'Junk Items', value: `${stats.junkPercent}%`, sub: 'of cart', color: '#ef4444' },
    { label: 'Fresh Produce', value: `${stats.freshPercent}%`, sub: 'of cart', color: '#22c55e' },
  ];

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            {s.sub && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Item Tags */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Parsed Items</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: `${CATEGORY_COLORS[item.category] || '#94a3b8'}15`,
                color: CATEGORY_COLORS[item.category] || '#94a3b8',
                border: `1px solid ${CATEGORY_COLORS[item.category] || '#94a3b8'}30`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[item.category] }} />
              {item.name}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

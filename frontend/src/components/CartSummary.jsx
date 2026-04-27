import { motion } from 'framer-motion';

const CAT_COLORS = {
  'Protein': '#06d6a0', 'Carbs': '#f59e0b', 'Fats': '#f97316',
  'Processed/Junk': '#ef4444', 'Fresh Produce': '#22c55e',
  'Dairy': '#60a5fa', 'Beverages': '#a78bfa', 'Other': '#94a3b8',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 4, color: s.color }}>{s.value}</p>
            {s.sub && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Item tags */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>Parsed Items</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {items.map((item, i) => {
            const clr = CAT_COLORS[item.category] || '#94a3b8';
            return (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99,
                  fontSize: 13, fontWeight: 500, background: `${clr}18`, color: clr, border: `1px solid ${clr}30`,
                }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: clr, display: 'inline-block' }} />
                {item.name}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

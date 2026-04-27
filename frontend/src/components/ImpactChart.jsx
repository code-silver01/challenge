import { motion } from 'framer-motion';

export default function ImpactChart({ impact }) {
  if (!impact || !impact.before || !impact.after) return null;

  const metrics = [
    { label: 'Protein Ratio', before: impact.before.proteinPercent, after: impact.after.proteinPercent, color: '#06d6a0', goodIsUp: true },
    { label: 'Processed / Junk', before: impact.before.junkPercent, after: impact.after.junkPercent, color: '#ef4444', goodIsUp: false },
    { label: 'Fresh Produce', before: impact.before.freshPercent, after: impact.after.freshPercent, color: '#22c55e', goodIsUp: true },
  ];

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Projected Impact</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {metrics.map((m, i) => {
          const delta = m.after - m.before;
          const isPositive = m.goodIsUp ? delta > 0 : delta < 0;
          const isNeutral = delta === 0;

          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span style={{ fontWeight: 500, color: 'var(--text-1)' }}>{m.label}</span>
                <span style={{ fontWeight: 600, color: isNeutral ? 'var(--text-3)' : isPositive ? '#06d6a0' : '#ef4444' }}>
                  {delta > 0 ? '+' : ''}{delta}%
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ width: 40, fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>Before</span>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.before}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ height: '100%', background: 'var(--text-3)', borderRadius: 4 }} />
                </div>
                <span style={{ width: 30, fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{m.before}%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                <span style={{ width: 40, fontSize: 12, color: m.color, textAlign: 'right', fontWeight: 600 }}>After</span>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.after}%` }} transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ height: '100%', background: m.color, borderRadius: 4, boxShadow: `0 0 10px ${m.color}80` }} />
                </div>
                <span style={{ width: 30, fontSize: 12, fontWeight: 700, color: m.color }}>{m.after}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-clr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, color: 'var(--text-2)' }}>Effort Change</span>
        <span style={{ fontSize: 14, fontWeight: 600, padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.1)', color: 'var(--text-1)' }}>
          {impact.effortChange}
        </span>
      </div>
    </div>
  );
}

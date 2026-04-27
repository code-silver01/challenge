import { motion } from 'framer-motion';
import { Brain, Clock, Zap } from 'lucide-react';

export default function InsightCard({ behavior, context }) {
  if (!behavior || !context) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {/* Behavior Agent */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} />
          </div>
          <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 600 }}>Behavior Intel</h3>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {behavior.traits?.map((t, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-1)' }}>
              <span style={{ color: 'var(--primary-light)', marginTop: 2 }}>•</span>
              <span style={{ textTransform: 'capitalize' }}>{t}</span>
            </li>
          ))}
          {(!behavior.traits || behavior.traits.length === 0) && (
            <li style={{ color: 'var(--text-3)', fontSize: 14 }}>Balanced shopping pattern detected</li>
          )}
        </ul>
      </motion.div>

      {/* Context Engine */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: 'radial-gradient(circle, rgba(6,214,160,0.2) 0%, transparent 70%)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(6,214,160,0.15)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
          <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 600 }}>Context Signals</h3>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {context.insights?.map((ins, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-1)' }}>
              <span style={{ color: 'var(--accent)', marginTop: 2 }}><Zap size={14} /></span>
              <span>{ins}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

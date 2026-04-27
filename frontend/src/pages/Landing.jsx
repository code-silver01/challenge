import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Zap, Brain, TrendingUp, ArrowRight, ShieldCheck, Camera, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const { loginWithGoogle, enterDemoMode } = useAuth();

  const handleDemo = () => {
    enterDemoMode({
      onboarded: false,
    });
  };

  const features = [
    { icon: <Camera size={28} />, title: 'Smart Receipt Scanning', desc: 'Just take a photo of your grocery receipt or type out your list. Our AI instantly categorizes and analyzes every item.' },
    { icon: <Brain size={28} />, title: 'Behavior Intelligence', desc: 'The system learns your shopping habits, detecting hidden patterns like high snack dependency or protein deficits.' },
    { icon: <Zap size={28} />, title: 'Contextual AI Optimization', desc: 'Recommends 3-5 high-impact, low-effort swaps based on the season, time of day, and your willingness to cook.' },
    { icon: <TrendingUp size={28} />, title: 'Visual Impact Charts', desc: 'See the precise projected improvement in your diet before you even buy the groceries.' },
  ];

  const steps = [
    { num: '01', title: 'Upload or Type', desc: 'Input your grocery list into the app.' },
    { num: '02', title: 'AI Analysis', desc: '4 discrete agents analyze nutrition, behavior, and context.' },
    { num: '03', title: 'Review Swaps', desc: 'Get smart suggestions (e.g., swap chips for nuts).' },
    { num: '04', title: 'Shop Smarter', desc: 'Make small changes with massive health impacts.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px', textAlign: 'center', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ maxWidth: 800, width: '100%', zIndex: 10 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 99, fontSize: 14, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 10px var(--accent)' }} />
            The Future of Grocery Shopping
          </div>

          <h1 className="font-heading" style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Upgrade your diet without <br/>
            <span style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              changing your routine.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'var(--text-2)', marginBottom: 48, maxWidth: 650, margin: '0 auto 48px', lineHeight: 1.6 }}>
            CartIQ is a multi-agent AI engine that analyzes your grocery cart and provides the minimum possible changes for maximum nutritional impact.
          </p>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary glow-primary" onClick={handleDemo} style={{ fontSize: 18, padding: '18px 36px', borderRadius: 20 }}>
              Get Started for Free
            </button>
            <button className="btn-glass" onClick={handleDemo} style={{ fontSize: 18, padding: '18px 36px', borderRadius: 20 }}>
              View Interactive Demo <ArrowRight size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 40, color: 'var(--text-3)', fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={16} color="var(--primary)" /> Privacy First</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={16} color="var(--accent)" /> AI Powered</span>
          </div>

        </motion.div>
      </div>

      {/* How it Works Section */}
      <div style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-clr)', borderBottom: '1px solid var(--border-clr)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="font-heading" style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>How CartIQ Works</h2>
            <p style={{ color: 'var(--text-2)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>A seamless pipeline designed to optimize your cart in seconds.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: 'rgba(255,255,255,0.03)', position: 'absolute', top: 10, right: 10, fontFamily: 'var(--font-heading)' }}>
                  {step.num}
                </div>
                <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--text-1)' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ padding: '100px 20px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 className="font-heading" style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Powerful Agentic Architecture</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Powered by 4 independent AI agents working together to analyze your behavior and suggest intelligent swaps.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card" style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 16, transition: 'transform 0.3s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,214,160,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)' }}>
                {f.icon}
              </div>
              <h3 className="font-heading" style={{ fontWeight: 700, fontSize: 22 }}>{f.title}</h3>
              <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(0deg, rgba(99,102,241,0.05) 0%, transparent 100%)' }}>
        <h2 className="font-heading" style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Ready to optimize your groceries?</h2>
        <button className="btn-primary glow-primary" onClick={handleDemo} style={{ fontSize: 18, padding: '16px 36px', borderRadius: 20 }}>
          Try the Demo Now
        </button>
      </div>

      <footer style={{ textAlign: 'center', padding: '40px 20px', fontSize: 14, color: 'var(--text-3)', borderTop: '1px solid var(--border-clr)' }}>
        CartIQ Assist &copy; 2024 · Built with AI agents on Google Cloud
      </footer>
    </div>
  );
}

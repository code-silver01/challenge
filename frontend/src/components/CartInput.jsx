import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Type, Camera, Sparkles, Upload, X, Zap } from 'lucide-react';

const DEMO_CART = 'Maggi, chips, biscuits, white bread, butter, cola, eggs, banana';

export default function CartInput({ onAnalyze, analyzing }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const onDrop = useCallback((files) => {
    if (files.length > 0) setImageFile(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const handleSubmit = () => {
    if (mode === 'text' && text.trim()) {
      onAnalyze(text.trim());
    } else if (mode === 'image' && imageFile) {
      onAnalyze(DEMO_CART);
    }
  };

  const loadDemoAndAnalyze = () => {
    setText(DEMO_CART);
    onAnalyze(DEMO_CART);
  };

  const itemCount = text.split(/[,\n;]+/).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Demo Button — prominent */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={loadDemoAndAnalyze}
        disabled={analyzing}
        className="glow-accent"
        style={{
          width: '100%', padding: 18, borderRadius: 16, cursor: 'pointer', marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(6,214,160,0.15), rgba(99,102,241,0.1))',
          border: '1px solid rgba(6,214,160,0.3)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-heading)',
        }}
      >
        <Zap size={20} />
        🎯 Try Demo: "Maggi, chips, biscuits, bread, butter, cola, eggs, banana"
      </motion.button>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, padding: 4, borderRadius: 12, background: 'var(--surface-elevated)', width: 'fit-content', margin: '0 auto 20px' }}>
        {[{ m: 'text', icon: <Type size={16} />, label: 'Type / Paste' }, { m: 'image', icon: <Camera size={16} />, label: 'Scan Receipt' }].map(t => (
          <button key={t.m} onClick={() => setMode(t.m)}
            style={{
              padding: '10px 20px', borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: 'pointer', border: 'none',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              background: mode === t.m ? 'var(--primary)' : 'transparent',
              color: mode === t.m ? '#fff' : 'var(--text-2)',
              boxShadow: mode === t.m ? '0 2px 12px rgba(99,102,241,0.3)' : 'none',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Text Mode */}
      {mode === 'text' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card" style={{ padding: 4 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={"Type or paste your grocery items here...\n\nExample: Maggi, chips, biscuits, white bread, butter, cola, eggs, banana\n\nSeparate items with commas, new lines, or semicolons"}
              rows={6}
              style={{
                width: '100%', background: 'transparent', padding: '16px 20px', border: 'none', outline: 'none', resize: 'none',
                color: 'var(--text-1)', fontSize: 15, lineHeight: 1.6, fontFamily: 'var(--font-body)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <button onClick={() => setText(DEMO_CART)}
              style={{ fontSize: 14, color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Load demo cart
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{itemCount} items detected</span>
          </div>
        </motion.div>
      )}

      {/* Image Mode */}
      {mode === 'image' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {!imageFile ? (
            <div {...getRootProps()} className="glass-card"
              style={{ padding: 48, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', border: isDragActive ? '1px solid var(--primary)' : undefined }}>
              <input {...getInputProps()} />
              <Upload size={40} color="var(--text-3)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>{isDragActive ? 'Drop your receipt here' : 'Drag & drop a grocery receipt'}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8, marginBottom: 16 }}>or click to browse · PNG, JPG, WEBP</p>
              <a href="/demo-receipt.png" download="demo-receipt.png" onClick={(e) => e.stopPropagation()} style={{ fontSize: 13, color: 'var(--primary-light)', textDecoration: 'underline', position: 'relative', zIndex: 10 }}>Download a sample receipt</a>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{imageFile.name}</span>
                <button onClick={() => setImageFile(null)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)' }}>
                  <X size={18} />
                </button>
              </div>
              <img src={URL.createObjectURL(imageFile)} alt="Receipt" style={{ maxHeight: 200, margin: '0 auto', display: 'block', borderRadius: 8, objectFit: 'contain' }} />
              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 12 }}>Cloud Vision OCR will extract items · Demo mode uses sample data</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Analyze Button */}
      <button className="btn-primary glow-primary" onClick={handleSubmit}
        disabled={analyzing || (mode === 'text' ? !text.trim() : !imageFile)}
        style={{ width: '100%', marginTop: 24, padding: 18, fontSize: 17 }}>
        <Sparkles size={20} />
        {analyzing ? 'Analyzing...' : 'Analyze My Cart'}
      </button>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Type, Camera, Sparkles, Upload, X } from 'lucide-react';

const DEMO_CART = 'Maggi, chips, biscuits, white bread, butter, cola, eggs, banana';

export default function CartInput({ onAnalyze, analyzing }) {
  const [mode, setMode] = useState('text'); // text | image
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
      // OCR placeholder — would call Cloud Vision API
      onAnalyze(DEMO_CART);
    }
  };

  const loadDemo = () => {
    setText(DEMO_CART);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-[var(--color-surface-elevated)] w-fit mx-auto">
        <button
          onClick={() => setMode('text')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 ${
            mode === 'text'
              ? 'bg-[var(--color-primary)] text-white shadow-lg'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Type size={16} /> Type / Paste
        </button>
        <button
          onClick={() => setMode('image')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 ${
            mode === 'image'
              ? 'bg-[var(--color-primary)] text-white shadow-lg'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Camera size={16} /> Scan Receipt
        </button>
      </div>

      {/* Text Mode */}
      {mode === 'text' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="glass-card p-1">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type or paste your grocery items here...&#10;&#10;Example: Maggi, chips, biscuits, white bread, butter, cola, eggs, banana&#10;&#10;Separate items with commas, new lines, or semicolons"
              rows={6}
              className="w-full bg-transparent px-5 py-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none resize-none text-base leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={loadDemo}
              className="text-sm text-[var(--color-primary-light)] hover:text-[var(--color-primary)] cursor-pointer transition-colors underline underline-offset-2"
            >
              Load demo cart
            </button>
            <span className="text-xs text-[var(--color-text-muted)]">
              {text.split(/[,\n;]+/).filter(Boolean).length} items detected
            </span>
          </div>
        </motion.div>
      )}

      {/* Image Mode */}
      {mode === 'image' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {!imageFile ? (
            <div
              {...getRootProps()}
              className={`glass-card p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive ? 'border-[var(--color-primary)] glow-primary' : 'hover:border-[var(--color-primary)]/30'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={40} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
              <p className="text-[var(--color-text-secondary)] font-medium">
                {isDragActive ? 'Drop your receipt here' : 'Drag & drop a grocery receipt'}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">or click to browse · PNG, JPG, WEBP</p>
            </div>
          ) : (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">{imageFile.name}</span>
                <button onClick={() => setImageFile(null)} className="p-1 hover:text-[var(--color-danger)] cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Receipt preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <p className="text-xs text-[var(--color-text-muted)] text-center mt-3">
                Cloud Vision OCR will extract items · Demo mode uses sample data
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={analyzing || (mode === 'text' ? !text.trim() : !imageFile)}
        className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-dark)] text-white font-semibold text-lg shadow-lg glow-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
      >
        <Sparkles size={20} />
        {analyzing ? 'Analyzing...' : 'Analyze My Cart'}
      </motion.button>
    </div>
  );
}

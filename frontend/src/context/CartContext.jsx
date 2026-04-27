import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [rawInput, setRawInput] = useState('');
  const [parsedItems, setParsedItems] = useState([]);
  const [cartStats, setCartStats] = useState(null);
  const [behaviorProfile, setBehaviorProfile] = useState(null);
  const [contextSignals, setContextSignals] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [impact, setImpact] = useState(null);
  const [step, setStep] = useState('input'); // input | results

  const reset = () => {
    setRawInput('');
    setParsedItems([]);
    setCartStats(null);
    setBehaviorProfile(null);
    setContextSignals(null);
    setSuggestions([]);
    setImpact(null);
    setStep('input');
  };

  return (
    <CartContext.Provider value={{
      rawInput, setRawInput,
      parsedItems, setParsedItems,
      cartStats, setCartStats,
      behaviorProfile, setBehaviorProfile,
      contextSignals, setContextSignals,
      suggestions, setSuggestions,
      impact, setImpact,
      step, setStep,
      reset,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

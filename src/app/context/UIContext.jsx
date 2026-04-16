import { createContext, useContext, useState, useMemo } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const value = useMemo(() => ({
    activeFilter,
    setActiveFilter,
    soundEnabled,
    setSoundEnabled,
    reducedMotion,
  }), [activeFilter, soundEnabled, reducedMotion]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export default UIContext;

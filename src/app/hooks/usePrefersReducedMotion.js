import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (event) => setPrefersReducedMotion(event.matches);

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

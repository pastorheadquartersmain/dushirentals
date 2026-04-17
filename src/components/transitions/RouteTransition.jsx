import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const RouteTransitionContext = createContext(null);

export function useRouteTransition() {
  const ctx = useContext(RouteTransitionContext);
  if (!ctx) {
    throw new Error('useRouteTransition must be used inside <RouteTransition>');
  }
  return ctx;
}

/**
 * RouteTransition (pass-through)
 * -------------------------------
 * The cinematic curtain was severing the scroll narrative — each route change
 * felt like a cut in a film instead of a camera move. We've removed the curtain
 * entirely and replaced it with a silent scroll-restoration wrapper.
 *
 * The component still exists to:
 *   1. Honor `suppressNextTransition()` for the shared-element morph so image
 *      FLIPs can skip any default behaviour.
 *   2. Reset scroll position on route change (unless we're handling a hash).
 *   3. Refresh ScrollTrigger after the new route paints so pin spacers and
 *      trigger positions are correctly measured.
 *
 * Scene-to-scene storytelling now lives INSIDE the page, not between pages.
 */
export default function RouteTransition({ children }) {
  const location = useLocation();
  const prevKey = useRef(null);
  const suppressRef = useRef(false);

  const suppressNextTransition = useCallback(() => {
    suppressRef.current = true;
  }, []);

  useLayoutEffect(() => {
    const key = location.pathname + location.search;
    const isFirst = prevKey.current === null;
    const sameRoute = prevKey.current === key;
    prevKey.current = key;

    if (isFirst || sameRoute) return;

    if (suppressRef.current) {
      suppressRef.current = false;
      return;
    }

    if (location.hash) {
      // Defer until the new route has painted — otherwise the anchor element
      // doesn't exist yet and pin spacers aren't measured.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
      return;
    }

    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location]);

  return (
    <RouteTransitionContext.Provider value={{ suppressNextTransition }}>
      {typeof children === 'function' ? children(location) : children}
    </RouteTransitionContext.Provider>
  );
}

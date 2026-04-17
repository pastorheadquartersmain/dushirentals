import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useRouteTransition } from './RouteTransition';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';

/**
 * SharedImageMorph
 * -----------------
 * FLIP-based shared-element transition. On click, we snapshot a source image
 * element's bounding rect + src, stash it as state, suppress the global
 * curtain transition, and let the <Link> proceed to navigate. A cloned image
 * rendered via a portal persists across the route swap. When the destination
 * page mounts a matching [data-morph-target="key"] element, the clone flies
 * from source bounds to destination bounds using transform-only animation,
 * then cross-fades into the real destination image.
 *
 *   const { beginMorph, isMorphingIn } = useSharedMorph();
 *
 *   // Source (e.g. FleetCard):
 *   <Link to={path} onClick={(e) => beginMorph({
 *     sourceEl: imgRef.current,
 *     imageSrc: vehicle.image,
 *     targetKey: `vehicle-${slug}`,
 *   })}>
 *
 *   // Destination (e.g. VehicleDetailPage):
 *   <img data-morph-target={`vehicle-${slug}`} ... />
 *
 * Portability: pure React + GSAP + createPortal. No router-specific coupling
 * inside the morph itself — it receives a `suppressNextTransition` from
 * RouteTransition but would work identically with any other transition
 * orchestrator (swap that import in a WordPress headless setup).
 */
const MorphContext = createContext(null);

export function useSharedMorph() {
  const ctx = useContext(MorphContext);
  if (!ctx) {
    throw new Error('useSharedMorph must be used inside <SharedMorphProvider>');
  }
  return ctx;
}

const TARGET_POLL_TIMEOUT_MS = 400;
const MORPH_DURATION = 0.7;
const REVEAL_DURATION = 0.25;
const REVEAL_OVERLAP = 0.3;

export default function SharedMorphProvider({ children }) {
  const [morph, setMorph] = useState(null); // { sourceRect, imageSrc, targetKey } | null
  const cloneRef = useRef(null);
  const activeRef = useRef(false);
  const { suppressNextTransition } = useRouteTransition();
  const reducedMotion = usePrefersReducedMotion();

  const beginMorph = useCallback(({ sourceEl, imageSrc, targetKey }) => {
    if (reducedMotion) return;
    if (!sourceEl || !imageSrc || !targetKey) return;
    if (activeRef.current) return; // ignore re-entrant calls during an active morph

    const sourceRect = sourceEl.getBoundingClientRect();
    activeRef.current = true;
    suppressNextTransition();
    setMorph({ sourceRect, imageSrc, targetKey });
  }, [reducedMotion, suppressNextTransition]);

  // Run the morph after the destination page has had a chance to mount.
  useEffect(() => {
    if (!morph) return;
    const { sourceRect, targetKey } = morph;

    let cancelled = false;
    let tl = null;
    const startTime = performance.now();

    const finalize = (hiddenTargetEl) => {
      if (hiddenTargetEl) hiddenTargetEl.style.opacity = '';
      activeRef.current = false;
      setMorph(null);
    };

    const poll = () => {
      if (cancelled) return;

      const clone = cloneRef.current;
      const targetEl = document.querySelector(`[data-morph-target="${targetKey}"]`);

      if (targetEl && clone) {
        const destRect = targetEl.getBoundingClientRect();

        // Guard against a target that's measured before layout settles.
        if (destRect.width < 1 || destRect.height < 1) {
          requestAnimationFrame(poll);
          return;
        }

        targetEl.style.opacity = '0';

        gsap.set(clone, {
          left: destRect.left,
          top: destRect.top,
          width: destRect.width,
          height: destRect.height,
          transformOrigin: '0 0',
          x: sourceRect.left - destRect.left,
          y: sourceRect.top - destRect.top,
          scaleX: sourceRect.width / destRect.width,
          scaleY: sourceRect.height / destRect.height,
        });

        tl = gsap.timeline({
          onComplete: () => finalize(targetEl),
        });

        tl.to(clone, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: MORPH_DURATION,
          ease: 'power3.inOut',
        })
          .to(targetEl, {
            opacity: 1,
            duration: REVEAL_DURATION,
            ease: 'power2.out',
          }, `-=${REVEAL_OVERLAP}`);
        return;
      }

      if (performance.now() - startTime > TARGET_POLL_TIMEOUT_MS) {
        // Target never appeared — fade the clone away and release.
        if (clone) {
          gsap.to(clone, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => finalize(null),
          });
        } else {
          finalize(null);
        }
        return;
      }

      requestAnimationFrame(poll);
    };

    requestAnimationFrame(poll);

    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, [morph]);

  const value = {
    beginMorph,
    isMorphingIn: !!morph,
  };

  return (
    <MorphContext.Provider value={value}>
      {children}
      {morph && createPortal(
        <img
          ref={cloneRef}
          src={morph.imageSrc}
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'fixed',
            left: morph.sourceRect.left,
            top: morph.sourceRect.top,
            width: morph.sourceRect.width,
            height: morph.sourceRect.height,
            zIndex: 49000,
            pointerEvents: 'none',
            objectFit: 'cover',
            objectPosition: 'center',
            willChange: 'transform, opacity',
          }}
        />,
        document.body
      )}
    </MorphContext.Provider>
  );
}

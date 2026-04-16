import { useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import HeroCTA from './HeroCTA';
import HeroWidgets from './HeroWidgets';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 90;
const PRELOAD_RADIUS = 18;

function frameSrc(i) {
  return `/herotrigger/hero_${String(i).padStart(4, '0')}.webp`;
}

export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const cacheRef = useRef(new Array(FRAME_COUNT).fill(null));
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  // ── Cover-fit draw ────────────────────────────────────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = cacheRef.current[index];
    if (!img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Replicate object-fit: cover
    const canvasAR = cw / ch;
    const imgAR = iw / ih;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgAR > canvasAR) {
      sw = ih * canvasAR;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / canvasAR;
      sy = (ih - sh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // ── Lazy image loader ─────────────────────────────────────────────────────
  const loadFrame = useCallback((index) => {
    if (cacheRef.current[index]) return Promise.resolve(cacheRef.current[index]);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        cacheRef.current[index] = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = frameSrc(index);
    });
  }, []);

  // ── Preload a window of frames around current position ───────────────────
  const preloadWindow = useCallback((center, radius = PRELOAD_RADIUS) => {
    const start = Math.max(0, center - 3);
    const end = Math.min(FRAME_COUNT - 1, center + radius);
    for (let i = start; i <= end; i++) {
      if (!cacheRef.current[i]) loadFrame(i);
    }
  }, [loadFrame]);

  // ── Keep canvas buffer synced to physical CSS size (dpr-aware) ────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawFrame(currentFrameRef.current);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawFrame]);

  // ── Load frame 0 immediately + seed first batch ───────────────────────────
  useEffect(() => {
    loadFrame(0).then(() => drawFrame(0));
    preloadWindow(0, 30);
  }, [loadFrame, drawFrame, preloadWindow]);

  // ── GSAP: entrance + scroll-pinned canvas + content motion ───────────────
  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {

      // ── 1. Staggered entrance (runs once on load) ──────────────────────
      if (!reducedMotion) {
        const entrance = gsap.timeline({ delay: 0.2 });

        entrance
          .from('.hero__label', {
            opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
          })
          .from('.hero__headline', {
            opacity: 0, y: 30, duration: 0.9, ease: 'power2.out',
          }, '-=0.55')
          .from('.hero__subcopy', {
            opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
          }, '-=0.5')
          .from('.hero__actions', {
            opacity: 0, y: 24, duration: 0.8, ease: 'power2.out',
          }, '-=0.45')
          .from('.hero__trust', {
            opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
          }, '-=0.4')
          .from('.hero__booking-teaser', {
            opacity: 0, y: 40, duration: 0.9, ease: 'power2.out',
          }, '-=0.3');
      }

      // Reduced motion: entrance only, no pinning or scroll animation
      if (reducedMotion) return;

      // ── 2. Canvas frame sequence (unchanged) ──────────────────────────
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 0.5,
        onUpdate(self) {
          const targetFrame = Math.min(
            FRAME_COUNT - 1,
            Math.round(self.progress * (FRAME_COUNT - 1))
          );
          if (targetFrame === currentFrameRef.current) return;
          currentFrameRef.current = targetFrame;
          preloadWindow(targetFrame);

          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const cached = cacheRef.current[targetFrame];
            if (cached) {
              drawFrame(targetFrame);
            } else {
              loadFrame(targetFrame).then((img) => {
                if (img && currentFrameRef.current === targetFrame) {
                  drawFrame(targetFrame);
                }
              });
            }
          });
        },
      });

      // ── 3. Content parallax + fade-out (separate trigger, same space) ─
      // Runs in the same scroll space as the pin — no conflict with canvas.
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: true,
        },
      });

      // Phase 0→50%: stay fully visible, drift up gently (parallax feel)
      contentTl.to('.hero__content', {
        y: -28,
        ease: 'none',
        duration: 0.5,
      }, 0);

      // Phase 50→90%: fade out + continue lift
      contentTl.to('.hero__content', {
        opacity: 0,
        y: -80,
        ease: 'power2.in',
        duration: 0.4,
      }, 0.5);

      // Booking teaser: exits slightly later for a layered feel
      contentTl.to('.hero__booking-teaser', {
        opacity: 0,
        y: -50,
        ease: 'power2.in',
        duration: 0.28,
      }, 0.62);

      // Phase 97→100%: hero dims in sync with veil
      contentTl.to('.hero', {
        opacity: 0.3,
        scale: 0.98,
        transformOrigin: 'center center',
        ease: 'none',
        duration: 0.03,
      }, 0.97);

      // Phase 97→100%: veil snaps in fast — covers hero for invisible fleet handoff
      contentTl.to('.hero__exit-veil', {
        opacity: 1,
        ease: 'power2.in',
        duration: 0.03,
      }, 0.97);

    }, heroRef);

    return () => {
      ctx.revert();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, drawFrame, loadFrame, preloadWindow]);

  return (
    <section ref={heroRef} className="hero" id="hero">
      {/* Full-bleed image sequence canvas */}
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      {/* Top fade — darkens only the header zone for nav readability */}
      <div className="hero__top-fade" aria-hidden="true" />

      {/* Gradient scrim — ensures text is legible over any frame */}
      <div className="hero__scrim" aria-hidden="true" />

      {/* Exit veil — fades hero to page color for a seamless fleet transition */}
      <div className="hero__exit-veil" aria-hidden="true" />

      {/* Two-column layout overlay */}
      <div className="hero__content">
        <div className="hero__content-inner">
          <div className="hero__left">
            <HeroCTA />
          </div>
          <div className="hero__right">
            <HeroWidgets />
          </div>
        </div>
      </div>
    </section>
  );
}

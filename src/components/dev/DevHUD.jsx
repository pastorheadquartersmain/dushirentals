import { useState, useEffect, useRef } from 'react';
import './DevHUD.css';

/**
 * DevHUD — real-time pointer + scroll inspector.
 * Toggle visibility:  backtick  `
 * Only rendered in dev mode (import.meta.env.DEV).
 */
export default function DevHUD() {
  const [visible, setVisible] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scroll,  setScroll]  = useState({ y: 0, pct: 0, vh: 0 });
  const rafRef = useRef(null);

  // Toggle with backtick
  useEffect(() => {
    const onKey = (e) => { if (e.key === '`') setVisible(v => !v); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Pointer tracking (raw, no throttle — rAF keeps it smooth)
  useEffect(() => {
    let pending = { x: 0, y: 0 };

    const onMove = (e) => { pending = { x: e.clientX, y: e.clientY }; };

    const tick = () => {
      setPointer({ ...pending });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const update = () => {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct       = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      const vh        = scrollY / window.innerHeight;
      setScroll({ y: Math.round(scrollY), pct: pct.toFixed(1), vh: vh.toFixed(2) });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!visible) {
    return (
      <div className="dev-hud dev-hud--hidden" title="Press ` to show DevHUD">
        <span className="dev-hud__toggle">HUD</span>
      </div>
    );
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return (
    <div className="dev-hud">

      {/* ── Pointer ── */}
      <section className="dev-hud__section">
        <h4 className="dev-hud__heading">POINTER</h4>
        <div className="dev-hud__grid">
          <span className="dev-hud__label">x</span>
          <span className="dev-hud__value">{pointer.x}<em>px</em></span>
          <span className="dev-hud__label">y</span>
          <span className="dev-hud__value">{pointer.y}<em>px</em></span>
          <span className="dev-hud__label">x%</span>
          <span className="dev-hud__value">{vw ? ((pointer.x / vw) * 100).toFixed(1) : 0}<em>%</em></span>
          <span className="dev-hud__label">y%</span>
          <span className="dev-hud__value">{vh ? ((pointer.y / vh) * 100).toFixed(1) : 0}<em>%vh</em></span>
        </div>
      </section>

      <div className="dev-hud__divider" />

      {/* ── Scroll ── */}
      <section className="dev-hud__section">
        <h4 className="dev-hud__heading">SCROLL</h4>
        <div className="dev-hud__grid">
          <span className="dev-hud__label">y</span>
          <span className="dev-hud__value">{scroll.y}<em>px</em></span>
          <span className="dev-hud__label">vh</span>
          <span className="dev-hud__value dev-hud__value--accent">{scroll.vh}<em>vh</em></span>
          <span className="dev-hud__label">%</span>
          <span className="dev-hud__value dev-hud__value--accent">{scroll.pct}<em>%</em></span>
        </div>

        {/* Progress bar */}
        <div className="dev-hud__bar-track">
          <div className="dev-hud__bar-fill" style={{ width: `${scroll.pct}%` }} />
        </div>
      </section>

      {/* ── Viewport ── */}
      <div className="dev-hud__divider" />
      <section className="dev-hud__section">
        <h4 className="dev-hud__heading">VIEWPORT</h4>
        <div className="dev-hud__grid">
          <span className="dev-hud__label">w</span>
          <span className="dev-hud__value">{vw}<em>px</em></span>
          <span className="dev-hud__label">h</span>
          <span className="dev-hud__value">{vh}<em>px</em></span>
        </div>
      </section>

      <p className="dev-hud__hint">` to hide</p>
    </div>
  );
}

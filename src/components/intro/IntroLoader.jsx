import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import './IntroLoader.css';

export default function IntroLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    )
      .to(logoRef.current, { duration: 0.9 })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div ref={overlayRef} className="intro-loader" aria-hidden="true">
      <img
        ref={logoRef}
        src="/hero/dr-logo-nav.png"
        alt=""
        className="intro-loader__logo"
        draggable="false"
      />
    </div>
  );
}

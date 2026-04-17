import { createElement, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import './SplitText.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * SplitText
 * ----------
 * Drop-in component that splits a string into word-spans, wraps each in a
 * masking container, and animates them into view with a staggered reveal on
 * ScrollTrigger enter. Pure transform + opacity — no layout thrash.
 *
 * <SplitText as="h2" className="section-title">Choose your ride</SplitText>
 *
 * Accessibility: the outer element gets `aria-label` with the original text,
 * inner spans are `aria-hidden`. Screen readers speak one sentence.
 *
 * Portability: no router dependency. Works in any React 19 + GSAP project.
 */
export default function SplitText({
  as = 'div',
  children,
  className = '',
  stagger = 0.04,
  delay = 0,
  duration = 0.6,
  ease = 'power3.out',
  start = 'top 85%',
  once = true,
  ...rest
}) {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const text = typeof children === 'string' ? children : String(children ?? '');

  // Alternating word / whitespace tokens — whitespace stays as text nodes,
  // words get the mask + inner structure.
  const tokens = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const inners = rootRef.current.querySelectorAll('.split-text__inner');
    if (!inners.length) return;

    if (reducedMotion) {
      gsap.set(inners, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 100, opacity: 0 });

      gsap.to(inners, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease,
        stagger,
        delay,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          once,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, text, stagger, delay, duration, ease, start, once]);

  return createElement(
    as,
    {
      ref: rootRef,
      className: ['split-text', className].filter(Boolean).join(' '),
      'aria-label': text,
      ...rest,
    },
    tokens.map((tok, i) =>
      /\s+/.test(tok) ? (
        <span key={i} className="split-text__space" aria-hidden="true">{tok}</span>
      ) : (
        <span key={i} className="split-text__word" aria-hidden="true">
          <span className="split-text__inner">{tok}</span>
        </span>
      )
    )
  );
}

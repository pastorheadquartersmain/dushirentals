# Motion System

This site has a deliberate motion layer — a thin connective tissue that makes every page feel like part of one continuous cinematic experience rather than a sequence of separate loads. This document is the reference for using, extending, and porting that layer.

The system sits on top of **GSAP + ScrollTrigger** (already in the bundle). No other animation library. All tweens are transform + opacity only — never layout properties — so every motion is GPU-composited and frame-perfect on mobile.

Every technique respects `prefers-reduced-motion: reduce`. Older users, touch-only users, and anyone with motion sensitivity never hit an animation that interferes with reading or tapping.

---

## Architecture at a glance

```
<App>
  <RouteTransition>                           ← curtain + route latch
    {(displayLocation) => (
      <SharedMorphProvider>                   ← shared-element morph portal
        <Routes location={displayLocation}>
          ...pages...
        </Routes>
      </SharedMorphProvider>
    )}
  </RouteTransition>
</App>
```

Above that, `html { background: var(--color-bg-page); }` provides a persistent background floor that never unmounts between routes — the page color is always present, so there is no white flash in any transition.

---

## Technique 1 — Route transition

**File:** `src/components/transitions/RouteTransition.jsx`

Between any two routes, a sand-to-accent curtain sweeps down from the top, React swaps the route while the curtain is opaque, and the curtain retreats from the bottom. Total: ~770ms. First page load plays nothing. `prefers-reduced-motion` skips the curtain.

You do not interact with this directly. It wraps `<Routes>` in `App.jsx`. Two things to know:

1. **First render never animates.** The first-load `IntroLoader` on `/` still plays as designed.
2. **Suppression hook.** If a feature implements its own transition (like the shared-element morph), it calls `useRouteTransition().suppressNextTransition()` before navigating. The curtain is silenced for the next route change only; subsequent ones animate normally.

---

## Technique 2 — SplitText

**File:** `src/components/motion/SplitText.jsx`

Drop-in component that splits a string into word-spans, masks each in `overflow: hidden`, and animates them into view with a staggered reveal when the element scrolls into frame.

### Usage

```jsx
import SplitText from '../motion/SplitText';

<SplitText as="h2" className="section-title">
  Choose your ride
</SplitText>

<SplitText as="p" className="section-subtitle" delay={0.15}>
  Premium vehicles for every island adventure
</SplitText>
```

### Props

| Prop | Default | Purpose |
|---|---|---|
| `as` | `'div'` | Semantic tag: `'h1'`, `'h2'`, `'p'`, etc. |
| `className` | `''` | Applied to the outer element alongside `.split-text` |
| `stagger` | `0.04` | Seconds between each word's reveal |
| `delay` | `0` | Seconds before the timeline starts |
| `duration` | `0.6` | Each word's tween duration |
| `ease` | `'power3.out'` | GSAP ease string |
| `start` | `'top 85%'` | ScrollTrigger start position |
| `once` | `true` | Fire only on first entry |

### Cascading multiple `SplitText`s on one page

Give subsequent ones a `delay` that clears the previous one's tail:

```jsx
<SplitText as="h1" className="hero-title">Dushi Rentals Curaçao</SplitText>
<SplitText as="p" className="hero-subtitle" delay={0.3}>
  Your island adventure starts here
</SplitText>
```

### Accessibility

The outer element gets `aria-label={originalText}`. Inner spans are `aria-hidden="true"`. Screen readers speak one sentence; sighted users see the reveal.

### Children must be plain text

`<SplitText>` only accepts a string. For mixed content (bold, links, line breaks), compose multiple `SplitText`s.

---

## Technique 3 — Shared-element morph

**Files:** `src/components/transitions/SharedImageMorph.jsx`

When a user clicks a card whose image should visually *become* the hero image of the next page, a cloned image flies from source bounds to destination bounds using a FLIP (First-Last-Invert-Play) transform animation. The curtain is suppressed for this transition — the morph *is* the transition.

### Wiring — source

```jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSharedMorph } from '../transitions/SharedImageMorph';

function ProductCard({ item }) {
  const imgRef = useRef(null);
  const { beginMorph } = useSharedMorph();

  const onClick = () => {
    if (!imgRef.current) return;
    beginMorph({
      sourceEl: imgRef.current,
      imageSrc: item.image,
      targetKey: `item-${item.id}`,
    });
  };

  return (
    <Link to={`/items/${item.id}`} onClick={onClick}>
      <img ref={imgRef} src={item.image} alt={item.name} />
    </Link>
  );
}
```

### Wiring — destination

```jsx
<img
  src={item.image}
  alt={item.name}
  data-morph-target={`item-${item.id}`}
/>
```

### Guard concurrent page entry animations

If the destination page runs its own `gsap.from(...)` on the element being morphed, the two will fight. Read `isMorphingIn` and skip that single tween:

```jsx
const { isMorphingIn } = useSharedMorph();

useLayoutEffect(() => {
  if (!isMorphingIn) {
    gsap.from('.hero-image-card', { opacity: 0, x: -30, ... });
  }
}, [...]);
```

### Fallback behavior

If `[data-morph-target="..."]` is not found within 400ms of the route swap (e.g. wrong key, target not rendered), the clone fades out and the user sees the destination page as normal. No broken state.

### Example live today: Home → Fleet card → Vehicle detail

- `FleetCard.jsx` — image-wrapper is now a `<Link>` with `onClick={handleMorphClick}`
- `VehicleDetailPage.jsx` — hero `<img>` carries `data-morph-target={`vehicle-${slug}`}` and guards its own image-card tween with `isMorphingIn`

---

## Technique 4 — `useMouseParallax`

**File:** `src/hooks/useMouseParallax.js`

Subtle cursor-reactive parallax. Max 15px translate, damped by a linear interpolation factor. Use on stable decorative visuals only.

### Usage

```jsx
import { useRef } from 'react';
import useMouseParallax from '../../hooks/useMouseParallax';

function AboutHero() {
  const imgRef = useRef(null);
  useMouseParallax(imgRef, { max: 15, ease: 0.1 });

  return (
    <div className="about-hero">
      <img ref={imgRef} src="/about/team.jpg" alt="" className="about-hero__image" />
    </div>
  );
}
```

### Guardrails (important)

- **Never** apply on an element that is also GSAP-tweened. The hook writes `element.style.transform` directly each frame — any concurrent GSAP tween will stutter-fight. Use on a stable layer (decorative image, illustration) rather than on something that's also animating in.
- **Touch devices**: no `mousemove` fires, effect dormant, zero cost. Do not worry about mobile.
- **Reduced motion**: hook exits early, no listener attached.
- **Recommended values for a rental-car site**: `max: 10` to `15`, `ease: 0.08` to `0.12`. Higher `max` feels frivolous; lower `ease` feels sluggish.

---

## Technique 5 — Persistent background

**File:** `src/index.css` (1 line added to `html`)

```css
html {
  background: var(--color-bg-page);
}
```

Because `html` never unmounts (it's the document root), this color is always present behind every route. Sections with dark backgrounds (FAQ, BookingCTA at `#1c1814`) simply override locally. Route swaps happen behind the curtain at peak opacity, so even dark-to-light hand-offs never flash.

Nothing to do here — it's passive infrastructure.

---

## Technique 6 — `PinnedSection`

**File:** `src/components/transitions/PinnedSection.jsx`

Reusable scroll-pinned, scrub-driven section. Same mechanic as the homepage hero. Use it to give new pages (About, Contact, Vehicle Detail expansions) the same cinematic depth without duplicating the hero's code.

### Usage

```jsx
import PinnedSection from '../transitions/PinnedSection';

<PinnedSection
  height="150vh"
  build={(tl, rootEl) => {
    tl.to(rootEl.querySelector('.about-hero__image'), {
      yPercent: -30,
      scale: 1.1,
    })
    .to(rootEl.querySelector('.about-hero__caption'), {
      opacity: 1,
      y: 0,
    }, 0);
  }}
>
  <div className="about-hero">
    <img className="about-hero__image" src="..." alt="" />
    <p className="about-hero__caption" style={{ opacity: 0 }}>
      Born on the island, built for it.
    </p>
  </div>
</PinnedSection>
```

### Props

| Prop | Default | Purpose |
|---|---|---|
| `height` | `'150vh'` | How much scroll distance the pin consumes |
| `scrub` | `1` | ScrollTrigger scrub smoothness (sec of catch-up) |
| `anticipatePin` | `1` | ScrollTrigger pin pre-computation |
| `build` | required | `(timeline, rootEl) => { ... }` — add your tweens |

### Mobile

`pinType: 'transform'` is set — iOS Safari scrolls smoothly; touch gestures are not hijacked. Tested on the homepage hero pattern.

### Reduced motion

If `prefers-reduced-motion: reduce`, the effect does nothing. Content renders as a normal block. Tweens in `build` are never invoked.

---

## Budget

| Technique | Raw bytes added | Gzipped |
|---|---|---|
| 1 — RouteTransition | ~1.4 KB | ~0.3 KB |
| 2 — SplitText (dormant until used) | 0 | 0 |
| 3 — SharedImageMorph | ~2.3 KB | ~0.9 KB |
| 4 — useMouseParallax (dormant until used) | 0 | 0 |
| 5 — Persistent background | ~50 bytes CSS | ~10 bytes |
| 6 — PinnedSection (dormant until used) | 0 | 0 |
| **Total shipped today** | **~3.7 KB** | **~1.2 KB** |

Utilities are tree-shaken until consumed. When all new pages adopt them the footprint is projected under 6 KB gzipped — well under the 15 KB ceiling.

---

## Portability notes (WordPress later)

This layer is designed to be swappable into a WordPress headless or hybrid setup.

- Every utility is a pure React 19 + GSAP module. No Vite-specific imports, no file system coupling, no build-time magic.
- `RouteTransition` is the only file that imports from `react-router-dom`. If WordPress swaps in a different routing approach, only that one import needs adjustment. The render-prop API keeps the consumer in control of the routes element.
- `SharedImageMorph` depends on `RouteTransition` via `useRouteTransition()`. Swap the import; signature is compatible with any suppression hook.
- All CSS uses design tokens defined in `src/index.css`. No hard-coded colors.
- No Service Worker, no WebGL, no Three.js. Total surface area is ~5 small files.

---

## When to use what

| Want to... | Use |
|---|---|
| Animate a heading into view on scroll | `<SplitText>` |
| Fly a card image into a hero image across routes | `beginMorph` + `data-morph-target` |
| Add cinematic depth to a static image hero | `useMouseParallax` |
| Pin a section and scrub an animation through it | `<PinnedSection>` |
| Make every route swap feel curated | Nothing — `<RouteTransition>` is already global |
| Prevent background flashes between routes | Nothing — persistent `html` background already handles this |

---

## Rules of the system

1. **Transform + opacity only.** Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. If you need to change size, use `scale`.
2. **Every motion respects `prefers-reduced-motion`.** Every new hook/component must check this and exit early. Use the existing `usePrefersReducedMotion` hook.
3. **No new motion libraries.** GSAP + ScrollTrigger is the entire vocabulary.
4. **Mobile first, older users second, drama last.** This is a rental-car business for travelers of all ages. If a motion makes the page harder to read, slower to tap, or harder to navigate — delete it.

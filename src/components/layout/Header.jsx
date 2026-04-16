import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Button from '../ui/Button';
import './Header.css';

const NAV_LINKS = [
  { label: 'Fleet', href: '/fleet' },
  { label: 'About', href: '/about' },
  { label: 'Why Us', href: '#benefits' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const lastScroll = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 40);
      setHidden(currentScroll > lastScroll.current && currentScroll > 200);
      lastScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      gsap.to(headerRef.current, {
        yPercent: hidden ? -100 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [hidden]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    if (!href.startsWith('#')) {
      navigate(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showLight = scrolled || !isHome;

  const headerClasses = [
    'header',
    scrolled ? 'header--scrolled' : '',
    showLight ? 'header--light' : '',
  ].filter(Boolean).join(' ');

  return (
    <header ref={headerRef} className={headerClasses}>
      <div className="header__inner container">
        <a href="/" className="header__logo" aria-label="Dushi Rentals Home">
          <img
            src="/hero/dr-logo-nav.png"
            alt="Dushi Rentals Curaçao"
            className="header__logo-img"
            height="60"
            loading="eager"
            draggable="false"
          />
        </a>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="header__nav-link"
              onClick={(e) => scrollToSection(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <Button
            variant="primary"
            size="sm"
            href="/reservations"
          >
            Reserve Now
          </Button>
        </div>

        <button
          className={`header__hamburger ${mobileOpen ? 'header__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div className="header__mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="header__mobile-menu" onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="header__mobile-link"
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="primary"
              size="lg"
              href="/reservations"
              className="header__mobile-cta"
            >
              Reserve Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

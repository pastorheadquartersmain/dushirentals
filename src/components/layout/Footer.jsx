import { Phone, Building2, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-dushi">DUSHI</span>
              <span className="footer__logo-rentals">RENTALS</span>
            </div>
            <p className="footer__tagline">
              Premium car rental in Curaçao. Island elegance meets seamless mobility.
            </p>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__list">
              <li>
                <a href="tel:+59996682260" className="footer__link footer__link--icon">
                  <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
                  +5999 668-2260
                </a>
              </li>
              <li>
                <a href="tel:+59996905050" className="footer__link footer__link--icon">
                  <Building2 size={14} strokeWidth={1.5} aria-hidden="true" />
                  +5999 690-5050
                </a>
              </li>
              <li>
                <a href="mailto:info@dushirentalscuracao.com" className="footer__link footer__link--icon">
                  <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
                  info@dushirentalscuracao.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="footer__col">
            <h4 className="footer__heading">Service Hours</h4>
            <ul className="footer__list">
              <li className="footer__text">Mon – Fri: 9:00 AM – 9:00 PM</li>
              <li className="footer__text">Sat: 9:00 AM – 7:00 PM</li>
              <li className="footer__text">Sun: Pick-up & Drop-off</li>
            </ul>
          </div>

          {/* Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li><a href="/fleet" className="footer__link">Our Fleet</a></li>
              <li><a href="/about" className="footer__link">About Us</a></li>
              <li><a href="/faq" className="footer__link">FAQ</a></li>
              <li><a href="/terms" className="footer__link">Terms & Conditions</a></li>
              <li><a href="/privacy" className="footer__link">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Dushi Rentals Curaçao. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

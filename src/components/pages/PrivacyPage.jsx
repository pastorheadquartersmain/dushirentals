import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import './PrivacyPage.css';

export default function PrivacyPage() {
  const pageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.privacy-page__hero > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      gsap.from('.privacy-page__card', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.privacy-page__card', start: 'top 90%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="privacy-page">
        <div className="container">

          <div className="privacy-page__hero section">
            <span className="section-label">Legal</span>
            <h1 className="section-title">Privacy Policy</h1>
            <p className="section-subtitle">
              How we collect, use, and protect your personal information.
            </p>
          </div>

          <div className="privacy-page__content">
            <Card variant="glass" hover={false} className="privacy-page__card">
              <p className="privacy-page__updated">Last updated: January 2025</p>

              <div className="privacy-page__body">
                <h2>Introduction</h2>
                <p>
                  Dushi Rentals Curaçao ("we", "our", or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, make a reservation, or use our car rental services.
                </p>

                <h2>Information We Collect</h2>
                <p>We may collect the following types of personal information:</p>
                <ul>
                  <li>Full name, date of birth, and nationality</li>
                  <li>Contact information including email address, phone number, and mailing address</li>
                  <li>Driver's license number, issuing country, and expiration date</li>
                  <li>Payment information (credit/debit card details) — processed securely by our payment provider</li>
                  <li>Travel details such as arrival/departure dates and flight information</li>
                  <li>Browsing data including IP address, browser type, and pages visited on our website</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul>
                  <li>To process and manage your car rental reservation</li>
                  <li>To verify your identity and driver eligibility</li>
                  <li>To process payments and provide invoices</li>
                  <li>To communicate with you regarding your booking, including confirmations, updates, and customer support</li>
                  <li>To improve our website, services, and customer experience</li>
                  <li>To comply with legal obligations and law enforcement requests</li>
                  <li>To send promotional offers and newsletters (only with your consent)</li>
                </ul>

                <h2>Data Sharing & Third Parties</h2>
                <p>
                  We do not sell, rent, or trade your personal information to third parties. We may share your data with trusted service providers who assist us in operating our business, such as:
                </p>
                <ul>
                  <li>Payment processors for secure transaction handling</li>
                  <li>Insurance providers as required for rental coverage</li>
                  <li>IT and hosting services for website operation and data storage</li>
                  <li>Government or law enforcement agencies when legally required</li>
                </ul>

                <h2>Cookies</h2>
                <p>
                  Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand how visitors interact with our site. You can manage cookie preferences through your browser settings. Disabling cookies may limit certain features of the website.
                </p>

                <h2>Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Payment information is encrypted using industry-standard SSL/TLS protocols and is never stored on our servers.
                </p>

                <h2>Your Rights</h2>
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul>
                  <li>Access, correct, or delete your personal data</li>
                  <li>Withdraw consent for marketing communications at any time</li>
                  <li>Request a copy of the data we hold about you</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:info@dushirentalscuracao.com">info@dushirentalscuracao.com</a>.
                </p>

                <h2>Data Retention</h2>
                <p>
                  We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Rental records are typically retained for a period of five (5) years after the rental date.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <p>
                  Dushi Rentals Curaçao<br />
                  Curaçao International Airport<br />
                  Willemstad, Curaçao<br />
                  Email: <a href="mailto:info@dushirentalscuracao.com">info@dushirentalscuracao.com</a><br />
                  Phone: <a href="tel:+59996682260">+5999 668-2260</a>
                </p>
              </div>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}

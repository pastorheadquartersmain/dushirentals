import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import './ContactPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const pageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.contact-page__hero > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      gsap.from('.contact-page__info-card', {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-page__info', start: 'top 85%', once: true },
      });

      gsap.from('.contact-page__form-card', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-page__form-card', start: 'top 85%', once: true },
      });

      gsap.from('.contact-page__map', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-page__map-section', start: 'top 85%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name || e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    window.location.href = `mailto:info@dushirentalscuracao.com?subject=${encodeURIComponent(subject || 'Website Inquiry')}&body=${body}`;
  };

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="contact-page">
        <div className="container">

          <div className="contact-page__hero section">
            <span className="section-label">Contact Us</span>
            <h1 className="section-title">Get in Touch</h1>
            <p className="section-subtitle">
              Have a question or need assistance? We're here to help make your Curaçao trip seamless.
            </p>
          </div>

          <div className="contact-page__grid">
            <div className="contact-page__info">
              <Card className="contact-page__info-card" variant="glass">
                <div className="contact-page__info-row">
                  <div className="contact-page__info-icon">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div className="contact-page__info-text">
                    <h3>Phone</h3>
                    <p>
                      <a href="tel:+59996682260">+5999 668-2260</a><br />
                      <a href="tel:+59996905050">+5999 690-5050</a>
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="contact-page__info-card" variant="glass">
                <div className="contact-page__info-row">
                  <div className="contact-page__info-icon">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div className="contact-page__info-text">
                    <h3>Email</h3>
                    <p><a href="mailto:info@dushirentalscuracao.com">info@dushirentalscuracao.com</a></p>
                  </div>
                </div>
              </Card>

              <Card className="contact-page__info-card" variant="glass">
                <div className="contact-page__info-row">
                  <div className="contact-page__info-icon">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div className="contact-page__info-text">
                    <h3>Location</h3>
                    <p>Curaçao International Airport (CUR)<br />Willemstad, Curaçao</p>
                  </div>
                </div>
              </Card>

              <Card className="contact-page__hours" variant="glass">
                <h3>Service Hours</h3>
                <div className="contact-page__hours-list">
                  <div className="contact-page__hours-row">
                    <span className="contact-page__hours-day">Monday – Friday</span>
                    <span className="contact-page__hours-time">9:00 AM – 9:00 PM</span>
                  </div>
                  <div className="contact-page__hours-row">
                    <span className="contact-page__hours-day">Saturday</span>
                    <span className="contact-page__hours-time">9:00 AM – 7:00 PM</span>
                  </div>
                  <div className="contact-page__hours-row">
                    <span className="contact-page__hours-day">Sunday</span>
                    <span className="contact-page__hours-time">Pick-up & Drop-off</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="contact-page__form-card" variant="glass">
              <h2>Send a Message</h2>
              <p>Fill in the form and we'll get back to you as soon as possible.</p>

              <form className="contact-page__form" onSubmit={handleSubmit}>
                <div className="contact-page__form-row">
                  <Input id="name" label="Full Name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
                  <Input id="email" label="Email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="contact-page__form-row">
                  <Input id="phone" label="Phone" type="tel" placeholder="+5999 ..." value={formData.phone} onChange={handleChange} />
                  <Input id="subject" label="Subject" placeholder="Booking inquiry" value={formData.subject} onChange={handleChange} />
                </div>
                <div className="contact-page__textarea">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="How can we help?" value={formData.message} onChange={handleChange} required />
                </div>
                <Button variant="primary" size="md" type="submit">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          <div className="contact-page__map-section">
            <h2>Find Us</h2>
            <div className="contact-page__map">
              <iframe
                title="Dushi Rentals Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.5!2d-68.9598!3d12.1696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8438fd47f3e1e7%3A0xf8c9b0adcc0dfe5b!2sCura%C3%A7ao%20International%20Airport!5e0!3m2!1sen!2scw!4v1700000000000"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}

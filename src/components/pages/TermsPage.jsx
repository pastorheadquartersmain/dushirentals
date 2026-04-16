import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import Accordion from '../ui/Accordion';
import './TermsPage.css';

gsap.registerPlugin(ScrollTrigger);

const TERMS_SECTIONS = [
  {
    title: 'General Terms',
    content: `By making a reservation with Dushi Rentals Curaçao, you agree to all the terms and conditions set forth in this agreement. Dushi Rentals Curaçao reserves the right to refuse service to anyone for any reason. The renter must be at least 23 years of age and hold a valid driver's license for a minimum of two years. A valid credit card or debit card in the renter's name is required at the time of pickup. All rates are quoted in US Dollars (USD).`,
  },
  {
    title: 'Rental Agreement',
    content: `A signed rental agreement is required before the vehicle is released to the renter. The rental agreement will specify the rental period, vehicle type, rate, insurance options, and any additional services. The renter acknowledges receipt of the vehicle in good condition and agrees to return it in the same condition. Any damage, missing parts, or excessive dirt upon return may result in additional charges. Extensions must be requested at least 24 hours before the scheduled return time and are subject to availability.`,
  },
  {
    title: 'The Rental',
    content: `The minimum rental period is four (4) days. There is no maximum rental period. The vehicle must be returned to the agreed-upon location at the date and time specified in the rental agreement. Late returns without prior approval will be charged an additional day's rate for every 2 hours of delay. The renter is responsible for all traffic and parking violations incurred during the rental period. The vehicle may not be taken off the island of Curaçao. Sub-leasing, racing, or using the vehicle for any illegal purpose is strictly prohibited.`,
  },
  {
    title: 'Insurance & Liability',
    content: `All vehicles include basic third-party liability insurance. Optional coverage is available: Premium Protection ($19/day — $0 responsibility), Intermediate Protection ($10/day — $400 responsibility), or Standard Protection ($6/day — $850 responsibility). The renter is liable for any damage to the vehicle up to the responsibility amount specified by their chosen coverage. Insurance coverage does not apply in cases of negligence, DUI, driving on unpaved roads (unless in an SUV), unauthorized drivers, or violation of the rental agreement.`,
  },
  {
    title: 'Payment',
    content: `Dushi Rentals Curaçao accepts Visa, Mastercard, Maestro, and American Express credit and debit cards. A pre-authorization hold will be placed on the renter's card at pickup. For "Pay Later" reservations, cash payment (USD or ANG) is accepted at the time of pickup. Taxes (OB/ABB, currently 9%) are charged at checkout and are not included in the displayed daily rate. Fuel policy: vehicles are provided with a full tank and must be returned full. A refueling fee of $5/gallon applies if the tank is not full upon return.`,
  },
  {
    title: 'Cancellation Policy',
    content: `Reservations may be cancelled free of charge up to 48 hours before the scheduled pickup time. Cancellations made less than 48 hours before pickup are subject to a cancellation fee equivalent to one day's rental. No-shows (failure to pick up the vehicle without notice) will be charged the full reservation amount. Refunds for eligible cancellations will be processed within 5–10 business days to the original payment method.`,
  },
  {
    title: 'Vehicle Breakdown & Roadside Assistance',
    content: `In the event of a mechanical breakdown, contact Dushi Rentals Curaçao immediately. We provide 24/7 roadside assistance and will arrange a replacement vehicle as quickly as possible, subject to availability. The renter is not responsible for mechanical failures that occur during normal use. Towing costs due to mechanical failure will be covered by Dushi Rentals. Towing costs due to renter negligence (e.g., flat tire from driving off-road, running out of fuel, locking keys in the vehicle) are the renter's responsibility.`,
  },
  {
    title: 'Fuel Policy',
    content: `All vehicles are delivered with a full tank of fuel. The renter is expected to return the vehicle with a full tank. If the vehicle is returned with less fuel than provided, a refueling surcharge of $5.00 per gallon (or part thereof) will apply. Fuel type requirements are specified in the rental agreement and vehicle manual — using incorrect fuel is the renter's responsibility and any resulting damage is not covered by insurance.`,
  },
  {
    title: 'Additional Drivers',
    content: `Additional drivers may be added to the rental agreement at no extra charge, provided they meet the minimum age requirement (23 years), hold a valid driver's license, and are present at pickup to sign the rental agreement. All additional drivers are subject to the same terms, conditions, and liabilities as the primary renter. Only persons listed on the rental agreement are authorized to operate the vehicle.`,
  },
  {
    title: 'Governing Law',
    content: `These terms and conditions are governed by the laws of Curaçao. Any disputes arising from or related to this rental agreement shall be subject to the exclusive jurisdiction of the courts of Curaçao. If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
];

export default function TermsPage() {
  const pageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.terms-page__hero > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      gsap.from('.terms-page__card', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.terms-page__card', start: 'top 90%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="terms-page">
        <div className="container">

          <div className="terms-page__hero section">
            <span className="section-label">Legal</span>
            <h1 className="section-title">Terms & Conditions</h1>
            <p className="section-subtitle">
              Please read our terms carefully before making a reservation.
            </p>
          </div>

          <div className="terms-page__content">
            <Card variant="glass" hover={false} className="terms-page__card">
              <p className="terms-page__updated">Last updated: January 2025</p>
              <div className="terms-page__sections">
                {TERMS_SECTIONS.map((section, i) => (
                  <Accordion
                    key={i}
                    question={`${i + 1}. ${section.title}`}
                    answer={section.content}
                  />
                ))}
              </div>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}

import { useState, useCallback } from 'react';
import DevHUD from '../components/dev/DevHUD';
import { Routes, Route } from 'react-router-dom';
import RouteTransition from '../components/transitions/RouteTransition';
import SharedMorphProvider from '../components/transitions/SharedImageMorph';
import { UIProvider } from './context/UIContext';
import PageShell from '../components/layout/PageShell';
import Header from '../components/layout/Header';
import IntroLoader from '../components/intro/IntroLoader';
import Hero from '../components/hero/Hero';
import FleetSection from '../components/fleet/FleetSection';
import BenefitsSection from '../components/benefits/BenefitsSection';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';
import FAQSection from '../components/faq/FAQSection';
import BookingCTA from '../components/booking/BookingCTA';
import Footer from '../components/layout/Footer';
import AllFleetPage from '../components/fleet/AllFleetPage';
import AboutPage from '../components/pages/AboutPage';
import ContactPage from '../components/pages/ContactPage';
import FAQPage from '../components/pages/FAQPage';
import TermsPage from '../components/pages/TermsPage';
import PrivacyPage from '../components/pages/PrivacyPage';
import ReservationPage from '../components/pages/ReservationPage';
import VehicleDetailPage from '../components/pages/VehicleDetailPage';

function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false);
  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);

  return (
    <UIProvider>
      {!loaderDone && <IntroLoader onComplete={handleLoaderComplete} />}
      <PageShell>
        <Header />
        <main>
          <Hero />
          <FleetSection />
          <BenefitsSection />
          <TestimonialsSection />
          <FAQSection />
          <BookingCTA />
        </main>
        <Footer />
      </PageShell>
    </UIProvider>
  );
}

export default function App() {
  return (
    <>
      {import.meta.env.DEV && <DevHUD />}
      <RouteTransition>
        {(displayLocation) => (
          <SharedMorphProvider>
            <Routes location={displayLocation}>
              <Route path="/" element={<HomePage />} />
              <Route path="/fleet" element={<AllFleetPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/fleet/:category" element={<VehicleDetailPage />} />
            </Routes>
          </SharedMorphProvider>
        )}
      </RouteTransition>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import LandingNavbar from './landing/LandingNavbar';
import LandingHeroScene from './landing/LandingHeroScene';
import LandingFeaturesGrid from './landing/LandingFeaturesGrid';
import LandingAboutSection from './landing/LandingAboutSection';
import LandingRolesSection from './landing/LandingRolesSection';
import LandingFaqSection from './landing/LandingFaqSection';
import LandingFooter from './landing/LandingFooter';

export default function LandingHero({ onOpenAuth, onSelectPortal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sectionIds = ['beranda', 'tentang', 'fitur', 'untuk-siapa', 'faq'];
      const scrollPos = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (e, sectionId) => {
    if (e) e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 85;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="landing-shell"
      style={{
        background: '#FAF8FD',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <LandingNavbar
        isScrolled={isScrolled}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenAuth={onOpenAuth}
        onSelectPortal={onSelectPortal}
      />

      <LandingHeroScene onOpenAuth={onOpenAuth} />

      <LandingFeaturesGrid />

      <LandingAboutSection />

      <LandingRolesSection onSelectPortal={onSelectPortal} />

      <LandingFaqSection />

      <LandingFooter />
    </div>
  );
}

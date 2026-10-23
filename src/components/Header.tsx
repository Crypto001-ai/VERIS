import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenSafetyTips: () => void;
  onAnalyzeNow: () => void;
  onNavigateSection?: (id: string) => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSafetyTips,
  onAnalyzeNow,
  onNavigateSection,
  onGoHome,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileNavClick = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  // Keyboard navigation: Escape key closes mobile drawer and restores focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock background scrolling while mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Auto focus close button for accessibility
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Drawer portal content rendered into document.body to isolate from header's stacking context & backdrop-filter
  const mobileDrawerPortal = mounted ? (
    createPortal(
      <>
        {/* Backdrop Overlay */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
          className={`md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
            isMobileMenuOpen
              ? 'opacity-100 pointer-events-auto visible'
              : 'opacity-0 pointer-events-none invisible'
          }`}
        />

        {/* Slide-out Drawer */}
        <nav
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{ width: 'min(85vw, 360px)', maxWidth: '360px' }}
          className={`md:hidden fixed top-0 right-0 z-50 h-screen h-[100dvh] bg-[#FAF9F5] border-l border-[#E4E8E3] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen
              ? 'translate-x-0 visible pointer-events-auto'
              : 'translate-x-full invisible pointer-events-none'
          }`}
        >
          {/* Drawer Header Row */}
          <div className="p-4 sm:p-5 border-b border-[#E4E8E3] flex items-center justify-between bg-white shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGoHome?.();
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#1B4332] rounded-lg p-1"
            >
              <img
                src="/veris-icon.png"
                alt="VERIS Symbol"
                className="w-7 h-7 object-contain shrink-0"
              />
              <span className="text-base font-bold tracking-tight text-[#18221D] group-hover:text-[#1B4332] transition-colors">VERIS</span>
            </button>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-[#4E6559] hover:text-[#18221D] hover:bg-[#F4F6F3] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer Vertical Links */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <button
              type="button"
              onClick={() => handleMobileNavClick(() => scrollToSection('how-it-works'))}
              className="w-full text-left py-3 px-3.5 rounded-lg text-[#18221D] hover:bg-white text-sm font-medium transition-colors cursor-pointer border border-transparent hover:border-[#E4E8E3] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              How It Works
            </button>

            <button
              type="button"
              onClick={() => handleMobileNavClick(onOpenSafetyTips)}
              className="w-full text-left py-3 px-3.5 rounded-lg text-[#18221D] hover:bg-white text-sm font-medium transition-colors cursor-pointer border border-transparent hover:border-[#E4E8E3] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              Safety Tips
            </button>

            <button
              type="button"
              onClick={() => handleMobileNavClick(() => scrollToSection('faq'))}
              className="w-full text-left py-3 px-3.5 rounded-lg text-[#18221D] hover:bg-white text-sm font-medium transition-colors cursor-pointer border border-transparent hover:border-[#E4E8E3] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              FAQ
            </button>

            <div className="pt-3">
              {/* Primary Action Highlighted in Forest Green */}
              <button
                type="button"
                onClick={() => handleMobileNavClick(onAnalyzeNow)}
                className="w-full bg-[#1B4332] hover:bg-[#133825] text-white font-semibold rounded-none py-3.5 px-4 text-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4332]"
              >
                <span>Analyze Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Drawer Footer Notice */}
          <div className="p-4 border-t border-[#E4E8E3] bg-white text-xs text-[#6B7280] shrink-0">
            Verify Before You Trust
          </div>
        </nav>
      </>,
      document.body
    )
  ) : null;

  return (
    <>
      <header className="border-b border-[#E4E8E3] bg-[#FAF9F5]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand: Logo & Tagline on the left */}
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-3 text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#1B4332] rounded-lg p-1 -ml-1"
            aria-label="VERIS home"
          >
            <img
              src="/veris-icon.png"
              alt="VERIS Symbol"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-[#18221D] group-hover:text-[#1B4332] transition-colors">VERIS</span>
              <span className="hidden sm:inline text-xs text-[#4E6559] font-normal">
                Verify Before You Trust
              </span>
            </div>
          </button>

          {/* Desktop Navigation Items (Visible on md screens and up) */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-5 text-sm">
            {/* 1. How It Works */}
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="text-[#4E6559] hover:text-[#18221D] transition-colors font-medium cursor-pointer focus:outline-none focus:underline"
            >
              How It Works
            </button>

            {/* 2. Safety Tips (Opens Right Slide-in Drawer) */}
            <button
              type="button"
              onClick={onOpenSafetyTips}
              className="text-[#4E6559] hover:text-[#18221D] transition-colors font-medium cursor-pointer focus:outline-none focus:underline"
            >
              Safety Tips
            </button>

            {/* 3. FAQ */}
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="text-[#4E6559] hover:text-[#18221D] transition-colors font-medium cursor-pointer focus:outline-none focus:underline"
            >
              FAQ
            </button>

            {/* 4. Button: Analyze Now → */}
            <button
              type="button"
              onClick={onAnalyzeNow}
              className="bg-[#1B4332] hover:bg-[#133825] text-white font-semibold rounded-none px-4 py-2 text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              <span>Analyze Now</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </nav>

          {/* Mobile Hamburger Button (Visible on mobile only) */}
          <div className="flex md:hidden items-center">
            <button
              ref={hamburgerButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              className="p-2 rounded-lg text-[#18221D] hover:bg-[#E4E8E3]/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Render mobile drawer into document.body portal */}
      {mobileDrawerPortal}
    </>
  );
};

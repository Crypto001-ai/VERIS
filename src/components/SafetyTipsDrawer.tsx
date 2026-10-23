import React, { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface SafetyTipsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyTipsDrawer: React.FC<SafetyTipsDrawerProps> = ({ isOpen, onClose }) => {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const redFlags = [
    '"I\'m in the hospital, send money urgently" — always call to verify',
    'No legitimate bank will ask for your PIN, OTP or BVN via message',
    '"Guaranteed returns" investments are almost always fraudulent',
    'Urgent payment requests with countdown pressure are manipulation',
    'If someone sends account details unprompted, verify by phone first',
  ];

  const goldenRules = [
    'Always call the person directly before sending any money',
    'When in doubt, paste it in Veris',
  ];

  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-In Drawer from Right */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Protect Yourself Safety Tips"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-[#E4E8E3] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#E4E8E3] flex items-start justify-between gap-4 bg-[#FAF9F5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#1B4332] text-white flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#18221D]">
                Protect Yourself
              </h2>
            </div>
            <p className="text-xs text-[#4E6559]">
              Common tactics scammers use in Nigeria
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close safety tips drawer"
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#18221D] hover:bg-[#E4E8E3]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm">
          {/* Warning Signs Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              Red Flags to Watch For
            </h3>
            <ul className="space-y-3">
              {redFlags.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]/60 text-xs text-[#78350F] leading-relaxed"
                >
                  <span className="text-base leading-none select-none shrink-0 mt-0.5">🔴</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Practices Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              Golden Rules
            </h3>
            <ul className="space-y-3">
              {goldenRules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#EBF3EE] border border-[#1B4332]/20 text-xs text-[#143527] leading-relaxed font-medium"
                >
                  <span className="text-base leading-none select-none shrink-0 mt-0.5">🟢</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E4E8E3] bg-[#FAF9F5] flex items-center justify-between text-xs text-[#6B7280]">
          <span>VERIS Safety Companion</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1B4332] text-white rounded-lg text-xs font-semibold hover:bg-[#133825] transition-colors"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
};

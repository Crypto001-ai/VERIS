import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onOpenPrinciples: () => void;
  onOpenPrivacyGuide: () => void;
  onOpenSettings: () => void;
  onGoHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrinciples,
  onOpenPrivacyGuide,
  onOpenSettings,
  onGoHome,
}) => {
  return (
    <footer className="border-t border-[#E4E8E3] bg-[#FAF9F5] mt-16 text-xs text-[#6B7280] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-2 text-[#18221D] font-bold tracking-tight text-sm hover:text-[#1B4332] transition-colors cursor-pointer text-left"
            >
              <img
                src="/veris-icon.png"
                alt="VERIS"
                className="w-5 h-5 object-contain shrink-0"
              />
              <span>VERIS</span>
              <span className="text-[#6B7280] font-normal text-xs">· Before you pay, check the proof.</span>
            </button>
            <p className="text-[#4E6559] text-xs max-w-md">
              A calm, evidence-based safety companion to evaluate suspicious messages and payment requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenPrinciples}
              className="text-[#4E6559] hover:text-[#18221D] transition-colors"
            >
              Safety Principles
            </button>
            <button
              onClick={onOpenPrivacyGuide}
              className="text-[#4E6559] hover:text-[#18221D] transition-colors"
            >
              Redaction Guide
            </button>
            <button
              onClick={onOpenSettings}
              className="text-[#4E6559] hover:text-[#18221D] transition-colors"
            >
              Provider Settings
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E4E8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#9CA3AF]">
          <div className="flex items-center gap-1.5 text-[#4E6559]">
            <Lock className="w-3 h-3 text-[#1B4332]" />
            <span>Zero database storage · Messages evaluated in-memory only</span>
          </div>
          <div>
            Warning signs aren't proof of fraud. Verify independently before acting.
          </div>
        </div>
      </div>
    </footer>
  );
};

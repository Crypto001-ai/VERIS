import React from 'react';
import { Lock, EyeOff } from 'lucide-react';

interface PrivacyBannerProps {
  onAutoRedact?: () => void;
  canAutoRedact?: boolean;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({
  onAutoRedact,
  canAutoRedact = false,
}) => {
  return (
    <div className="rounded-xl border border-[#E4E8E3] bg-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-[#EBF3EE] text-[#1B4332] flex items-center justify-center shrink-0">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <p className="text-[#4E6559] leading-relaxed">
          <span className="font-semibold text-[#18221D]">Private by design:</span> Messages are evaluated in memory and never stored or logged. Redact real phone numbers or accounts before submitting.
        </p>
      </div>

      {canAutoRedact && onAutoRedact && (
        <button
          onClick={onAutoRedact}
          className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#EBF3EE] text-[#1B4332] border border-[#E4E8E3] rounded-lg transition-colors font-medium text-xs"
          title="Mask potential account numbers and phone numbers"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Auto-Redact Numbers</span>
        </button>
      )}
    </div>
  );
};

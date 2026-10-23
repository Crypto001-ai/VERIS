import React, { useState } from 'react';
import { X, EyeOff, Check, Copy } from 'lucide-react';
import { useToast } from './Toast.js';

interface RedactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRedactedText: (text: string) => void;
  currentText: string;
}

export const RedactionModal: React.FC<RedactionModalProps> = ({
  isOpen,
  onClose,
  onApplyRedactedText,
  currentText,
}) => {
  const [sandboxText, setSandboxText] = useState(currentText);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const performRedaction = (raw: string) => {
    // Redact 10-digit NUBAN / account numbers
    let redacted = raw.replace(/\b\d{10}\b/g, '[REDACTED_ACCOUNT]');
    // Redact 11-digit BVN or NIN numbers
    redacted = redacted.replace(/\b\d{11}\b/g, '[REDACTED_BVN_OR_NIN]');
    // Redact typical international or local phone numbers (+234..., 080..., 070..., 090..., +1...)
    redacted = redacted.replace(
      /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      '[REDACTED_PHONE]'
    );
    // Redact email addresses
    redacted = redacted.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      '[REDACTED_EMAIL]'
    );
    return redacted;
  };

  const handleApply = () => {
    const cleaned = performRedaction(sandboxText);
    onApplyRedactedText(cleaned);
    onClose();
  };

  const handleRedactInPlace = () => {
    setSandboxText(performRedaction(sandboxText));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sandboxText).then(() => {
      setCopied(true);
      toast.success('Copied successfully');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-[#E4E8E3] bg-white shadow-xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E8E3]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#EBF3EE] text-[#1B4332] flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#18221D]">
              Privacy & Redaction Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#18221D] hover:bg-[#F4F6F3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-[#4E6559] leading-relaxed">
          <p>
            VERIS evaluates messages in memory and never retains database records. However, removing sensitive identifiers before submitting is recommended:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#6B7280]">
            <li>Bank account numbers (10 digits)</li>
            <li>Bank Verification Numbers (BVN) and National Identity Numbers (NIN)</li>
            <li>Personal telephone numbers and email addresses</li>
            <li>Real names or physical home addresses</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#18221D]">Interactive Sandbox</label>
            <button
              onClick={handleRedactInPlace}
              className="text-[#1B4332] hover:underline text-xs font-semibold"
            >
              Run auto-redact rules
            </button>
          </div>

          <textarea
            value={sandboxText}
            onChange={(e) => setSandboxText(e.target.value)}
            placeholder="Paste text here to inspect or redact..."
            className="w-full h-32 p-3 rounded-xl bg-[#FAF9F5] border border-[#E4E8E3] text-[#18221D] placeholder-[#9CA3AF] text-xs focus:outline-none focus:border-[#1B4332]"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E4E8E3] text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[#4E6559] hover:text-[#18221D] px-3 py-1.5 rounded-lg hover:bg-[#F4F6F3] transition-colors font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1B4332]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy text</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-[#4E6559] hover:text-[#18221D] rounded-lg hover:bg-[#F4F6F3] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl font-semibold bg-[#1B4332] text-white hover:bg-[#133825] transition-colors shadow-xs"
            >
              Apply to Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

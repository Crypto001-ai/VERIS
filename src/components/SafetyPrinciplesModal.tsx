import React from 'react';
import { X, ShieldCheck, PauseCircle, PhoneOff, KeyRound, Scale } from 'lucide-react';

interface SafetyPrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyPrinciplesModal: React.FC<SafetyPrinciplesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const principles = [
    {
      icon: <PauseCircle className="w-4 h-4 text-[#1B4332]" />,
      title: '1. The Emergency Pause',
      summary:
        'Fraudsters manufacture acute panic (claiming to be in the hospital, facing arrest, or imminent bank suspension) specifically to shut down rational scrutiny. Taking a calm 5-minute pause breaks psychological leverage.',
    },
    {
      icon: <PhoneOff className="w-4 h-4 text-[#B45309]" />,
      title: '2. The Channel Break',
      summary:
        'Never reply to the suspicious message or call numbers sent within it. Reach out to the sender via a pre-existing trusted offline number already saved in your contacts, or speak with mutual friends directly.',
    },
    {
      icon: <Scale className="w-4 h-4 text-[#4E6559]" />,
      title: '3. Evidence Over Confidence Scores',
      summary:
        'A message with suspicious signs is not guaranteed to be fraud; a message with clean text is not guaranteed to be safe. VERIS rejects arbitrary percentages in favor of specific, evidence-grounded facts.',
    },
    {
      icon: <KeyRound className="w-4 h-4 text-[#B91C1C]" />,
      title: '4. Non-Negotiable Vault Credentials',
      summary:
        'Under no circumstances provide your Bank Verification Number (BVN), National Identity Number (NIN), debit card PIN, online banking passwords, or SMS OTPs. Genuine institutions never request these over chat.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#1B4332]" />,
      title: '5. Independent Verification First',
      summary:
        'Do not replace your critical thinking with AI verdicts. Use VERIS as a calm sounding board to spot manipulative tactics, then verify the facts through established physical or official channels.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-[#E4E8E3] bg-white shadow-xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E8E3]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#EBF3EE] text-[#1B4332] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#18221D]">
              VERIS Core Safety Principles
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#18221D] hover:bg-[#F4F6F3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-[#E4E8E3] bg-[#FAF9F5] space-y-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                {p.icon}
                <span className="font-semibold text-[#18221D]">{p.title}</span>
              </div>
              <p className="text-[#4E6559] leading-relaxed pl-6">{p.summary}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1B4332] text-white hover:bg-[#133825] transition-colors shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

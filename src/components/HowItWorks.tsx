import React from 'react';
import { MessageSquareText, Search, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Paste suspicious message',
      description: 'Copy and paste any suspicious SMS, WhatsApp message, email, or upload a screenshot directly into Veris.',
      icon: <MessageSquareText className="w-5 h-5 text-[#1B4332]" />,
    },
    {
      step: 'Step 2',
      title: 'Veris analyzes for red flags',
      description: 'Our engine inspects the text for artificial urgency, emergency claims, bank bypass pretexts, and credential harvesting.',
      icon: <Search className="w-5 h-5 text-[#1B4332]" />,
    },
    {
      step: 'Step 3',
      title: 'Get verdict before you act',
      description: 'Review an evidence-grounded verdict, practical offline verification questions, and safe next steps before transferring funds.',
      icon: <ShieldCheck className="w-5 h-5 text-[#1B4332]" />,
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 pt-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18221D]">
          How It Works
        </h2>
        <p className="text-xs sm:text-sm text-[#4E6559]">
          Three simple steps to verify before you pay
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-[#E4E8E3] bg-white p-5 space-y-3 shadow-xs hover:border-[#1B4332]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#EBF3EE] flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-xs font-mono font-bold text-[#1B4332] bg-[#EBF3EE] px-2.5 py-1 rounded-md">
                {item.step}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#18221D]">
                {item.title}
              </h3>
              <p className="text-xs text-[#4E6559] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

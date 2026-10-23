import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'Is my message stored anywhere?',
      answer: 'No. Veris analyzes messages in-memory only. Nothing is saved, logged or shared.',
    },
    {
      question: 'How accurate is Veris?',
      answer:
        'Veris uses Google Gemma 4 to identify known fraud patterns. It is a second opinion tool — always use your own judgment too.',
    },
    {
      question: 'Can I use Veris for screenshots?',
      answer:
        'Yes. Upload any screenshot of a suspicious message and Veris will analyze the visible text and patterns.',
    },
    {
      question: 'Is Veris free?',
      answer: 'Yes, completely free. No account needed, no data collected.',
    },
  ];

  // Single state value: only one answer can be expanded at a time (collapsed by default)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    // If currently open, close it (null); otherwise open the clicked index
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="scroll-mt-20 pt-8 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#EBF3EE] text-[#1B4332] flex items-center justify-center">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18221D]">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#4E6559]">
          Everything you need to know about using Veris safely
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = expandedIndex === idx;
          const contentId = `faq-answer-${idx}`;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E4E8E3] bg-white overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAF9F5] transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-[#18221D] pr-4">
                  {faq.question}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#E4E8E3] flex items-center justify-center text-[#18221D] shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div
                  id={contentId}
                  className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-[#4E6559] leading-relaxed border-t border-[#F0F2EE] animate-in fade-in duration-200 motion-reduce:transition-none"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

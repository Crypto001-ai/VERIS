import React from 'react';
import { Home, Image as ImageIcon } from 'lucide-react';

interface NotFoundPageProps {
  onBackToSafety: () => void;
  onScanScreenshot: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onBackToSafety,
  onScanScreenshot,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 sm:py-16 px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl mx-auto text-center space-y-6">
        {/* Custom Minimalist Vector Illustration: Magnifying Glass & Empty Chat Bubble */}
        <div className="flex justify-center mb-2">
          <svg
            className="w-48 h-36 sm:w-56 sm:h-44 select-none drop-shadow-xs"
            viewBox="0 0 240 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustration of a magnifying glass examining an empty message bubble with missing evidence"
          >
            {/* Subtle radar / evidence scan grid background */}
            <circle
              cx="110"
              cy="85"
              r="70"
              stroke="#A9C6B5"
              strokeOpacity="0.25"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
            <circle
              cx="110"
              cy="85"
              r="45"
              stroke="#A9C6B5"
              strokeOpacity="0.35"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />

            {/* Empty Chat Bubble (Missing evidence / ghost message) */}
            <g transform="translate(45, 30)">
              {/* Bubble body with small tail */}
              <path
                d="M12 4C5.37258 4 0 9.37258 0 16V60C0 66.6274 5.37258 72 12 72H24V86L38 72H96C102.627 72 108 66.6274 108 60V16C108 9.37258 102.627 4 96 4H12Z"
                fill="#FFFFFF"
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Ghosted / Missing placeholder message lines */}
              <line
                x1="20"
                y1="24"
                x2="88"
                y2="24"
                stroke="#E2E8F0"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
              <line
                x1="20"
                y1="38"
                x2="72"
                y2="38"
                stroke="#E2E8F0"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
              <line
                x1="20"
                y1="52"
                x2="54"
                y2="52"
                stroke="#E2E8F0"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />

              {/* Small ghost spark / missing clue marker */}
              <circle cx="86" cy="46" r="2.5" fill="#A9C6B5" />
              <circle cx="94" cy="50" r="1.5" fill="#A9C6B5" fillOpacity="0.6" />
            </g>

            {/* Magnifying Glass examining the empty bubble */}
            <g transform="translate(100, 40)">
              {/* Glass Rim Shadow/Underlay */}
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="#FAFBF8"
                fillOpacity="0.85"
                stroke="#174D3B"
                strokeWidth="4"
              />

              {/* Lens Interior & subtle reflection highlight */}
              <circle
                cx="42"
                cy="42"
                r="32"
                fill="#A9C6B5"
                fillOpacity="0.12"
              />
              <path
                d="M20 30C23 22 30 16 40 14"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Missing Evidence: Question Mark inside the lens */}
              <path
                d="M38 32C38 29.5 40 27.5 42.5 27.5C45 27.5 47 29.5 47 32C47 34.5 44 36 42.5 38V42"
                stroke="#174D3B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="42.5" cy="48" r="1.5" fill="#D97706" />

              {/* Magnifying Glass Metal Joint */}
              <path
                d="M68 68L75 75"
                stroke="#A9C6B5"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Magnifying Glass Wooden / Forest Green Handle */}
              <path
                d="M74 74L105 105"
                stroke="#174D3B"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M79 79L101 101"
                stroke="#133825"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* Tiny playful floating dots */}
            <circle cx="36" cy="115" r="3" fill="#D97706" fillOpacity="0.4" />
            <circle cx="46" cy="122" r="1.5" fill="#174D3B" fillOpacity="0.3" />
            <circle cx="215" cy="65" r="2" fill="#A9C6B5" />
          </svg>
        </div>

        {/* Status Pill Badge: ERROR 404 */}
        <div className="flex justify-center">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#EBF3EE] text-[#174D3B] border border-[#A9C6B5]/40 font-mono shadow-2xs">
            ERROR 404
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#18221D] leading-tight">
            Looks like this link is a ghost.
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-[#4E6559] max-w-lg mx-auto leading-relaxed">
            We scan suspicious messages for a living, but this page seems to have disappeared without leaving any evidence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {/* Primary Action Button: Back to Safety */}
          <button
            type="button"
            onClick={onBackToSafety}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#174D3B] hover:bg-[#133825] active:bg-[#0E281A] text-white text-sm font-semibold transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174D3B]"
          >
            <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to Safety</span>
          </button>

          {/* Secondary Action Button: Scan a Screenshot */}
          <button
            type="button"
            onClick={onScanScreenshot}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#F4F6F3] active:bg-[#EAECE8] text-[#18221D] border border-[#D1D5DB] hover:border-[#174D3B]/40 text-sm font-semibold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#174D3B]"
          >
            <ImageIcon className="w-4 h-4 text-[#174D3B] shrink-0" aria-hidden="true" />
            <span>Scan a Screenshot</span>
          </button>
        </div>

        {/* Humorous Footer Note */}
        <div className="pt-8 border-t border-[#E4E8E3] max-w-md mx-auto">
          <p className="text-xs sm:text-sm text-[#6B7280] italic leading-relaxed">
            “VERIS can spot a phishing scam from a mile away, but apparently this URL knows how to disappear. 😉”
          </p>
        </div>
      </div>
    </div>
  );
};

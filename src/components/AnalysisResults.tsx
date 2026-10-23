import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Printer,
  Info,
  Sparkles,
  HelpCircle as QuestionIcon,
  RefreshCw,
  X
} from 'lucide-react';
import { AnalysisResult, EvidenceItem, NextStepItem, ReassuringIndicator } from '../types/veris.js';
import { useToast } from './Toast.js';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
  onRefineWithContext?: (answer: string, question: string) => void;
  isRefining?: boolean;
}

/**
 * Translate technical detection indicators into plain, human-friendly wording
 */
function humanizeIndicator(rawIndicator: string): string {
  const lower = (rawIndicator || '').toLowerCase();
  if (lower.includes('urgency') || lower.includes('fear') || lower.includes('deadline')) {
    return 'Pressure to act quickly';
  }
  if (
    lower.includes('credential') ||
    lower.includes('harvest') ||
    lower.includes('bvn') ||
    lower.includes('nin') ||
    lower.includes('otp')
  ) {
    return 'Request for sensitive credentials';
  }
  if (lower.includes('bank bypass') || lower.includes('app down') || lower.includes('bypass')) {
    return "Payment request that hasn't been verified";
  }
  if (
    lower.includes('emotional') ||
    lower.includes('emergency') ||
    lower.includes('distress') ||
    lower.includes('hospital')
  ) {
    return 'Emotional pressure or crisis claim';
  }
  if (
    lower.includes('yield') ||
    lower.includes('guaranteed') ||
    lower.includes('crypto') ||
    lower.includes('activation fee')
  ) {
    return 'Unrealistic investment promise';
  }
  if (lower.includes('low-pressure') || lower.includes('context')) {
    return 'Routine, unpressured request';
  }
  if (lower.includes('unsolicited') || lower.includes('lure')) {
    return 'Unsolicited offer or prize lure';
  }
  return rawIndicator;
}

/**
 * Select the single most relevant verification question based on context
 */
function getTailoredVerificationQuestion(result: AnalysisResult): string {
  const allText = [
    result.summary,
    result.sensitiveInfoWarning || '',
    ...result.whyItDeservesAttention,
    ...result.identifiedEvidence.map((e) => `${e.quote} ${e.indicator} ${e.explanation}`),
  ]
    .join(' ')
    .toLowerCase();

  // 1. Sensitive information / credentials
  if (
    allText.includes('bvn') ||
    allText.includes('nin') ||
    allText.includes('otp') ||
    allText.includes('password') ||
    allText.includes('credential') ||
    allText.includes('mother')
  ) {
    return 'Can I confirm which official department needs this information and through which official portal?';
  }

  // 2. Relative or personal emergency claim
  if (
    allText.includes('hospital') ||
    allText.includes('emergency') ||
    allText.includes('accident') ||
    allText.includes('stranded') ||
    allText.includes('banking app is down')
  ) {
    return 'Can I speak to you directly on your usual phone number before I send any money?';
  }

  // 3. AWS / cloud credits / competition
  if (allText.includes('aws') || allText.includes('deepracer') || allText.includes('credit')) {
    return 'Can I view and confirm these credits directly inside my official AWS Billing Console?';
  }

  // 4. Job recruitment
  if (allText.includes('interview') || allText.includes('recruitment') || allText.includes('job')) {
    return 'Can you provide the official careers requisition link or verify via company email domain?';
  }

  // 5. Financial institution or bank suspension threat
  if (
    allText.includes('bank') ||
    allText.includes('account') ||
    allText.includes('suspended') ||
    allText.includes('cbn')
  ) {
    return "Can I verify this directly with customer service via the number on the back of my card?";
  }

  // Fallback to model's first specific offline question if available
  if (result.senderVerificationQuestions && result.senderVerificationQuestions.length > 0) {
    return result.senderVerificationQuestions[0];
  }

  return 'Can I verify this request through an established official contact channel?';
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  onReset,
  onRefineWithContext,
  isRefining = false,
}) => {
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isQuestionDismissed, setIsQuestionDismissed] = useState(false);
  const toast = useToast();

  const primaryEvidence: EvidenceItem[] = result.identifiedEvidence.slice(0, 3);
  const remainingEvidence: EvidenceItem[] = result.identifiedEvidence.slice(3);

  const immediateAction: NextStepItem | undefined = result.whatToDoNext[0];
  const secondaryActions: NextStepItem[] = result.whatToDoNext.slice(1, 3);
  const furtherActions: NextStepItem[] = result.whatToDoNext.slice(3);

  const reassuringItems: ReassuringIndicator[] = result.reassuringIndicators || [];

  const tailoredQuestion = getTailoredVerificationQuestion(result);

  // Configure verdict appearance based on calibrated assessment type
  const getVerdictStyle = () => {
    switch (result.assessment) {
      case 'Likely legitimate':
        return {
          bannerBg: 'bg-[#F0FDF4]',
          bannerBorder: 'border-[#BBF7D0]',
          titleColor: 'text-[#166534]',
          badgeBg: 'bg-[#DCFCE7]',
          badgeText: 'text-[#15803D]',
          icon: <CheckCircle className="w-6 h-6 text-[#15803D] shrink-0" />,
          plainVerdict: 'Likely Legitimate',
          plainExplanation: result.summary,
          disclaimer:
            'Plausibility in context does not guarantee sender authenticity. Always verify through official channels if funds or accounts are involved.',
        };
      case 'Unclear — verify first':
        return {
          bannerBg: 'bg-[#F4F6F3]',
          bannerBorder: 'border-[#CBD5E1]',
          titleColor: 'text-[#1E293B]',
          badgeBg: 'bg-[#E2E8F0]',
          badgeText: 'text-[#334155]',
          icon: <HelpCircle className="w-6 h-6 text-[#475569] shrink-0" />,
          plainVerdict: 'Unclear — Verify First',
          plainExplanation: result.summary,
          disclaimer:
            'Lacks sufficient context to prove or disprove authenticity. Check your personal records before taking action.',
        };
      case 'Suspicious':
        return {
          bannerBg: 'bg-[#FFFBEB]',
          bannerBorder: 'border-[#FDE68A]',
          titleColor: 'text-[#92400E]',
          badgeBg: 'bg-[#FEF3C7]',
          badgeText: 'text-[#B45309]',
          icon: <AlertTriangle className="w-6 h-6 text-[#B45309] shrink-0" />,
          plainVerdict: 'Suspicious Signs Identified',
          plainExplanation: result.summary,
          disclaimer:
            'Identified warning signs warrant caution. Do not proceed until independently verified through trusted channels.',
        };
      case 'High risk':
      default:
        return {
          bannerBg: 'bg-[#FEF2F2]',
          bannerBorder: 'border-[#FECACA]',
          titleColor: 'text-[#991B1B]',
          badgeBg: 'bg-[#FEE2E2]',
          badgeText: 'text-[#B91C1C]',
          icon: <ShieldAlert className="w-6 h-6 text-[#B91C1C] shrink-0" />,
          plainVerdict: 'High Risk — Do Not Comply',
          plainExplanation: result.summary,
          disclaimer:
            'Shows clear indicators of deception, credential theft, or unauthorized financial extraction.',
        };
    }
  };

  const verdict = getVerdictStyle();

  const handleCopyChecklist = () => {
    const textLines = [
      `VERIS ASSESSMENT: ${result.assessment.toUpperCase()}`,
      `Summary: ${result.summary}`,
      '',
      ...(reassuringItems.length > 0
        ? [
            'WHAT LOOKS REASSURING:',
            ...reassuringItems.map((r) => `• ${r.indicator}: ${r.explanation}`),
            '',
          ]
        : []),
      'RECOMMENDED ACTION:',
      immediateAction ? `${immediateAction.title} - ${immediateAction.instruction}` : '',
      ...secondaryActions.map((s) => `${s.stepNumber}. ${s.title}: ${s.instruction}`),
      '',
      `VERIFICATION QUESTION: "${tailoredQuestion}"`,
      '',
      result.sensitiveInfoWarning ? `WARNING: ${result.sensitiveInfoWarning}` : '',
      '',
      verdict.disclaimer,
    ].filter(Boolean);

    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setCopiedChecklist(true);
      toast.success('Copied summary to clipboard');
      setTimeout(() => setCopiedChecklist(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Utility Nav */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E4E8E3]">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-[#4E6559] hover:text-[#18221D] transition-colors py-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Check another message</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyChecklist}
            className="flex items-center gap-1.5 text-xs text-[#18221D] bg-white border border-[#E4E8E3] hover:bg-[#F4F6F3] transition-colors px-3 py-1.5 rounded-lg shadow-xs font-medium cursor-pointer"
            title="Copy summary to clipboard"
          >
            {copiedChecklist ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1B4332]" />
                <span className="text-[#1B4332]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#18221D] bg-white border border-[#E4E8E3] hover:bg-[#F4F6F3] transition-colors px-3 py-1.5 rounded-lg shadow-xs font-medium cursor-pointer"
            title="Print assessment"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 1. Results-First Verdict Card */}
      <div className={`rounded-2xl border ${verdict.bannerBorder} ${verdict.bannerBg} p-5 sm:p-6 space-y-3 shadow-xs`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {verdict.icon}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4E6559]">
                  Assessment
                </span>
                {result.isRefined && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#1B4332]/10 text-[#1B4332] px-2 py-0.5 rounded">
                    Refined with your context
                  </span>
                )}
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${verdict.titleColor}`}>
                {verdict.plainVerdict}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#2D3748] leading-relaxed pt-1">
          {verdict.plainExplanation}
        </p>

        {/* Visible Honest Disclaimer */}
        <div className="pt-3 border-t border-black/5 flex items-start gap-2 text-xs text-[#6B7280]">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{verdict.disclaimer}</span>
        </div>
      </div>

      {/* 2. Contextual Follow-Up Question Widget (If Available) */}
      {result.contextQuestion && !isQuestionDismissed && onRefineWithContext && (
        <div className="rounded-2xl border border-[#D5E2D9] bg-[#F7FAF8] p-5 sm:p-6 space-y-3.5 shadow-xs relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1B4332]" />
              <h3 className="text-sm font-bold text-[#18221D]">
                Would extra context help refine this?
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsQuestionDismissed(true)}
              className="text-[#6B7280] hover:text-[#18221D] p-1 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
              title="Skip question"
              aria-label="Skip question"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed">
            {result.contextQuestion.question}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(result.contextQuestion.options || ['Yes', 'No', 'Not sure']).map((option) => (
              <button
                key={option}
                type="button"
                disabled={isRefining}
                onClick={() => onRefineWithContext(option, result.contextQuestion!.question)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#CBD5E1] hover:border-[#1B4332] hover:bg-[#EBF3EE] text-[#18221D] transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isRefining ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-[#1B4332]" />
                ) : null}
                <span>{option}</span>
              </button>
            ))}

            <button
              type="button"
              disabled={isRefining}
              onClick={() => setIsQuestionDismissed(true)}
              className="px-3 py-2 text-xs text-[#6B7280] hover:text-[#18221D] transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>

          {result.userContextAnswer && (
            <div className="text-[11px] text-[#4E6559] pt-1">
              Current answer: <strong className="text-[#18221D]">{result.userContextAnswer}</strong>
            </div>
          )}
        </div>
      )}

      {/* 3. Reassuring Indicators (When present for Legitimate / Unclear messages) */}
      {reassuringItems.length > 0 && (
        <div className="rounded-2xl border border-[#E4E8E3] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#15803D]" />
              <h3 className="text-base sm:text-lg font-bold text-[#18221D]">
                What looks reassuring?
              </h3>
            </div>
            <p className="text-xs text-[#4E6559] mt-0.5">
              Plausible characteristics observed in the communication.
            </p>
          </div>

          <div className="space-y-3">
            {reassuringItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E4E8E3] bg-[#F9FAF8] p-3.5 sm:p-4 space-y-1.5 text-xs"
              >
                <div className="flex items-center gap-1.5 font-semibold text-[#18221D] text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] shrink-0" />
                  <span>{item.indicator}</span>
                </div>

                {item.quote && (
                  <div className="p-2.5 rounded-lg bg-white border border-[#E4E8E3] text-[#18221D] italic text-xs">
                    "{item.quote}"
                  </div>
                )}

                <p className="text-[#4E6559] leading-relaxed text-xs pl-3">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. What Looks Suspicious? (Primary Red Flags if present) */}
      {primaryEvidence.length > 0 && (
        <div className="rounded-2xl border border-[#E4E8E3] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B45309]" />
              <h3 className="text-base sm:text-lg font-bold text-[#18221D]">
                What looks suspicious?
              </h3>
            </div>
            <p className="text-xs text-[#4E6559] mt-0.5">
              Specific warning signs identified in the communication.
            </p>
          </div>

          <div className="space-y-3">
            {primaryEvidence.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#F0F2EE] bg-[#FAF9F5] p-3.5 sm:p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#18221D] text-xs sm:text-sm">
                    {humanizeIndicator(item.indicator)}
                  </span>
                  {item.severity === 'high' ? (
                    <span className="text-[11px] font-medium text-[#B91C1C] bg-[#FEF2F2] px-2 py-0.5 rounded">
                      High caution
                    </span>
                  ) : item.severity === 'medium' ? (
                    <span className="text-[11px] font-medium text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded">
                      Moderate caution
                    </span>
                  ) : null}
                </div>

                {item.quote && (
                  <div className="p-2.5 rounded-lg bg-white border border-[#E4E8E3] text-[#18221D] italic text-xs">
                    "{item.quote}"
                  </div>
                )}

                <p className="text-[#4E6559] leading-relaxed text-xs">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. One Practical Next Step + Supporting Steps */}
      <div className="rounded-2xl border border-[#E4E8E3] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#18221D]">
            Here's what to do
          </h3>
          <p className="text-xs text-[#4E6559] mt-0.5">
            Practical recommendations tailored to this outcome.
          </p>
        </div>

        {/* Primary Recommended Action (Step 1) */}
        {immediateAction && (
          <div className="rounded-xl border border-[#1B4332]/25 bg-[#EBF3EE] p-4 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-[#18221D] font-semibold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                1
              </span>
              <span>{immediateAction.title}</span>
              <span className="text-[10px] uppercase font-bold text-[#1B4332] ml-auto tracking-wider bg-white/70 px-2 py-0.5 rounded">
                Recommended Next Step
              </span>
            </div>
            <p className="text-[#2D3748] leading-relaxed pl-7 text-xs sm:text-sm">
              {immediateAction.instruction}
            </p>
          </div>
        )}

        {/* Secondary Supporting Steps */}
        {secondaryActions.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {secondaryActions.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-xl border border-[#F0F2EE] bg-[#FAF9F5] p-3.5 text-xs flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-white border border-[#D1D5DB] text-[#18221D] flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                  {step.stepNumber}
                </span>
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#18221D] text-xs">
                    {step.title}
                  </div>
                  <p className="text-[#4E6559] leading-relaxed text-xs">
                    {step.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Offline Verification Question */}
      <div className="rounded-2xl border border-[#E4E8E3] bg-white p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#1B4332]" />
          <h3 className="text-base sm:text-lg font-bold text-[#18221D]">
            What to ask or verify independently
          </h3>
        </div>
        <p className="text-xs text-[#4E6559]">
          Verify this request directly through an established, independent channel:
        </p>

        <div className="flex items-center justify-between p-4 rounded-xl border border-[#E4E8E3] bg-[#EBF3EE] text-[#1B4332] font-medium text-sm sm:text-base leading-relaxed gap-3">
          <span>"{tailoredQuestion}"</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(tailoredQuestion).then(() => {
                toast.success('Copied question to clipboard');
              });
            }}
            aria-label="Copy verification question"
            title="Copy verification question"
            className="shrink-0 p-2 rounded-lg hover:bg-[#1B4332]/10 text-[#1B4332] transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7. Collapsible "Want more details?" */}
      <div className="rounded-2xl border border-[#E4E8E3] bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          aria-expanded={isDetailsExpanded}
          aria-controls="veris-more-details-panel"
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAF9F5] transition-colors cursor-pointer"
        >
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-[#18221D]">Want more details?</span>
            <p className="text-xs text-[#4E6559]">
              Honest system limitations, additional evidence, and evaluation provenance.
            </p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#E4E8E3] flex items-center justify-center text-[#18221D] shrink-0">
            {isDetailsExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isDetailsExpanded && (
          <div
            id="veris-more-details-panel"
            className="p-5 sm:p-6 border-t border-[#E4E8E3] space-y-6 bg-[#FAF9F5]/40 text-xs"
          >
            {/* Sensitive Information Warning */}
            {result.sensitiveInfoWarning && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-1.5 text-rose-900">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-800">
                  <ShieldAlert className="w-4 h-4 text-[#B91C1C]" />
                  <span>Sensitive Credential Warning</span>
                </div>
                <p className="text-xs leading-relaxed text-rose-900 font-medium">
                  {result.sensitiveInfoWarning}
                </p>
              </div>
            )}

            {/* Honest Limitations (What VERIS can't confirm) */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#18221D] text-xs uppercase tracking-wider">
                What Veris cannot confirm
              </h4>
              <p className="text-xs text-[#4E6559] leading-relaxed">
                Veris evaluates only the submitted text and image. It does not possess direct visibility into private ledgers, external mail delivery infrastructure, or offline identity:
              </p>
              <div className="space-y-1.5 pl-2">
                {result.whatRemainsUnverified.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#4E6559]">
                    <span className="text-[#1B4332] font-bold">·</span>
                    <span className="leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Evidence (if >3) */}
            {remainingEvidence.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-[#18221D] text-xs uppercase tracking-wider">
                  Additional Isolated Evidence
                </h4>
                <div className="space-y-2">
                  {remainingEvidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[#E4E8E3] bg-white space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#18221D]">
                        <span>{humanizeIndicator(item.indicator)}</span>
                        <span className="text-[11px] text-[#6B7280] font-normal capitalize">
                          Severity: {item.severity}
                        </span>
                      </div>
                      {item.quote && (
                        <div className="text-[11px] text-[#4E6559] italic">
                          "{item.quote}"
                        </div>
                      )}
                      <p className="text-[11px] text-[#6B7280] leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Further Protective Steps */}
            {furtherActions.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-[#E4E8E3]">
                <h4 className="font-bold text-[#18221D] text-xs uppercase tracking-wider">
                  Further Protective Steps
                </h4>
                <div className="space-y-2">
                  {furtherActions.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3 rounded-lg border border-[#E4E8E3] bg-white flex items-start gap-2.5"
                    >
                      <span className="font-semibold text-xs text-[#18221D]">
                        {step.stepNumber}.
                      </span>
                      <div>
                        <div className="font-semibold text-[#18221D] text-xs">
                          {step.title}
                        </div>
                        <p className="text-[#6B7280] text-[11px] leading-relaxed">
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model & Evaluation Attribution */}
            <div className="pt-3 border-t border-[#E4E8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#9CA3AF] font-mono">
              <div>
                <span>Engine: </span>
                <span className="text-[#4E6559]">{result.modelName}</span>
                <span className="mx-1.5">·</span>
                <span>Calibrated Evidence Evaluation</span>
              </div>
              <div>
                <span>Evaluated: {new Date(result.analyzedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA to check another */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl border border-[#D1D5DB] bg-white hover:bg-[#F4F6F3] text-[#18221D] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          Check Another Message or Screenshot
        </button>
      </div>
    </div>
  );
};

export type AssessmentType =
  | 'Likely legitimate'
  | 'Unclear — verify first'
  | 'Suspicious'
  | 'High risk';

export interface EvidenceItem {
  quote: string;
  indicator: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ReassuringIndicator {
  indicator: string;
  explanation: string;
  quote?: string;
}

export interface ContextQuestion {
  question: string;
  options: string[]; // e.g. ["Yes", "No", "Not sure"]
  contextKey?: string;
}

export interface NextStepItem {
  stepNumber: number;
  title: string;
  instruction: string;
  urgency: 'immediate' | 'verification' | 'protection';
}

export interface AnalysisResult {
  assessment: AssessmentType;
  summary: string;
  reassuringIndicators?: ReassuringIndicator[];
  whyItDeservesAttention: string[];
  whatToDoNext: NextStepItem[];
  whatRemainsUnverified: string[];
  sensitiveInfoWarning: string | null;
  identifiedEvidence: EvidenceItem[];
  senderVerificationQuestions: string[];
  contextQuestion?: ContextQuestion | null;
  userContextAnswer?: string | null;
  isRefined?: boolean;
  providerUsed: 'google-genai' | 'open-weight-gemma' | 'custom-endpoint' | 'local-engine';
  modelName: string;
  isOpenWeight: boolean;
  analyzedAt: string;
  hasImage: boolean;
}

export interface ProviderConfig {
  selectedProvider: 'auto' | 'gemini' | 'gemma';
  customEndpoint?: string;
  customApiKey?: string;
  customModelName?: string;
}

export interface ModelInfo {
  geminiAvailable: boolean;
  geminiModel: string;
  gemmaConfigured: boolean;
  gemmaModel: string;
  gemmaEndpoint?: string;
  multimodalSupport: {
    gemini: boolean;
    gemma: boolean;
  };
}

export interface SampleScenario {
  id: string;
  title: string;
  category: string;
  badge: string;
  messageText: string;
  description: string;
}

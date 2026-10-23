import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { PrivacyBanner } from './components/PrivacyBanner.js';
import { ScenarioSelector } from './components/ScenarioSelector.js';
import { AnalysisWorkspace } from './components/AnalysisWorkspace.js';
import { AnalysisResults } from './components/AnalysisResults.js';
import { HowItWorks } from './components/HowItWorks.js';
import { FAQSection } from './components/FAQSection.js';
import { SafetyTipsDrawer } from './components/SafetyTipsDrawer.js';
import { ModelSettingsModal } from './components/ModelSettingsModal.js';
import { SafetyPrinciplesModal } from './components/SafetyPrinciplesModal.js';
import { RedactionModal } from './components/RedactionModal.js';
import { NotFoundPage } from './components/NotFoundPage.js';
import { Footer } from './components/Footer.js';
import { ToastProvider, useToast } from './components/Toast.js';
import {
  AnalysisResult,
  ModelInfo,
  ProviderConfig,
  SampleScenario,
} from './types/veris.js';

function VerisApp() {
  const toast = useToast();
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    base64: string;
    mimeType: string;
    name: string;
    size: number;
  } | null>(null);

  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });
  const [autoFocusScreenshot, setAutoFocusScreenshot] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  const isNotFound = currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '';

  const handleGoHome = () => {
    if (isNotFound) {
      navigateTo('/');
    }
    setAnalysisResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSafety = () => {
    navigateTo('/');
    setAnalysisResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanScreenshotFrom404 = () => {
    navigateTo('/');
    setAnalysisResult(null);
    setErrorMessage(null);
    setAutoFocusScreenshot(true);
  };

  // Modals & Drawer state
  const [isSafetyTipsOpen, setIsSafetyTipsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrinciplesOpen, setIsPrinciplesOpen] = useState(false);
  const [isPrivacyGuideOpen, setIsPrivacyGuideOpen] = useState(false);

  // Model & Provider State
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [providerConfig, setProviderConfig] = useState<ProviderConfig>(() => {
    const saved = localStorage.getItem('veris_provider_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { selectedProvider: 'gemma' };
  });

  // Fetch server model info on mount
  useEffect(() => {
    fetch('/api/model-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.info) {
          setModelInfo(data.info);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch /api/model-info:', err);
      });
  }, []);

  const handleSaveProviderConfig = (newConfig: ProviderConfig) => {
    setProviderConfig(newConfig);
    localStorage.setItem('veris_provider_config', JSON.stringify(newConfig));
  };

  const handleSelectScenario = (scenario: SampleScenario) => {
    setMessageText(scenario.messageText);
    setActiveScenarioId(scenario.id);
    setSelectedImage(null);
    setErrorMessage(null);
    setAnalysisResult(null);
  };

  const handleAutoRedactNumbers = () => {
    if (!messageText) return;
    let redacted = messageText.replace(/\b\d{10}\b/g, '[REDACTED_ACCOUNT]');
    redacted = redacted.replace(/\b\d{11}\b/g, '[REDACTED_BVN_OR_NIN]');
    redacted = redacted.replace(
      /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      '[REDACTED_PHONE]'
    );
    setMessageText(redacted);
  };

  const handleAnalyzeNow = () => {
    if (isNotFound) {
      navigateTo('/');
    }
    if (analysisResult) {
      setAnalysisResult(null);
    }
    setTimeout(() => {
      const inputEl = document.getElementById('message-input');
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputEl.focus();
      }
    }, 80);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (isNotFound) {
      navigateTo('/');
    }
    if (analysisResult) {
      setAnalysisResult(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAnalyze = async () => {
    const trimmed = messageText.trim();
    if (!trimmed && !selectedImage) {
      setErrorMessage('Please enter a message or upload a screenshot to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: trimmed,
          image: selectedImage
            ? {
                base64: selectedImage.base64,
                mimeType: selectedImage.mimeType,
              }
            : undefined,
          providerConfig,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        if (
          textResponse.includes('warmup') ||
          textResponse.includes('<!DOCTYPE') ||
          textResponse.includes('<!doctype')
        ) {
          throw new Error('VERIS server is currently initializing. Please try again in 3 seconds.');
        }
        throw new Error(`Server returned unexpected response (${response.status}). Please try again.`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setAnalysisResult(data.result);
      // Smooth scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      const errText =
        err.message || 'Analysis could not be completed. Please check your network connection or model configuration.';
      setErrorMessage(errText);
      toast.error("Couldn't analyse this message", {
        action: {
          label: 'Retry',
          onClick: () => {
            handleAnalyze();
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isRefining, setIsRefining] = useState(false);

  const handleRefineWithContext = async (contextAnswer: string, contextQuestion: string) => {
    setIsRefining(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: messageText.trim(),
          image: selectedImage
            ? {
                base64: selectedImage.base64,
                mimeType: selectedImage.mimeType,
              }
            : undefined,
          providerConfig,
          contextQuestion,
          contextAnswer,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine assessment');
      }

      setAnalysisResult(data.result);
      toast.success('Assessment updated with your context');
    } catch (err: any) {
      console.error('Refinement failed:', err);
      toast.error('Could not refine assessment');
    } finally {
      setIsRefining(false);
    }
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2D3748] flex flex-col font-sans selection:bg-[#1B4332]/10 selection:text-[#1B4332]">
      {/* Header */}
      <Header
        onOpenSafetyTips={() => setIsSafetyTipsOpen(true)}
        onAnalyzeNow={handleAnalyzeNow}
        onNavigateSection={handleNavigateSection}
        onGoHome={handleGoHome}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-8 flex flex-col">
        {isNotFound ? (
          <NotFoundPage
            onBackToSafety={handleBackToSafety}
            onScanScreenshot={handleScanScreenshotFrom404}
          />
        ) : (
          <>
            {/* Landing Hero Section */}
            {!analysisResult && (
              <div className="space-y-3 pt-2 pb-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#18221D] leading-tight">
                  Before you pay, <br className="hidden sm:inline" />
                  <span className="text-[#1B4332]">check the proof.</span>
                </h1>

                <p className="text-sm sm:text-base text-[#4E6559] max-w-2xl leading-relaxed">
                  Examine suspicious financial messages, emergency money demands, and payment requests before sending funds or sharing private banking details.
                </p>
              </div>
            )}

            {/* Privacy Reminder Banner */}
            <PrivacyBanner
              canAutoRedact={messageText.length > 0}
              onAutoRedact={handleAutoRedactNumbers}
            />

            {/* Results View or Analysis Workspace */}
            {analysisResult ? (
              <AnalysisResults
                result={analysisResult}
                onReset={handleResetAnalysis}
                onRefineWithContext={handleRefineWithContext}
                isRefining={isRefining}
              />
            ) : (
              <div className="space-y-8">
                {/* Primary Analysis Input Workspace */}
                <AnalysisWorkspace
                  messageText={messageText}
                  setMessageText={(txt) => {
                    setMessageText(txt);
                    setActiveScenarioId(null);
                  }}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                  providerConfig={providerConfig}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  autoFocusScreenshot={autoFocusScreenshot}
                  onScreenshotFocused={() => setAutoFocusScreenshot(false)}
                />

                {/* Test Scenarios Section */}
                <div className="pt-4 border-t border-[#E4E8E3]">
                  <ScenarioSelector
                    onSelectScenario={handleSelectScenario}
                    activeScenarioId={activeScenarioId}
                  />
                </div>
              </div>
            )}

            {/* How It Works & FAQ Sections - only rendered on initial landing view */}
            {!analysisResult && (
              <>
                <HowItWorks />
                <FAQSection />
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrinciples={() => setIsPrinciplesOpen(true)}
        onOpenPrivacyGuide={() => setIsPrivacyGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Safety Tips Slide-In Drawer */}
      <SafetyTipsDrawer
        isOpen={isSafetyTipsOpen}
        onClose={() => setIsSafetyTipsOpen(false)}
      />

      {/* Modals */}
      <ModelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        modelInfo={modelInfo}
        providerConfig={providerConfig}
        onSaveConfig={handleSaveProviderConfig}
      />

      <SafetyPrinciplesModal
        isOpen={isPrinciplesOpen}
        onClose={() => setIsPrinciplesOpen(false)}
      />

      <RedactionModal
        isOpen={isPrivacyGuideOpen}
        onClose={() => setIsPrivacyGuideOpen(false)}
        onApplyRedactedText={(text) => setMessageText(text)}
        currentText={messageText}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <VerisApp />
    </ToastProvider>
  );
}

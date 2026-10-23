import React, { useState } from 'react';
import { X, Server, Check, Info } from 'lucide-react';
import { ModelInfo, ProviderConfig } from '../types/veris.js';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: ModelInfo | null;
  providerConfig: ProviderConfig;
  onSaveConfig: (config: ProviderConfig) => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  modelInfo,
  providerConfig,
  onSaveConfig,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'gemini' | 'gemma'>(
    providerConfig.selectedProvider
  );
  const [customEndpoint, setCustomEndpoint] = useState(providerConfig.customEndpoint || '');
  const [customApiKey, setCustomApiKey] = useState(providerConfig.customApiKey || '');
  const [customModelName, setCustomModelName] = useState(
    providerConfig.customModelName || 'google/gemma-3-27b-it'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      selectedProvider,
      customEndpoint: customEndpoint.trim() || undefined,
      customApiKey: customApiKey.trim() || undefined,
      customModelName: customModelName.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-[#E4E8E3] bg-white shadow-xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E8E3]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#EBF3EE] text-[#1B4332] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#18221D]">
              Inference Provider & Model
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#18221D] hover:bg-[#F4F6F3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Notice */}
        <div className="p-3.5 rounded-xl border border-[#E4E8E3] bg-[#FAF9F5] text-xs text-[#4E6559] space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 text-[#18221D] font-semibold">
            <Info className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>AI Reasoning & Evaluation Engine</span>
          </div>
          <p>
            VERIS evaluates financial communications through evidence grounding. In cloud mode, it leverages Google GenAI (Gemini 3.8 Flash) or open-weight Gemma endpoints. In offline mode, a deterministic local heuristic engine provides instant protection.
          </p>
          {!modelInfo?.geminiAvailable && (
            <div className="mt-2 p-2 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[11px]">
              Offline Verification Engine currently active. Attach a Gemini API key in <strong>Settings &gt; Secrets</strong> to enable cloud multimodal reasoning.
            </div>
          )}
        </div>

        {/* Provider Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#18221D] block">
            Select Active Engine
          </label>

          <div className="space-y-2">
            {/* Option 1: Google GenAI Gemini 3.8 Flash */}
            <div
              onClick={() => setSelectedProvider('gemini')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedProvider === 'gemini' || selectedProvider === 'auto'
                  ? 'border-[#1B4332] bg-[#EBF3EE]'
                  : 'border-[#E4E8E3] bg-[#FAF9F5] hover:bg-[#F4F6F3]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#18221D]">Google GenAI (Gemini 3.8 Flash)</span>
                <span className="font-mono text-[11px] text-[#1B4332] font-medium">
                  {modelInfo?.geminiAvailable ? 'Cloud Active' : 'Local Fallback Ready'}
                </span>
              </div>
              <p className="text-[11px] text-[#4E6559] mt-1 leading-relaxed">
                Natively analyzes message text and screenshot evidence, detecting artificial urgency, banking bypass pretexts, and credential demands.
              </p>
            </div>

            {/* Option 2: Self-Hosted / Open-Weight Gemma */}
            <div
              onClick={() => setSelectedProvider('gemma')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedProvider === 'gemma'
                  ? 'border-[#1B4332] bg-[#EBF3EE]'
                  : 'border-[#E4E8E3] bg-[#FAF9F5] hover:bg-[#F4F6F3]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#18221D]">Open-Weight Gemma Endpoint</span>
                <span className="font-mono text-[11px] text-[#6B7280]">Ollama / vLLM / OpenRouter</span>
              </div>
              <p className="text-[11px] text-[#4E6559] mt-1 leading-relaxed">
                Connect your private or self-hosted Gemma 3 / Gemma 2 instance via an OpenAI-compatible API endpoint.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Open-Weight Configuration Fields */}
        {selectedProvider === 'gemma' && (
          <div className="space-y-3 pt-2 border-t border-[#E4E8E3] text-xs">
            <div className="font-semibold text-[#18221D] flex items-center justify-between">
              <span>Gemma Server Endpoint Configuration</span>
              <span className="text-[10px] font-mono text-[#6B7280]">OpenAI compatible</span>
            </div>

            <div className="space-y-1">
              <label className="text-[#4E6559] text-[11px] font-medium">Base URL</label>
              <input
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="http://localhost:11434/v1 or https://api.openrouter.ai/v1"
                className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#E4E8E3] text-[#18221D] placeholder-[#9CA3AF] font-mono text-xs focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#4E6559] text-[11px] font-medium">Model Identifier</label>
              <input
                type="text"
                value={customModelName}
                onChange={(e) => setCustomModelName(e.target.value)}
                placeholder="google/gemma-3-27b-it or gemma2:9b"
                className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#E4E8E3] text-[#18221D] placeholder-[#9CA3AF] font-mono text-xs focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#4E6559] text-[11px] font-medium">API Key (optional for local Ollama/vLLM)</label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#E4E8E3] text-[#18221D] placeholder-[#9CA3AF] font-mono text-xs focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4E8E3]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#4E6559] hover:text-[#18221D] hover:bg-[#F4F6F3] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1B4332] text-white hover:bg-[#133825] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

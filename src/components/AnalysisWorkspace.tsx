import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle, ArrowRight, Image as ImageIcon, ClipboardPaste, Trash2, Check } from 'lucide-react';
import { ProviderConfig } from '../types/veris.js';
import { useToast } from './Toast.js';

interface AnalysisWorkspaceProps {
  messageText: string;
  setMessageText: (text: string) => void;
  selectedImage: { base64: string; mimeType: string; name: string; size: number } | null;
  setSelectedImage: (img: { base64: string; mimeType: string; name: string; size: number } | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  providerConfig: ProviderConfig;
  onOpenSettings: () => void;
  autoFocusScreenshot?: boolean;
  onScreenshotFocused?: () => void;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  messageText,
  setMessageText,
  selectedImage,
  setSelectedImage,
  onAnalyze,
  isLoading,
  errorMessage,
  providerConfig,
  onOpenSettings,
  autoFocusScreenshot,
  onScreenshotFocused,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [copiedPasteFeedback, setCopiedPasteFeedback] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();

  // Handle auto-focusing screenshot zone when triggered from 404 or other actions
  useEffect(() => {
    if (autoFocusScreenshot) {
      setIsHighlighted(true);
      const dropzone = document.getElementById('screenshot-upload-zone');
      if (dropzone) {
        dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const openTimer = setTimeout(() => {
        fileInputRef.current?.click();
        onScreenshotFocused?.();
      }, 300);

      const highlightTimer = setTimeout(() => {
        setIsHighlighted(false);
      }, 2500);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(highlightTimer);
      };
    }
  }, [autoFocusScreenshot, onScreenshotFocused]);

  // Global paste handler to allow pasting screenshot images anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Supported formats are JPG, PNG, and WEBP.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Screenshot exceeds the 8MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImage({
          base64: result,
          mimeType: file.type,
          name: file.name,
          size: file.size,
        });
        toast.success('Screenshot added');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessageText(text);
        setCopiedPasteFeedback(true);
        setTimeout(() => setCopiedPasteFeedback(false), 1500);
      }
    } catch {
      textareaRef.current?.focus();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hasInput = messageText.trim().length > 0 || selectedImage !== null;

  return (
    <div className="space-y-4">
      {/* Primary Input Container */}
      <div className="rounded-2xl border border-[#E4E8E3] bg-white p-5 sm:p-6 shadow-xs space-y-4 transition-all focus-within:border-[#1B4332]/40">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F2EE] text-xs">
          <label htmlFor="message-input" className="font-semibold text-[#18221D]">
            Message or Payment Demand
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClipboardPaste}
              className="flex items-center gap-1 text-[#4E6559] hover:text-[#18221D] px-2 py-1 hover:bg-[#F4F6F3] rounded transition-colors text-xs font-medium"
              title="Paste text from clipboard"
            >
              {copiedPasteFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="text-[#1B4332]">Pasted</span>
                </>
              ) : (
                <>
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste text</span>
                </>
              )}
            </button>

            {messageText && (
              <button
                type="button"
                onClick={() => setMessageText('')}
                className="flex items-center gap-1 text-[#4E6559] hover:text-[#B91C1C] px-2 py-1 hover:bg-[#FEE2E2]/40 rounded transition-colors text-xs font-medium"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          id="message-input"
          ref={textareaRef}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Paste the message, email, or money request here (e.g., 'Please send ₦20,000 immediately, I am at the hospital, my banking app is down...')"
          className="w-full h-36 sm:h-44 bg-transparent text-[#18221D] placeholder-[#9CA3AF] text-sm leading-relaxed resize-y focus:outline-none"
        />

        {/* Word / Char Counter */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F2EE] text-xs text-[#6B7280]">
          <span>
            {messageText.length > 0
              ? `${messageText.length} characters · ${messageText.trim().split(/\s+/).filter(Boolean).length} words`
              : 'Paste text or attach a screenshot below'}
          </span>
          <span className="text-[11px] font-mono text-[#9CA3AF]">In-memory evaluation</span>
        </div>
      </div>

      {/* Screenshot Upload Control */}
      <div
        id="screenshot-upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-2xl border transition-all p-4 ${
          isHighlighted
            ? 'border-[#174D3B] ring-2 ring-[#174D3B]/20 bg-[#EBF3EE]/70 shadow-sm'
            : isDragging
            ? 'border-[#1B4332] bg-[#EBF3EE]'
            : selectedImage
            ? 'border-[#E4E8E3] bg-white shadow-xs'
            : 'border-dashed border-[#D1D5DB] bg-[#FAF9F5] hover:bg-[#F3F5F1]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Upload screenshot"
        />

        {selectedImage ? (
          /* Uploaded Image Preview */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#F4F6F3] border border-[#E4E8E3] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={selectedImage.base64}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#18221D] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{selectedImage.name}</span>
                </div>
                <div className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                  {formatFileSize(selectedImage.size)} · {selectedImage.mimeType.replace('image/', '').toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs text-[#18221D] bg-[#F4F6F3] hover:bg-[#E4E8E3] rounded-lg transition-colors font-medium"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  toast.info('Screenshot removed');
                }}
                className="px-3 py-1.5 text-xs text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          /* Empty State Dropzone */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E8E3] text-[#1B4332] flex items-center justify-center shrink-0 shadow-xs">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#18221D] block sm:inline">
                  Attach screenshot
                </span>
                <span className="text-[#6B7280] block sm:inline sm:ml-2">
                  Drop screenshot here, paste from clipboard (Ctrl+V), or browse.
                </span>
                <span className="block text-[11px] text-[#9CA3AF] mt-0.5 font-mono">
                  JPG, PNG, or WEBP up to 8MB
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 px-3.5 py-1.5 bg-white hover:bg-[#F4F6F3] text-[#18221D] border border-[#D1D5DB] rounded-lg transition-colors font-medium text-xs shadow-xs"
            >
              Browse files
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-rose-900">Analysis could not be completed</div>
            <div className="leading-relaxed text-rose-800">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-[#6B7280]">
          <span>Verification mode: </span>
          <span className="font-medium text-[#18221D]">Evidence grounding</span>
          <span className="text-[#9CA3AF] mx-1.5">·</span>
          <span>Zero records kept</span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!hasInput || isLoading}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            !hasInput || isLoading
              ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
              : 'bg-[#1B4332] hover:bg-[#133825] text-white shadow-sm hover:shadow active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Checking proof...</span>
            </>
          ) : (
            <>
              <span>Check this message</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Loading Progress State */}
      {isLoading && (
        <div className="rounded-2xl border border-[#E4E8E3] bg-white p-5 space-y-2.5 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-xs text-[#18221D] font-medium">
            <div className="w-2 h-2 rounded-full bg-[#1B4332] animate-ping" />
            <span>Evaluating communication patterns and urgency hooks...</span>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed pl-4.5">
            Veris is inspecting the message for synthetic pressure, bank bypass pretexts, and sensitive credential demands.
          </p>
        </div>
      )}
    </div>
  );
};

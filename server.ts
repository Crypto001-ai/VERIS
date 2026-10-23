import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeWithGemma, analyzeWithGemini } from './server/analysisService.js';
import { ModelInfo, ProviderConfig } from './src/types/veris.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const cliPortIdx = process.argv.indexOf('--port');
const cliPort = cliPortIdx !== -1 ? Number(process.argv[cliPortIdx + 1]) : null;
const PORT = cliPort || Number(process.env.DEFAULT_APP_PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON payloads with images up to 10MB
app.use(express.json({ limit: '10mb' }));

// Serve static assets from public directory
app.use(express.static(path.resolve(__dirname, 'public')));

// Handle invalid JSON or oversized body gracefully with JSON error
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error('Request body error:', err.message);
    return res.status(err.status || 400).json({
      success: false,
      error: err.type === 'entity.too.large'
        ? 'Payload exceeds limit. Please upload an image smaller than 8MB.'
        : (err.message || 'Malformed request payload.'),
    });
  }
  next();
});

// Health / Model Info Endpoint
app.get('/api/model-info', (req, res) => {
  const geminiAvailable = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  );
  const customGemmaConfigured = Boolean(process.env.GEMMA_API_BASE_URL);
  const activeGemmaModel = process.env.GEMMA_MODEL_NAME || 'gemini-3.8-flash';
  
  const info: ModelInfo = {
    geminiAvailable,
    geminiModel: 'gemini-3.8-flash',
    gemmaConfigured: true,
    gemmaModel: activeGemmaModel,
    gemmaEndpoint: customGemmaConfigured
      ? process.env.GEMMA_API_BASE_URL
      : (geminiAvailable ? 'Google GenAI Cloud (gemini-3.8-flash)' : 'VERIS Evidence Engine (Local Mode)'),
    multimodalSupport: {
      gemini: true,
      gemma: true, // gemma-4-31b-it supports multimodal vision & text
    },
  };

  res.json({ success: true, info });
});

// Analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { messageText, image, providerConfig, contextQuestion, contextAnswer } = req.body as {
      messageText?: string;
      image?: { base64: string; mimeType: string };
      providerConfig?: ProviderConfig;
      contextQuestion?: string;
      contextAnswer?: string;
    };

    const trimmedText = (messageText || '').trim();

    if (!trimmedText && !image?.base64) {
      return res.status(400).json({
        success: false,
        error: 'Please paste a suspicious message or upload a screenshot to analyze.',
      });
    }

    // Validate image format if provided
    if (image?.base64) {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(image.mimeType)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported image format (${image.mimeType}). Supported formats are JPG, PNG, and WEBP.`,
        });
      }

      // Check payload size estimate (10MB limit)
      const approxBytes = (image.base64.length * 3) / 4;
      if (approxBytes > 8 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'Screenshot exceeds the 8MB limit. Please upload a smaller or compressed image.',
        });
      }
    }

    const providerPreference = providerConfig?.selectedProvider || 'gemma';

    let result;
    if (providerPreference === 'gemini') {
      result = await analyzeWithGemini(trimmedText, image, contextAnswer, contextQuestion);
    } else {
      // Default to Google Gemma open-weight instruction model (gemma-4-31b-it)
      result = await analyzeWithGemma(trimmedText, image, providerConfig, contextAnswer, contextQuestion);
    }

    return res.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred during message analysis.',
    });
  }
});

// API 404 guard: prevent unmatched /api routes from falling through to Vite HTML SPA fallback
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.path} not found.`,
  });
});

// Setup dev Vite server or production static serving
async function setupApp() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VERIS server listening on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start VERIS server:', err);
  process.exit(1);
});

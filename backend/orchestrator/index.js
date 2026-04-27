import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Agent service URLs (Cloud Run endpoints, localhost for dev)
const CART_PARSER_URL = process.env.CART_PARSER_URL || 'http://localhost:8081';
const BEHAVIOR_URL = process.env.BEHAVIOR_URL || 'http://localhost:8082';
const CONTEXT_URL = process.env.CONTEXT_URL || 'http://localhost:8083';
const OPTIMIZATION_URL = process.env.OPTIMIZATION_URL || 'http://localhost:8084';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'orchestrator' });
});

/**
 * POST /api/analyze
 * Main orchestration endpoint — fans out to all agents, collects results.
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const { cartText, userId, userProfile } = req.body;

    // Fan out to Cart Parser and Behavior Agent in parallel
    const [cartResult, behaviorResult] = await Promise.all([
      fetchAgent(`${CART_PARSER_URL}/parse`, { text: cartText }),
      fetchAgent(`${BEHAVIOR_URL}/analyze`, { userId }),
    ]);

    // Context Engine needs user profile
    const contextResult = await fetchAgent(`${CONTEXT_URL}/context`, { userProfile });

    // Optimization Agent needs everything
    const optimizationResult = await fetchAgent(`${OPTIMIZATION_URL}/optimize`, {
      cartItems: cartResult?.items || [],
      behaviorProfile: behaviorResult?.profile || {},
      context: contextResult?.signals || {},
      neverSuggest: userProfile?.neverSuggest || [],
    });

    res.json({
      cart: cartResult,
      behavior: behaviorResult,
      context: contextResult,
      optimization: optimizationResult,
    });
  } catch (err) {
    console.error('Orchestration error:', err);
    res.status(500).json({ error: 'Analysis failed', details: err.message });
  }
});

/**
 * POST /api/ocr
 * Receipt image OCR via Cloud Vision API.
 */
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Try Cloud Vision API
    let extractedText = '';
    try {
      const { ImageAnnotatorClient } = await import('@google-cloud/vision');
      const client = new ImageAnnotatorClient();
      const [result] = await client.textDetection({ image: { content: req.file.buffer } });
      const detections = result.textAnnotations;
      extractedText = detections?.[0]?.description || '';
    } catch (visionErr) {
      console.warn('Cloud Vision unavailable, using demo text:', visionErr.message);
      extractedText = 'Maggi, chips, biscuits, white bread, butter, cola, eggs, banana';
    }

    // Parse extracted text into items
    const items = extractedText
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 50);

    res.json({ text: extractedText, items });
  } catch (err) {
    console.error('OCR error:', err);
    res.status(500).json({ error: 'OCR failed' });
  }
});

async function fetchAgent(url, body) {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`Agent responded ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.warn(`Agent call failed (${url}):`, err.message);
    return null;
  }
}

app.listen(PORT, () => {
  console.log(`Orchestrator listening on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8082;

// Firebase Admin (optional — gracefully degrades without credentials)
let db = null;
try {
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp();
  } else {
    initializeApp({ projectId: process.env.GCP_PROJECT || 'demo-project' });
  }
  db = getFirestore();
} catch (e) {
  console.warn('Firestore unavailable, using mock data:', e.message);
}

// Mock purchase history for demo / first-time users
const MOCK_HISTORY = [
  { items: ['maggi', 'chips', 'bread', 'butter', 'cola', 'eggs'] },
  { items: ['biscuits', 'chips', 'white bread', 'cola', 'banana'] },
  { items: ['maggi', 'lays', 'bread', 'butter', 'juice', 'cookies'] },
  { items: ['instant noodles', 'chips', 'bread', 'cola', 'jam'] },
  { items: ['maggi', 'biscuits', 'bread', 'butter', 'cola', 'egg'] },
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'behavior-agent' }));

app.post('/analyze', async (req, res) => {
  const { userId } = req.body;
  let history = MOCK_HISTORY;

  // Try reading real history from Firestore
  if (db && userId && userId !== 'demo-user') {
    try {
      const snap = await db.collection('users').doc(userId)
        .collection('purchases')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
      if (!snap.empty) {
        history = snap.docs.map(d => d.data());
      }
    } catch (e) {
      console.warn('Firestore read failed, using mock:', e.message);
    }
  }

  const allItems = history.flatMap(h =>
    (h.items || []).map(i => (typeof i === 'string' ? i : i.name || '').toLowerCase())
  );

  const freq = {};
  allItems.forEach(item => { freq[item] = (freq[item] || 0) + 1; });

  const junkPattern = /chips|maggi|noodle|biscuit|cookie|cola|pepsi|fanta|sprite|chocolate|cake|ice.cream|samosa|bhujia|namkeen|jam|ketchup|mayo/;
  const proteinPattern = /egg|chicken|fish|dal|paneer|tofu|soy|peanut|rajma|chole|chickpea|whey|protein|sprout|mushroom/;

  const junkItems = allItems.filter(i => junkPattern.test(i));
  const proteinItems = allItems.filter(i => proteinPattern.test(i));

  const snackDependencyRatio = Math.round((junkItems.length / (allItems.length || 1)) * 100);
  const proteinDeficitFreq = Math.round(((history.length - proteinItems.length) / (history.length || 1)) * 100);

  // Cooking frequency heuristic
  const rawIngredients = /onion|tomato|potato|garlic|ginger|oil|atta|rice|dal|paneer|chicken|fish|spice|salt|turmeric/;
  const rawCount = allItems.filter(i => rawIngredients.test(i)).length;
  const cookingScore = rawCount / (allItems.length || 1);
  let cookingFrequency = 'rarely';
  if (cookingScore > 0.4) cookingFrequency = 'daily';
  else if (cookingScore > 0.2) cookingFrequency = 'a few times a week';

  const sortedItems = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const topRepeated = sortedItems.slice(0, 5).map(([name, count]) => ({ name, count }));

  const traits = [];
  if (snackDependencyRatio > 40) traits.push('snack-heavy');
  if (proteinDeficitFreq > 60) traits.push('low-protein buyer');
  if (cookingFrequency === 'rarely') traits.push('quick-meal dependent');
  if (sortedItems.length > 0 && sortedItems[0][1] >= 3) traits.push('habitual buyer');

  res.json({
    profile: {
      snackDependencyRatio,
      proteinDeficitFreq,
      cookingFrequency,
      topRepeated,
      traits,
      profileSummary: traits.length > 0 ? traits.join(', ') : 'balanced shopper',
      totalAnalyzed: allItems.length,
    },
  });
});

app.listen(PORT, () => console.log(`Behavior Agent on port ${PORT}`));

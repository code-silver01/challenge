import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8084;

const SWAP_MAP = {
  'chips': { to: 'roasted nuts', reason: 'Same crunch, 10x more protein', proteinDelta: 18 },
  'lays': { to: 'roasted nuts', reason: 'Same crunch, 10x more protein', proteinDelta: 18 },
  'kurkure': { to: 'roasted nuts', reason: 'Same snack vibe, way more protein', proteinDelta: 14 },
  'maggi': { to: 'oats', reason: 'Same 5-min prep, way more fiber & protein', proteinDelta: 9 },
  'instant noodles': { to: 'oats', reason: 'Same quick meal, much better macros', proteinDelta: 9 },
  'noodles': { to: 'oats', reason: 'Swap processed noodles for whole grain oats', proteinDelta: 9 },
  'white bread': { to: 'oats', reason: 'Lower GI, more protein, same effort', proteinDelta: 8 },
  'bread': { to: 'oats', reason: 'Lower GI, more protein, same effort', proteinDelta: 8 },
  'butter': { to: 'peanut butter', reason: 'Spread swap — adds 14g protein per serve', proteinDelta: 14 },
  'cola': { to: null, reason: 'Zero nutrition, save ₹40/week', proteinDelta: 0, remove: true },
  'pepsi': { to: null, reason: 'Zero nutrition, save ₹40/week', proteinDelta: 0, remove: true },
  'coca cola': { to: null, reason: 'Zero nutrition, save ₹40/week', proteinDelta: 0, remove: true },
  'sprite': { to: null, reason: 'Zero nutrition, save ₹35/week', proteinDelta: 0, remove: true },
  'fanta': { to: null, reason: 'Zero nutrition, save ₹35/week', proteinDelta: 0, remove: true },
  'biscuits': { to: 'dates', reason: 'Natural sweetness, fiber-rich, no refined sugar', proteinDelta: 2 },
  'cookies': { to: 'dates', reason: 'Swap refined sugar for natural energy', proteinDelta: 2 },
  'jam': { to: 'honey', reason: 'Natural sweetener, no preservatives', proteinDelta: 0 },
  'mayo': { to: 'curd', reason: 'Probiotic, much less fat, same creamy texture', proteinDelta: 10 },
  'mayonnaise': { to: 'curd', reason: 'Probiotic, much less fat, same creamy texture', proteinDelta: 10 },
  'ice cream': { to: 'yogurt', reason: 'Probiotics + protein instead of sugar', proteinDelta: 6 },
  'chocolate': { to: 'dates', reason: 'Natural sweetness with fiber', proteinDelta: 2 },
  'maida': { to: 'atta', reason: 'Whole wheat > refined flour, more fiber', proteinDelta: 2 },
  'samosa': { to: 'sprouts', reason: 'Protein-rich snack, no deep frying', proteinDelta: 9 },
  'juice': { to: 'coconut water', reason: 'No added sugar, natural electrolytes', proteinDelta: 0 },
  'sugar': { to: 'honey', reason: 'Natural sweetener with micronutrients', proteinDelta: 0 },
};

const PROTEIN_ADDS_VEG = [
  { name: 'paneer', reason: 'High-quality vegetarian protein', proteinDelta: 18 },
  { name: 'dal', reason: 'Everyday protein staple, very cheap', proteinDelta: 24 },
  { name: 'soya chunks', reason: 'Cheapest protein source per gram', proteinDelta: 52 },
  { name: 'peanut butter', reason: 'Spread it on anything for +14g protein', proteinDelta: 14 },
  { name: 'sprouts', reason: 'Ready-to-eat protein, zero cooking', proteinDelta: 14 },
  { name: 'curd', reason: 'Protein + probiotics, eat with anything', proteinDelta: 11 },
  { name: 'tofu', reason: 'Versatile protein, works in any curry', proteinDelta: 8 },
  { name: 'chickpeas', reason: 'Filling, protein-rich, pantry staple', proteinDelta: 19 },
];

const PROTEIN_ADDS_NONVEG = [
  { name: 'eggs', reason: 'Cheapest complete protein, super versatile', proteinDelta: 13 },
  { name: 'chicken breast', reason: 'Lean protein powerhouse', proteinDelta: 31 },
  { name: 'fish', reason: 'Omega-3 + protein combo', proteinDelta: 22 },
  ...PROTEIN_ADDS_VEG,
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'optimization' }));

app.post('/optimize', (req, res) => {
  const { cartItems = [], behaviorProfile = {}, context = {}, neverSuggest = [] } = req.body;
  const blocked = new Set((neverSuggest || []).map(s => s.toLowerCase()));
  const cartNames = new Set(cartItems.map(i => (i.name || '').toLowerCase()));
  const suggestions = [];

  // 1. REPLACE / REMOVE junk
  for (const item of cartItems) {
    if (suggestions.length >= 5) break;
    const key = (item.name || '').toLowerCase();
    const swap = SWAP_MAP[key];
    if (!swap) continue;
    if (swap.remove) {
      if (!blocked.has(key)) {
        suggestions.push({ type: 'REMOVE', item: item.name, replacement: null, reason: swap.reason, proteinDelta: swap.proteinDelta, effortChange: 0 });
      }
    } else if (swap.to && !blocked.has(swap.to.toLowerCase()) && !cartNames.has(swap.to.toLowerCase())) {
      suggestions.push({ type: 'REPLACE', item: item.name, replacement: swap.to, reason: swap.reason, proteinDelta: swap.proteinDelta, effortChange: 0 });
    }
  }

  // 2. ADD protein if deficit
  const hasProteinDeficit = (behaviorProfile.proteinDeficitFreq || 0) > 40 ||
    cartItems.filter(i => i.category === 'Protein').length < 2;

  if (hasProteinDeficit && suggestions.length < 5) {
    const pool = (context.dietType === 'veg' || context.dietType === 'vegan') ? PROTEIN_ADDS_VEG : PROTEIN_ADDS_NONVEG;
    for (const add of pool) {
      if (suggestions.length >= 5) break;
      if (blocked.has(add.name.toLowerCase()) || cartNames.has(add.name.toLowerCase())) continue;
      if (context.cookingWillingness === 'rarely') {
        if (!/peanut butter|sprouts|curd|eggs|dates|nuts/i.test(add.name)) continue;
      }
      suggestions.push({ type: 'ADD', item: add.name, replacement: null, reason: add.reason, proteinDelta: add.proteinDelta, effortChange: 0 });
    }
  }

  // 3. Seasonal produce
  if (suggestions.length < 5 && context.seasonalProduce) {
    const freshInCart = cartItems.filter(i => i.category === 'Fresh Produce').length;
    if (freshInCart < 2) {
      for (const sp of context.seasonalProduce) {
        if (suggestions.length >= 5) break;
        if (blocked.has(sp.toLowerCase()) || cartNames.has(sp.toLowerCase())) continue;
        suggestions.push({ type: 'ADD', item: sp, replacement: null, reason: 'In season now — fresh, cheap, and nutritious', proteinDelta: 1, effortChange: 0 });
        break;
      }
    }
  }

  // Compute impact
  const total = cartItems.length || 1;
  const junkBefore = cartItems.filter(i => i.category === 'Processed/Junk' || i.category === 'Beverages').length;
  const proteinBefore = cartItems.filter(i => i.category === 'Protein').length;
  const freshBefore = cartItems.filter(i => i.category === 'Fresh Produce').length;
  let proteinAfter = proteinBefore, junkAfter = junkBefore, freshAfter = freshBefore, totalAfter = total;
  for (const s of suggestions) {
    if (s.type === 'REMOVE') { junkAfter--; totalAfter--; }
    if (s.type === 'REPLACE') { junkAfter--; proteinAfter++; }
    if (s.type === 'ADD') { totalAfter++; if (s.proteinDelta > 5) proteinAfter++; else freshAfter++; }
  }

  res.json({
    suggestions: suggestions.slice(0, 5),
    impact: {
      before: { proteinPercent: Math.round((proteinBefore / total) * 100), junkPercent: Math.round((junkBefore / total) * 100), freshPercent: Math.round((freshBefore / total) * 100) },
      after: { proteinPercent: Math.round((proteinAfter / (totalAfter || 1)) * 100), junkPercent: Math.round((junkAfter / (totalAfter || 1)) * 100), freshPercent: Math.round((freshAfter / (totalAfter || 1)) * 100) },
      totalProteinDelta: suggestions.reduce((s, x) => s + (x.proteinDelta || 0), 0),
      effortChange: 'unchanged',
    },
  });
});

app.listen(PORT, () => console.log(`Optimization Agent on port ${PORT}`));

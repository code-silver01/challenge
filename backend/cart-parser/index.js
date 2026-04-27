import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;

// Load bundled grocery DB
let groceryDB = [];
try {
  groceryDB = JSON.parse(readFileSync(join(__dirname, 'groceryDB.json'), 'utf-8'));
} catch { console.warn('groceryDB.json not found, using empty DB'); }

const dbIndex = {};
groceryDB.forEach(item => { dbIndex[item.name.toLowerCase()] = item; });

function fuzzyMatch(input) {
  const lower = input.toLowerCase().trim();
  if (dbIndex[lower]) return dbIndex[lower];
  const keys = Object.keys(dbIndex);
  const match = keys.find(k => lower.includes(k) || k.includes(lower));
  return match ? dbIndex[match] : null;
}

function categorize(name) {
  const t = name.toLowerCase();
  if (/snack|chip|biscuit|cookie|candy|chocolate|instant|noodle|maggi|samosa|bhujia|namkeen|jam|ketchup|mayo|cake|ice.cream/.test(t)) return 'Processed/Junk';
  if (/chicken|fish|egg|meat|mutton|prawn|dal|lentil|bean|paneer|tofu|soy|peanut|whey|protein/.test(t)) return 'Protein';
  if (/milk|curd|yogurt|cheese|butter|cream|dairy/.test(t)) return 'Dairy';
  if (/fruit|vegetable|fresh|tomato|onion|potato|spinach|carrot|banana|apple|orange|mango|broccoli/.test(t)) return 'Fresh Produce';
  if (/rice|bread|atta|flour|oat|pasta|cereal|wheat|roti/.test(t)) return 'Carbs';
  if (/oil|ghee|nut|seed|cashew|walnut|almond/.test(t)) return 'Fats';
  if (/cola|soda|juice|tea|coffee|water|beverage|drink|sprite|fanta|pepsi/.test(t)) return 'Beverages';
  return 'Other';
}

async function lookupOpenFoodFacts(itemName) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(itemName)}&search_simple=1&action=process&json=1&page_size=1`
    );
    const data = await res.json();
    if (data.products?.length > 0) {
      const n = data.products[0].nutriments || {};
      return {
        name: itemName,
        category: categorize(itemName),
        protein: Math.round(n.proteins_100g || 0),
        carbs: Math.round(n.carbohydrates_100g || 0),
        fat: Math.round(n.fat_100g || 0),
        calories: Math.round(n['energy-kcal_100g'] || 0),
        unit: '100g', source: 'openfoodfacts',
      };
    }
  } catch { /* fallback */ }
  return null;
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cart-parser' }));

app.post('/parse', async (req, res) => {
  const { text } = req.body;
  const lines = (text || '').split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);

  const items = await Promise.all(lines.map(async (name) => {
    const local = fuzzyMatch(name);
    if (local) return { ...local, name, source: 'local' };
    const off = await lookupOpenFoodFacts(name);
    if (off) return off;
    return { name, category: categorize(name), protein: 0, carbs: 0, fat: 0, calories: 0, unit: '100g', source: 'unknown' };
  }));

  const total = items.length || 1;
  const stats = {
    totalItems: items.length,
    junkPercent: Math.round((items.filter(i => i.category === 'Processed/Junk' || i.category === 'Beverages').length / total) * 100),
    proteinPercent: Math.round((items.filter(i => i.category === 'Protein').length / total) * 100),
    freshPercent: Math.round((items.filter(i => i.category === 'Fresh Produce').length / total) * 100),
    totalProteinG: items.reduce((s, i) => s + i.protein, 0),
    totalCarbsG: items.reduce((s, i) => s + i.carbs, 0),
    totalFatG: items.reduce((s, i) => s + i.fat, 0),
  };

  res.json({ items, stats });
});

app.listen(PORT, () => console.log(`Cart Parser on port ${PORT}`));

/**
 * Local Cart Parser Agent — classifies items using bundled dataset + Open Food Facts API.
 */
import groceryDB from '../data/groceryDB.json';

const dbIndex = {};
groceryDB.forEach(item => {
  dbIndex[item.name.toLowerCase()] = item;
});

function fuzzyMatch(input) {
  const lower = input.toLowerCase().trim();
  if (dbIndex[lower]) return dbIndex[lower];
  // partial match
  const keys = Object.keys(dbIndex);
  const match = keys.find(k => lower.includes(k) || k.includes(lower));
  return match ? dbIndex[match] : null;
}

async function lookupOpenFoodFacts(itemName) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(itemName)}&search_simple=1&action=process&json=1&page_size=1`
    );
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      const p = data.products[0];
      const n = p.nutriments || {};
      return {
        name: itemName,
        category: categorize(p.categories_tags || [], itemName),
        protein: Math.round(n.proteins_100g || 0),
        carbs: Math.round(n.carbohydrates_100g || 0),
        fat: Math.round(n.fat_100g || 0),
        calories: Math.round(n['energy-kcal_100g'] || 0),
        unit: '100g',
      };
    }
  } catch { /* fallback below */ }
  return null;
}

function categorize(tags, name) {
  const t = (tags || []).join(' ').toLowerCase() + ' ' + name.toLowerCase();
  if (/snack|chip|biscuit|cookie|candy|chocolate|instant|noodle|samosa|bhujia|namkeen|jam|ketchup|mayo|cake|ice.cream/.test(t)) return 'Processed/Junk';
  if (/chicken|fish|egg|meat|mutton|prawn|shrimp|dal|lentil|bean|paneer|tofu|soy|peanut|whey|protein/.test(t)) return 'Protein';
  if (/milk|curd|yogurt|cheese|butter|cream|dairy/.test(t)) return 'Dairy';
  if (/fruit|vegetable|fresh|tomato|onion|potato|spinach|carrot|banana|apple|orange|mango|broccoli/.test(t)) return 'Fresh Produce';
  if (/rice|bread|atta|flour|oat|pasta|cereal|wheat|roti/.test(t)) return 'Carbs';
  if (/oil|ghee|nut|seed|cashew|walnut|almond/.test(t)) return 'Fats';
  if (/cola|soda|juice|tea|coffee|water|beverage|drink|sprite|fanta|pepsi/.test(t)) return 'Beverages';
  return 'Other';
}

export async function parseCart(rawText) {
  const lines = rawText
    .split(/[,\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  const parsed = await Promise.all(
    lines.map(async (itemName) => {
      const local = fuzzyMatch(itemName);
      if (local) return { ...local, name: itemName, source: 'local' };
      const off = await lookupOpenFoodFacts(itemName);
      if (off) return { ...off, source: 'openfoodfacts' };
      return {
        name: itemName,
        category: 'Other',
        protein: 0, carbs: 0, fat: 0, calories: 0,
        unit: '100g', source: 'unknown',
      };
    })
  );

  return parsed;
}

export function computeCartStats(items) {
  const total = items.length || 1;
  const junkCount = items.filter(i => i.category === 'Processed/Junk' || i.category === 'Beverages').length;
  const proteinCount = items.filter(i => i.category === 'Protein').length;
  const freshCount = items.filter(i => i.category === 'Fresh Produce').length;
  const totalProteinG = items.reduce((s, i) => s + (i.protein || 0), 0);
  const totalCarbsG = items.reduce((s, i) => s + (i.carbs || 0), 0);
  const totalFatG = items.reduce((s, i) => s + (i.fat || 0), 0);
  const totalCals = items.reduce((s, i) => s + (i.calories || 0), 0);

  return {
    totalItems: total,
    junkPercent: Math.round((junkCount / total) * 100),
    proteinPercent: Math.round((proteinCount / total) * 100),
    freshPercent: Math.round((freshCount / total) * 100),
    totalProteinG,
    totalCarbsG,
    totalFatG,
    totalCalories: totalCals,
    categoryBreakdown: {
      'Protein': proteinCount,
      'Carbs': items.filter(i => i.category === 'Carbs').length,
      'Fats': items.filter(i => i.category === 'Fats').length,
      'Processed/Junk': items.filter(i => i.category === 'Processed/Junk').length,
      'Fresh Produce': freshCount,
      'Dairy': items.filter(i => i.category === 'Dairy').length,
      'Beverages': items.filter(i => i.category === 'Beverages').length,
      'Other': items.filter(i => i.category === 'Other').length,
    },
  };
}

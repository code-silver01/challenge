/**
 * Behavior Analysis Agent — analyzes purchase history patterns.
 */

const MOCK_HISTORY = [
  { items: ['maggi','chips','bread','butter','cola','eggs'], createdAt: { seconds: Date.now()/1000 - 86400*2 } },
  { items: ['biscuits','chips','white bread','cola','banana'], createdAt: { seconds: Date.now()/1000 - 86400*5 } },
  { items: ['maggi','lays','bread','butter','juice','cookies'], createdAt: { seconds: Date.now()/1000 - 86400*9 } },
  { items: ['instant noodles','chips','bread','cola','jam'], createdAt: { seconds: Date.now()/1000 - 86400*14 } },
  { items: ['maggi','biscuits','bread','butter','cola','egg'], createdAt: { seconds: Date.now()/1000 - 86400*20 } },
];

export function analyzeBehavior(purchaseHistory) {
  const history = (purchaseHistory && purchaseHistory.length > 0)
    ? purchaseHistory
    : MOCK_HISTORY;

  const allItems = history.flatMap(h => (h.items || []).map(i => (typeof i === 'string' ? i : i.name || '').toLowerCase()));
  const freq = {};
  allItems.forEach(item => { freq[item] = (freq[item] || 0) + 1; });

  const totalPurchases = history.length || 1;
  const junkKeywords = /chips|maggi|noodle|biscuit|cookie|cola|pepsi|fanta|sprite|chocolate|cake|ice.cream|samosa|bhujia|namkeen|jam|ketchup|mayo/;
  const proteinKeywords = /egg|chicken|fish|dal|paneer|tofu|soy|peanut|rajma|chole|chickpea|whey|protein|sprout|mushroom/;

  const junkItems = allItems.filter(i => junkKeywords.test(i));
  const proteinItems = allItems.filter(i => proteinKeywords.test(i));

  const snackDependencyRatio = Math.round((junkItems.length / (allItems.length || 1)) * 100);
  const proteinDeficitFreq = Math.round(((totalPurchases - proteinItems.length) / totalPurchases) * 100);

  // Find most repeated items
  const sortedItems = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const topRepeated = sortedItems.slice(0, 5).map(([name, count]) => ({ name, count }));

  // Detect cooking frequency heuristic
  const rawIngredients = /onion|tomato|potato|garlic|ginger|oil|atta|rice|dal|paneer|chicken|fish|spice|salt|turmeric/;
  const rawCount = allItems.filter(i => rawIngredients.test(i)).length;
  const cookingScore = rawCount / (allItems.length || 1);
  let cookingFrequency = 'rarely';
  if (cookingScore > 0.4) cookingFrequency = 'daily';
  else if (cookingScore > 0.2) cookingFrequency = 'a few times a week';

  const traits = [];
  if (snackDependencyRatio > 40) traits.push('snack-heavy');
  if (proteinDeficitFreq > 60) traits.push('low-protein buyer');
  if (cookingFrequency === 'rarely') traits.push('quick-meal dependent');
  if (sortedItems.length > 0 && sortedItems[0][1] >= 3) traits.push('habitual buyer');

  const profileSummary = traits.length > 0
    ? traits.join(', ')
    : 'balanced shopper';

  return {
    snackDependencyRatio,
    proteinDeficitFreq,
    cookingFrequency,
    topRepeated,
    traits,
    profileSummary,
    totalAnalyzed: allItems.length,
  };
}

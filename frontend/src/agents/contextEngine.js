/**
 * Context Engine Agent — injects live context signals.
 */

export function getContextSignals(userProfile = {}) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const hour = now.getHours();
  const month = now.getMonth(); // 0=Jan

  const isWeekday = day >= 1 && day <= 5;
  const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][day];
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  // Season (Indian context)
  let season = 'winter';
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 9) season = 'monsoon';
  else if (month >= 10 && month <= 11) season = 'autumn';

  const seasonalProduce = {
    summer: ['mango', 'watermelon', 'cucumber', 'coconut water', 'lemon'],
    monsoon: ['corn', 'pomegranate', 'ginger', 'spinach'],
    winter: ['carrot', 'beetroot', 'sweet potato', 'guava', 'orange'],
    spring: ['tomato', 'capsicum', 'mushroom', 'papaya'],
    autumn: ['apple', 'grapes', 'broccoli', 'dates'],
  };

  const lifestyle = userProfile.lifestyle || 'working professional';
  const cookingWillingness = userProfile.cookingFrequency || 'medium';
  const dietType = userProfile.dietType || 'non-veg';
  const goal = userProfile.goal || 'eat healthier';

  // Build contextual insight
  const insights = [];
  if (isWeekday) {
    insights.push(`It's ${dayName} — a weekday. You're likely busy.`);
    if (cookingWillingness === 'rarely') {
      insights.push('Low cooking willingness means we should suggest ready-to-eat protein.');
    }
  } else {
    insights.push(`It's ${dayName} — weekend! Great time to cook something fresh.`);
  }
  insights.push(`${season.charAt(0).toUpperCase() + season.slice(1)} season — ${seasonalProduce[season].join(', ')} are at their best.`);

  return {
    dayName,
    isWeekday,
    timeOfDay,
    season,
    seasonalProduce: seasonalProduce[season],
    lifestyle,
    cookingWillingness,
    dietType,
    goal,
    insights,
  };
}

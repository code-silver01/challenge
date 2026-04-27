import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8083;

const SEASONAL_PRODUCE = {
  summer: ['mango', 'watermelon', 'cucumber', 'coconut water', 'lemon'],
  monsoon: ['corn', 'pomegranate', 'ginger', 'spinach'],
  winter: ['carrot', 'beetroot', 'sweet potato', 'guava', 'orange'],
  spring: ['tomato', 'capsicum', 'mushroom', 'papaya'],
  autumn: ['apple', 'grapes', 'broccoli', 'dates'],
};

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'context-engine' }));

app.post('/context', (req, res) => {
  const { userProfile = {} } = req.body;

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const month = now.getMonth();

  const isWeekday = day >= 1 && day <= 5;
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  let season = 'winter';
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 9) season = 'monsoon';
  else if (month >= 10 && month <= 11) season = 'autumn';

  const lifestyle = userProfile.lifestyle || 'working professional';
  const cookingWillingness = userProfile.cookingFrequency || 'medium';
  const dietType = userProfile.dietType || 'non-veg';
  const goal = userProfile.goal || 'eat healthier';

  const insights = [];
  if (isWeekday) {
    insights.push(`It's ${dayName} — a weekday. You're likely busy.`);
    if (cookingWillingness === 'rarely') {
      insights.push('Low cooking willingness means we should suggest ready-to-eat protein.');
    }
  } else {
    insights.push(`It's ${dayName} — weekend! Great time to cook something fresh.`);
  }
  insights.push(
    `${season.charAt(0).toUpperCase() + season.slice(1)} season — ${SEASONAL_PRODUCE[season].join(', ')} are at their best.`
  );

  res.json({
    signals: {
      dayName,
      isWeekday,
      timeOfDay,
      season,
      seasonalProduce: SEASONAL_PRODUCE[season],
      lifestyle,
      cookingWillingness,
      dietType,
      goal,
      insights,
    },
  });
});

app.listen(PORT, () => console.log(`Context Engine on port ${PORT}`));

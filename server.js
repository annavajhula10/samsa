const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { nanoid } = require('nanoid');
const { readJson, writeJson } = require('./lib/datastore');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = path.join(__dirname, 'data');
const MARKETS_PATH = path.join(DATA_DIR, 'markets.json');
const PREDICTIONS_PATH = path.join(DATA_DIR, 'predictions.json');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve the frontend bundle from /Samsa
app.use(express.static(path.join(__dirname, 'Samsa')));

// Root route to load the app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Samsa', 'index.html'));
});

function recomputeMarketStats(market) {
  const totalStake = market.outcomes.reduce((sum, o) => sum + (o.total_stake || 0), 0);
  market.total_volume = totalStake;
  if (totalStake > 0) {
    market.outcomes.forEach((o) => {
      o.probability = Math.round(((o.total_stake || 0) / totalStake) * 100);
    });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'samsa-api' });
});

app.get('/api/markets', async (req, res) => {
  const markets = await readJson(MARKETS_PATH);
  res.json(markets);
});

app.get('/api/markets/:id', async (req, res) => {
  const markets = await readJson(MARKETS_PATH);
  const market = markets.find((m) => m.id === req.params.id);
  if (!market) return res.status(404).json({ error: 'Market not found' });
  res.json(market);
});

app.post('/api/markets', async (req, res) => {
  const {
    title,
    description,
    category,
    outcomes = [],
    image_url = '',
    search_keywords = '',
    close_date = null,
    resolution_date = null
  } = req.body;

  if (!title || !description || !category || !Array.isArray(outcomes) || outcomes.length < 2) {
    return res.status(400).json({ error: 'Invalid market payload' });
  }

  const markets = await readJson(MARKETS_PATH);

  const normalizedOutcomes = outcomes.map((o) => ({
    id: o.id || nanoid(8),
    title: o.title,
    probability: typeof o.probability === 'number' ? o.probability : Math.round(100 / outcomes.length),
    total_stake: typeof o.total_stake === 'number' ? o.total_stake : 0
  }));

  const market = {
    id: nanoid(12),
    title,
    description,
    category,
    status: 'active',
    close_date,
    resolution_date,
    outcomes: normalizedOutcomes,
    total_volume: 0,
    image_url,
    winning_outcome_id: null,
    search_keywords
  };

  recomputeMarketStats(market);
  markets.push(market);
  await writeJson(MARKETS_PATH, markets);
  res.status(201).json(market);
});

app.get('/api/predictions', async (req, res) => {
  const predictions = await readJson(PREDICTIONS_PATH);
  const { market_id } = req.query;
  if (market_id) {
    return res.json(predictions.filter((p) => p.market_id === market_id));
  }
  res.json(predictions);
});

app.post('/api/predictions', async (req, res) => {
  const {
    market_id,
    outcome_id,
    stake_amount,
    odds_at_prediction,
    user_id = null
  } = req.body;

  if (!market_id || !outcome_id || typeof stake_amount !== 'number' || typeof odds_at_prediction !== 'number') {
    return res.status(400).json({ error: 'Invalid prediction payload' });
  }

  const markets = await readJson(MARKETS_PATH);
  const predictions = await readJson(PREDICTIONS_PATH);

  const market = markets.find((m) => m.id === market_id);
  if (!market) return res.status(404).json({ error: 'Market not found' });

  if (market.status !== 'active') return res.status(400).json({ error: 'Market is not active' });

  const outcome = market.outcomes.find((o) => o.id === outcome_id);
  if (!outcome) return res.status(404).json({ error: 'Outcome not found' });

  const potential_return = Number((stake_amount * (100 / Math.max(odds_at_prediction, 1))).toFixed(2));

  const prediction = {
    id: nanoid(12),
    market_id,
    outcome_id,
    stake_amount,
    odds_at_prediction,
    potential_return,
    status: 'active',
    actual_return: 0,
    user_id,
    created_at: new Date().toISOString()
  };

  predictions.push(prediction);

  outcome.total_stake = (outcome.total_stake || 0) + stake_amount;
  recomputeMarketStats(market);

  await writeJson(PREDICTIONS_PATH, predictions);
  await writeJson(MARKETS_PATH, markets);

  res.status(201).json(prediction);
});

app.post('/api/markets/:id/resolve', async (req, res) => {
  const { winning_outcome_id } = req.body;
  const markets = await readJson(MARKETS_PATH);
  const predictions = await readJson(PREDICTIONS_PATH);

  const market = markets.find((m) => m.id === req.params.id);
  if (!market) return res.status(404).json({ error: 'Market not found' });

  const winOutcome = market.outcomes.find((o) => o.id === winning_outcome_id);
  if (!winOutcome) return res.status(400).json({ error: 'Invalid winning_outcome_id' });

  market.status = 'resolved';
  market.winning_outcome_id = winning_outcome_id;
  market.resolution_date = new Date().toISOString();

  const updated = predictions.map((p) => {
    if (p.market_id !== market.id) return p;
    const won = p.outcome_id === winning_outcome_id;
    return {
      ...p,
      status: won ? 'won' : 'lost',
      actual_return: won ? p.potential_return : 0
    };
  });

  await writeJson(PREDICTIONS_PATH, updated);
  await writeJson(MARKETS_PATH, markets);

  res.json({ ok: true, market });
});

app.listen(PORT, () => {
  console.log(`Samsa API listening on http://localhost:${PORT}`);
});
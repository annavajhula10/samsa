// ========================================
// SAMSA - GLOBAL STATE
// Shared state variables used across modules
// ========================================

// Sample Markets Data
const markets = [
  {
    id: 1,
    title: 'Will Bitcoin reach $100,000 by end of 2025?',
    description: 'Predict whether Bitcoin will hit the $100k milestone before December 31, 2025',
    category: 'crypto',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
    closeDate: 'Dec 31, 2025',
    outcomes: [
      { id: 1, title: 'Yes', probability: 65, stake: 15000, color: 'green' },
      { id: 2, title: 'No', probability: 35, stake: 8000, color: 'red' }
    ],
    volume: 23000, volume24h: 3200, traders: 1247,
    news: [
      { title: 'Bitcoin ETF sees record inflows', source: 'CoinDesk', time: '2h ago' },
      { title: 'Institutional adoption accelerates', source: 'Bloomberg', time: '5h ago' },
      { title: 'Analysts predict bull run continuation', source: 'CryptoNews', time: '1d ago' }
    ]
  },
  {
    id: 2,
    title: 'Who will win the 2025 NBA Championship?',
    description: 'Predict the winner of the 2025 NBA Finals',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    closeDate: 'Jun 1, 2025',
    outcomes: [
      { id: 1, title: 'LA Lakers', probability: 30, stake: 12000, color: 'purple' },
      { id: 2, title: 'Boston Celtics', probability: 25, stake: 10000, color: 'green' },
      { id: 3, title: 'Golden State Warriors', probability: 20, stake: 8000, color: 'blue' },
      { id: 4, title: 'Other Team', probability: 25, stake: 10000, color: 'gray' }
    ],
    volume: 40000, volume24h: 5600, traders: 2134,
    news: [
      { title: 'Lakers strengthen roster with key trade', source: 'ESPN', time: '1h ago' },
      { title: 'Celtics maintain top seed in East', source: 'NBA.com', time: '4h ago' },
      { title: 'Warriors injury update affects odds', source: 'The Athletic', time: '8h ago' }
    ]
  },
  {
    id: 3,
    title: 'Will AI surpass human performance in coding by 2026?',
    description: 'Will AI models achieve superhuman performance on standard coding benchmarks?',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    closeDate: 'Jan 1, 2026',
    outcomes: [
      { id: 1, title: 'Yes', probability: 55, stake: 18000, color: 'green' },
      { id: 2, title: 'No', probability: 45, stake: 14000, color: 'red' }
    ],
    volume: 32000, volume24h: 4100, traders: 1876,
    news: [
      { title: 'New AI model shows 40% improvement', source: 'TechCrunch', time: '3h ago' },
      { title: 'Major tech companies invest in AI coding', source: 'Wired', time: '6h ago' },
      { title: 'Benchmark results exceed expectations', source: 'ArXiv', time: '12h ago' }
    ]
  }
];

// Interests Data (populated dynamically)
let INTERESTS_DATA = {
  politics: [], sports: [], international: [], finance: [],
  environment: [], climate: [], science: [], health: [], arts_and_culture: []
};

// Current filter states
let currentCategory = 'all';
let currentInterestsCategory = 'all';


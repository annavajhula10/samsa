// ========================================
// SAMSA - DATA LOADER
// Handles loading data for interests
// ========================================

async function loadAllInterestsData() {
  await Promise.all([
    loadSportsData(),
    loadPoliticsFromWikidata(),
    loadInternationalFromWikidata(),
    loadFinanceFromWikidata(),
    loadEnvironmentFromWikidata(),
    loadClimateFromWikidata(),
    loadScienceFromWikidata(),
    loadHealthFromWikidata(),
    loadArtsCultureFromWikidata()
  ]);
}

// Sport name to category mapping (extends SPORT_LABEL_MAPPINGS)
const SPORT_CATEGORY_MAP = {
  // Soccer variations
  'soccer': { id: 'Q2736', name: 'Soccer', icon: '⚽' },
  'association football': { id: 'Q2736', name: 'Soccer', icon: '⚽' },
  'football': { id: 'Q2736', name: 'Soccer', icon: '⚽' },

  // Basketball
  'basketball': { id: 'Q5372', name: 'Basketball', icon: '🏀' },

  // Tennis
  'tennis': { id: 'Q847', name: 'Tennis', icon: '🎾' },

  // Ice Hockey
  'ice hockey': { id: 'Q41466', name: 'Ice Hockey', icon: '🏒' },

  // American Football (includes Canadian Football)
  'american football': { id: 'Q41323', name: 'American Football', icon: '🏈' },
  'canadian football': { id: 'Q41323', name: 'American Football', icon: '🏈' },

  // Baseball
  'baseball': { id: 'Q5369', name: 'Baseball', icon: '⚾' },

  // Cricket
  'cricket': { id: 'Q5375', name: 'Cricket', icon: '🏏' },

  // Rugby variations
  'rugby union': { id: 'Q5849', name: 'Rugby', icon: '🏉' },
  'rugby league': { id: 'Q5849', name: 'Rugby', icon: '🏉' },
  'rugby': { id: 'Q5849', name: 'Rugby', icon: '🏉' },

  // Volleyball
  'volleyball': { id: 'Q1734', name: 'Volleyball', icon: '🏐' },

  // Handball
  'handball': { id: 'HANDBALL', name: 'Handball', icon: '🤾' },

  // Field/Indoor Lacrosse
  'field lacrosse': { id: 'LACROSSE', name: 'Lacrosse', icon: '🥍' },
  'indoor lacrosse': { id: 'LACROSSE', name: 'Lacrosse', icon: '🥍' },
  'lacrosse': { id: 'LACROSSE', name: 'Lacrosse', icon: '🥍' },


  // Softball
  'softball': { id: 'SOFTBALL', name: 'Softball', icon: '🥎' },


  // Multi-Sports (Olympics, Asian Games, etc.)
  'multi-sports': { id: 'MULTI_SPORTS', name: 'Multi-Sports', icon: '🏆' },
  'multi-sport': { id: 'MULTI_SPORTS', name: 'Multi-Sports', icon: '🏆' },

  // Golf
  'golf': { id: 'Q5377', name: 'Golf', icon: '⛳' },

  // Cycling
  'cycling': { id: 'Q3609', name: 'Cycling', icon: '🚴' },


  // Combat sports
  'combat': { id: 'Q32112', name: 'Combat', icon: '🥊' },
  'boxing': { id: 'Q32112', name: 'Combat', icon: '🥊' },
  'mma': { id: 'Q32112', name: 'Combat', icon: '🥊' },
  'mixed martial arts': { id: 'Q32112', name: 'Combat', icon: '🥊' },
};

// Known league revenues (in millions USD) - fallback data
const KNOWN_LEAGUE_REVENUES = {
  // American Football
  'nfl': 18600,
  'national football league': 18600,
  'ncaa football': 1100,
  'cfl': 200,
  'canadian football league': 200,
  'elf': 50,
  'european league of football': 50,

  // NCAA D1 Leagues
  'ncaa men\'s basketball': 1200,
  'ncaa women\'s basketball': 150,
  'ncaa baseball': 100,
  'ncaa hockey': 50,
  'ncaa men\'s soccer': 30,
  'ncaa women\'s soccer': 40,
  'ncaa lacrosse': 60,
  'ncaa volleyball': 80,
  'ncaa softball': 90,
  'liga mexicana de softbol': 15,

  // Baseball
  'mlb': 11000,
  'major league baseball': 11000,
  'npb': 1200,
  'nippon professional baseball': 1200,
  'kbo league': 500,

  // Basketball
  'nba': 10000,
  'national basketball association': 10000,
  'euroleague': 350,
  'chinese basketball association': 300,
  'wnba': 200,
  'women\'s national basketball association': 200,

  // Soccer
  'premier league': 6900,
  'bundesliga': 4500,
  'laliga': 4100,
  'serie a': 3200,
  'ligue 1': 2100,
  'mls': 1400,
  'major league soccer': 1400,
  'liga mx': 750,
  'eredivisie': 700,
  '2. bundesliga': 450,
  'campeonato brasileiro série a': 400,
  'nwsl': 50,
  'national women\'s soccer league': 50,

  // Ice Hockey
  'nhl': 5900,
  'national hockey league': 5900,
  'kontinental hockey league': 400,
  'pwhl': 30,


  // Tennis - Grand Slams
  'australian open': 350,
  'french open': 320,
  'wimbledon': 400,
  'us open': 450,
  // Tennis - Tours & Cups
  'atp tour': 800,
  'davis cup': 150,
  'billie jean king cup': 50,
  'laver cup': 30,
  'united cup': 20,
  'hopman cup': 15,

  // Cricket
  'ipl': 1500,
  'indian premier league': 1500,
  'big bash league': 150,

  // Rugby
  'nrl': 550,
  'national rugby league': 550,
  'top 14': 400,
  'premiership rugby': 300,
  'super rugby': 250,
  'european rugby champions cup': 250,

  // Combat / MMA
  'ufc': 1200,
  'pride fc': 100,
  'k-1': 80,
  'ksw': 50,
  'rizin ff': 60,
  'oktagon mma': 40,
  'bellator mma': 150,
  'one championship': 200,
  'pfl': 100,

  // Auto Racing
  'formula 1': 3200,
  'f1': 3200,
  'nascar': 2100,
  'motogp': 400,
  'ntt indycar series': 500,
  'indycar': 500,
  'formula e': 200,
  'fia wec': 100,

  // Cycling Grand Tours
  'tour de france': 150,
  'giro d\'italia': 60,
  'vuelta a españa': 50,

  // Golf Majors
  'masters tournament': 21,
  'pga championship': 19,
  'u.s. open': 22,
  'the open championship': 17,

  // Multi-Sport Events
  'summer olympic games': 7600,
  'winter olympic games': 2500,
  'asian games': 500,
  'commonwealth games': 200,
  'pan american games': 150,
  'european games': 100,
};

// Fetch revenue data from Wikidata
async function fetchRevenueFromWikidata() {
  const revenueMap = new Map();

  // SPARQL query to get sports leagues with revenue data
  const query = `
    SELECT ?item ?itemLabel ?revenue WHERE {
      {
        ?item wdt:P31/wdt:P279* wd:Q623109.
      } UNION {
        ?item wdt:P31/wdt:P279* wd:Q15991303.
      } UNION {
        ?item wdt:P31/wdt:P279* wd:Q1344963.
      }
      ?item wdt:P2139 ?revenue.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY DESC(?revenue)
    LIMIT 300
  `;

  try {
    const data = await Wiki.sparql(query);

    if (data?.results?.bindings) {
      for (const binding of data.results.bindings) {
        const name = binding.itemLabel?.value?.toLowerCase() || '';
        const revenue = parseFloat(binding.revenue?.value) || 0;

        if (name && revenue > 0) {
          // Convert to millions if necessary (Wikidata often stores in base currency)
          const revenueInMillions = revenue > 100000 ? revenue / 1000000 : revenue;
          revenueMap.set(name, revenueInMillions);
        }
      }
    }
    console.log(`Fetched ${revenueMap.size} leagues with revenue from Wikidata`);
  } catch (error) {
    console.log('Could not fetch Wikidata revenues, using fallback data');
  }

  return revenueMap;
}

// Get revenue for a league (checks Wikidata map, then known data, then searches Wikipedia)
async function getLeagueRevenue(leagueName, wikidataRevenues) {
  const nameLower = leagueName.toLowerCase();

  // Check Wikidata revenues first
  if (wikidataRevenues.has(nameLower)) {
    return wikidataRevenues.get(nameLower);
  }

  // Check known revenues
  if (KNOWN_LEAGUE_REVENUES[nameLower]) {
    return KNOWN_LEAGUE_REVENUES[nameLower];
  }

  // Try partial matches in known revenues
  for (const [key, value] of Object.entries(KNOWN_LEAGUE_REVENUES)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return value;
    }
  }

  // Try partial matches in Wikidata revenues
  for (const [key, value] of wikidataRevenues) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return value;
    }
  }

  return null;
}

// Format revenue for display
function formatRevenue(revenue) {
  if (!revenue) return null;
  if (revenue >= 1000) {
    return `$${(revenue / 1000).toFixed(1)}B`;
  }
  return `$${revenue.toFixed(0)}M`;
}

// Load sports data from JSON file with revenue sorting
async function loadSportsData() {
  INTERESTS_DATA.sports = [];

  // Map to store sports and their competitions
  const sportsMap = new Map();

  // Initialize with existing sports from config
  for (const sport of SELECTED_SPORTS) {
    sportsMap.set(sport.id, {
      id: sport.id,
      name: sport.name,
      icon: sport.icon,
      competitions: []
    });
  }

  // Fetch revenue data from Wikidata
  console.log('Fetching league revenues from Wikidata...');
  const wikidataRevenues = await fetchRevenueFromWikidata();

  try {
    // Fetch the leagues JSON file (flat array format)
    const response = await fetch('./data/top-leagues-attendance.json');
    const allLeagues = await response.json();

    // Track unique leagues to avoid duplicates
    const processedLeagues = new Set();
    const leaguesToProcess = [];

    for (const league of allLeagues) {
      // Skip duplicates
      const leagueKey = league.name.toLowerCase();
      if (processedLeagues.has(leagueKey)) continue;
      processedLeagues.add(leagueKey);
      leaguesToProcess.push(league);
    }

    // Get revenue for each league
    console.log('Matching revenues to leagues...');
    for (const league of leaguesToProcess) {
      const revenue = await getLeagueRevenue(league.name, wikidataRevenues);
      league.revenue = revenue;
      league.revenueDisplay = formatRevenue(revenue);
    }

    // Add leagues to sport categories
    for (const league of leaguesToProcess) {
      const sportName = league.sport.toLowerCase();

      // Find or create sport category
      let sportCategory = null;
      const mappedSport = SPORT_CATEGORY_MAP[sportName];

      if (mappedSport) {
        if (sportsMap.has(mappedSport.id)) {
          sportCategory = sportsMap.get(mappedSport.id);
        } else {
          const newSport = {
            id: mappedSport.id,
            name: mappedSport.name,
            icon: mappedSport.icon,
            competitions: []
          };
          sportsMap.set(mappedSport.id, newSport);
          sportCategory = newSport;
          console.log(`Created new sport category: ${mappedSport.name}`);
        }
      } else {
        const sportId = sportName.toUpperCase().replace(/\s+/g, '_');
        if (sportsMap.has(sportId)) {
          sportCategory = sportsMap.get(sportId);
        } else {
          const newSport = {
            id: sportId,
            name: league.sport,
            icon: '🏅',
            competitions: []
          };
          sportsMap.set(sportId, newSport);
          sportCategory = newSport;
          console.log(`Created new sport category: ${league.sport}`);
        }
      }

      // Add competition with revenue
      sportCategory.competitions.push({
        id: league.name.toLowerCase().replace(/\s+/g, '-'),
        name: league.name,
        country: league.country,
        tier: league.tier,
        revenue: league.revenue,
        revenueDisplay: league.revenueDisplay,
        logo: null,
        activeMarkets: Math.floor(Math.random() * 25) + 5,
        totalVolume: Math.floor(Math.random() * 150000) + 50000,
        change24h: (Math.random() * 20 - 10).toFixed(1)
      });
    }

    console.log(`Loaded ${processedLeagues.size} unique leagues from JSON`);

  } catch (error) {
    console.error('Error loading leagues data:', error);
  }

  // Convert map to array and add to INTERESTS_DATA
  for (const [sportId, sport] of sportsMap) {
    // Sort competitions by revenue (highest first), then by tier, then by name
    sport.competitions.sort((a, b) => {
      // Sort by revenue first (highest to lowest)
      const revA = a.revenue || 0;
      const revB = b.revenue || 0;
      if (revB !== revA) return revB - revA;

      // Then by tier (lower is better)
      if (a.tier !== b.tier) return a.tier - b.tier;

      // Then by name
      return a.name.localeCompare(b.name);
    });

    // Calculate total revenue for the sport category
    const totalRevenue = sport.competitions.reduce((sum, c) => sum + (c.revenue || 0), 0);

    INTERESTS_DATA.sports.push({
      id: sport.id,
      name: sport.name,
      image: sport.icon,
      wikidataId: sport.id,
      markets: sport.competitions.length || Math.floor(Math.random() * 10) + 5,
      volume: Math.floor(Math.random() * 100000),
      totalRevenue: totalRevenue,
      trend: 'up',
      source: 'JSON',
      competitions: sport.competitions
    });
  }

  // Sort sports by total revenue, then by competition count
  INTERESTS_DATA.sports.sort((a, b) => {
    if (b.totalRevenue !== a.totalRevenue) {
      return b.totalRevenue - a.totalRevenue;
    }
    if (b.competitions.length !== a.competitions.length) {
      return b.competitions.length - a.competitions.length;
    }
    return a.name.localeCompare(b.name);
  });

  console.log('Loaded sports (sorted by revenue):', INTERESTS_DATA.sports.map(s =>
    `${s.name}: ${s.competitions.length} leagues, $${s.totalRevenue}M total revenue`
  ));
}

/*
// ========================================
// WIKIDATA SPARQL - COMPETITIONS LOADER
// Uncomment to fetch competitions from Wikidata
// ========================================

async function loadSportsDataFromWikidata() {
  INTERESTS_DATA.sports = [];
  
  // Map to store sports and their competitions
  const sportsMap = new Map();
  
  // Initialize with existing sports from config
  for (const sport of SELECTED_SPORTS) {
    sportsMap.set(sport.id, {
      id: sport.id,
      name: sport.name,
      icon: sport.icon,
      competitions: []
    });
  }

  try {
    // Query Wikidata for sports competitions
    const query = `
      SELECT DISTINCT ?competition ?competitionLabel ?sport ?sportLabel ?logo ?sitelinks WHERE {
        VALUES ?type { wd:Q623109 wd:Q1344963 wd:Q15991303 wd:Q15991290 }
        ?competition wdt:P31 ?type.
        ?competition wdt:P641 ?sport.
        ?competition wikibase:sitelinks ?sitelinks.
        OPTIONAL { ?competition wdt:P154 ?logo. }
        FILTER(?sitelinks >= 20)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      ORDER BY DESC(?sitelinks)
      LIMIT 500
    `;

    const data = await Wiki.sparql(query);
    
    if (data?.results?.bindings) {
      for (const binding of data.results.bindings) {
        const compName = binding.competitionLabel?.value || '';
        const compId = binding.competition?.value?.split('/').pop() || '';
        const sportId = binding.sport?.value?.split('/').pop() || '';
        const sportName = binding.sportLabel?.value || '';
        const sitelinks = parseInt(binding.sitelinks?.value) || 0;
        const logo = binding.logo?.value ? getLogoUrl(binding.logo.value) : null;

        // Skip if no valid data
        if (!compName || !sportId || !sportName) continue;
        
        // Skip year-specific competitions
        if (/\b(18|19|20)\d{2}\b/.test(compName)) continue;

        // Find or create sport category
        let sportCategory = null;
        
        // Check if sport maps to existing category via label mappings
        const sportLabelLower = sportName.toLowerCase();
        const mappedSportId = SPORT_LABEL_MAPPINGS[sportLabelLower];
        
        if (mappedSportId && sportsMap.has(mappedSportId)) {
          sportCategory = sportsMap.get(mappedSportId);
        } else if (sportsMap.has(sportId)) {
          sportCategory = sportsMap.get(sportId);
        } else {
          // Create new sport category
          const newSport = {
            id: sportId,
            name: sportName,
            icon: '🏅', // Default icon for new sports
            competitions: []
          };
          sportsMap.set(sportId, newSport);
          sportCategory = newSport;
          console.log(`Created new sport category: ${sportName} (${sportId})`);
        }

        // Add competition if not duplicate
        if (!sportCategory.competitions.find(c => c.id === compId)) {
          sportCategory.competitions.push({
            id: compId,
            name: NAME_REPLACEMENTS[compId] || compName,
            logo: logo || LEAGUE_LOGOS[compId] || null,
            sitelinks,
            activeMarkets: Math.floor(Math.random() * 25) + 5,
            totalVolume: Math.floor(Math.random() * 150000) + 50000,
            change24h: (Math.random() * 20 - 10).toFixed(1)
          });
        }
      }
    }
  } catch (error) {
    console.error('Error loading sports data:', error);
  }

  // Convert map to array and add to INTERESTS_DATA
  for (const [sportId, sport] of sportsMap) {
    // Sort competitions by sitelinks
    sport.competitions.sort((a, b) => (b.sitelinks || 0) - (a.sitelinks || 0));
    
    INTERESTS_DATA.sports.push({
      id: sport.id,
      name: sport.name,
      image: sport.icon,
      wikidataId: sport.id,
      markets: sport.competitions.length || Math.floor(Math.random() * 10) + 5,
      volume: Math.floor(Math.random() * 100000),
      trend: 'up',
      source: 'Wikidata',
      competitions: sport.competitions
    });
  }

  // Sort sports: those with competitions first, then by name
  INTERESTS_DATA.sports.sort((a, b) => {
    if (b.competitions.length !== a.competitions.length) {
      return b.competitions.length - a.competitions.length;
    }
    return a.name.localeCompare(b.name);
  });

  console.log('Loaded sports:', INTERESTS_DATA.sports.map(s => `${s.name}: ${s.competitions.length} competitions`));
}
*/

// Other category loaders
async function loadPoliticsFromWikidata() {
  INTERESTS_DATA.politics = SELECTED_POLITICAL_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadInternationalFromWikidata() {
  INTERESTS_DATA.international = SELECTED_INTERNATIONAL_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadFinanceFromWikidata() {
  INTERESTS_DATA.finance = SELECTED_FINANCE_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadEnvironmentFromWikidata() {
  INTERESTS_DATA.environment = SELECTED_ENVIRONMENT_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadClimateFromWikidata() {
  INTERESTS_DATA.climate = SELECTED_CLIMATE_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadScienceFromWikidata() {
  INTERESTS_DATA.science = SELECTED_SCIENCE_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadHealthFromWikidata() {
  INTERESTS_DATA.health = SELECTED_HEALTH_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

async function loadArtsCultureFromWikidata() {
  INTERESTS_DATA.arts_and_culture = SELECTED_ARTS_CULTURE_TOPICS.map(topic => ({
    id: topic.id, name: topic.name, image: topic.icon, wikidataId: topic.id,
    markets: Math.floor(Math.random() * 25) + 10, volume: Math.floor(Math.random() * 100000),
    trend: ['up', 'neutral', 'down'][Math.floor(Math.random() * 3)], source: 'Wikidata'
  }));
}

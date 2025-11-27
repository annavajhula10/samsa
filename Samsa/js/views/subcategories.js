// ========================================
// SAMSA - SUBCATEGORIES
// Handles subcategory modal display
// ========================================

function showInterestSubcategories(wikidataId, interestName, icon) {
  // Find the sport in INTERESTS_DATA
  const sport = INTERESTS_DATA.sports.find(s => s.wikidataId === wikidataId);
  const competitions = sport?.competitions || [];
  const totalRevenue = sport?.totalRevenue || 0;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto';
  modal.onclick = function (e) { if (e.target === modal) modal.remove(); };

  const competitionsHTML = competitions.length > 0
    ? competitions.map(comp => createCompetitionCard(comp)).join('')
    : '<p class="text-slate-400 col-span-full text-center py-8">No competitions available yet.</p>';

  // Format total revenue for display
  const revenueDisplay = totalRevenue >= 1000
    ? `$${(totalRevenue / 1000).toFixed(1)}B`
    : totalRevenue > 0
      ? `$${totalRevenue.toFixed(0)}M`
      : '';

  const revenueInfo = revenueDisplay
    ? `<span class="text-green-400 text-sm ml-2">(${revenueDisplay} total revenue)</span>`
    : '';

  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <div class="text-3xl">${icon}</div>
          <div>
          <h2 class="text-2xl font-bold text-white">${interestName}</h2>
            <p class="text-slate-400 text-sm">
              ${competitions.length} league${competitions.length !== 1 ? 's' : ''} 
              ${revenueInfo}
            </p>
            <p class="text-slate-500 text-xs mt-1">Sorted by annual revenue</p>
          </div>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">✕</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${competitionsHTML}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function createCompetitionCard(comp) {
  const logoHTML = comp.logo
    ? `<img src="${comp.logo}" alt="${comp.name}" class="w-10 h-10 object-contain rounded" onerror="this.style.display='none'" />`
    : `<div class="w-10 h-10 bg-slate-700 rounded flex items-center justify-center text-xl">🏆</div>`;

  // Show revenue badge if available (highlighted in green)
  const revenueBadge = comp.revenueDisplay
    ? `<span class="bg-green-900/50 text-green-400 text-xs px-2 py-0.5 rounded font-medium">${comp.revenueDisplay}</span>`
    : '';

  // Show tier badge if available
  const tierBadge = comp.tier
    ? `<span class="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">Tier ${comp.tier}</span>`
    : '';

  // Show country if available
  const countryInfo = comp.country
    ? `<span class="text-slate-500 text-xs">${comp.country}</span>`
    : '';

  // Check if already following
  const isFollowing = isFavorited(comp.id);
  const escapedName = comp.name.replace(/'/g, "\\'");

  return `
    <div class="bg-slate-800/50 border border-slate-700 hover:border-yellow-500/50 rounded-xl p-4 transition-all">
      <div class="flex items-center gap-3 mb-3">
        ${logoHTML}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-white font-semibold truncate">${comp.name}</h3>
            ${revenueBadge}
          </div>
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            ${tierBadge}
            ${countryInfo}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="follow-comp-${comp.id}" onclick="event.stopPropagation(); handleCompetitionFollow('${comp.id}', '${escapedName}', this)"
          class="flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 ${isFollowing
      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30'
      : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-600/50 hover:text-white'}">
          ${isFollowing ? '✓ Following' : '+ Follow'}
        </button>
        <button onclick="event.stopPropagation(); viewCompetitionMarkets('${comp.id}', '${escapedName}')"
          class="flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:from-yellow-400 hover:to-amber-400">
          Markets →
        </button>
      </div>
    </div>
  `;
}

// Handle follow button click for competitions
async function handleCompetitionFollow(compId, compName, buttonElement) {
  buttonElement.disabled = true;
  buttonElement.innerHTML = '<span class="animate-pulse">...</span>';

  const isNowFollowing = await toggleFavorite(compId, compName, 'competition', 'sports');

  buttonElement.disabled = false;
  if (isNowFollowing) {
    buttonElement.innerHTML = '✓ Following';
    buttonElement.classList.remove('bg-slate-700/50', 'text-slate-300', 'border-slate-600');
    buttonElement.classList.add('bg-yellow-500/20', 'text-yellow-400', 'border-yellow-500/50');
  } else {
    buttonElement.innerHTML = '+ Follow';
    buttonElement.classList.remove('bg-yellow-500/20', 'text-yellow-400', 'border-yellow-500/50');
    buttonElement.classList.add('bg-slate-700/50', 'text-slate-300', 'border-slate-600');
  }
}

// View markets for a competition - shows detailed competition page
async function viewCompetitionMarkets(compId, compName) {
  // Close the subcategories modal
  const existingModal = document.querySelector('.fixed.inset-0');
  if (existingModal) existingModal.remove();

  // Find competition data
  let competition = null;
  for (const sport of INTERESTS_DATA.sports) {
    competition = sport.competitions.find(c => c.id === compId);
    if (competition) {
      competition.sportName = sport.name;
      competition.sportIcon = sport.image;
      break;
    }
  }

  // Create full-screen competition detail view
  const detailView = document.createElement('div');
  detailView.className = 'fixed inset-0 z-50 overflow-y-auto';
  detailView.style.background = 'rgb(2, 6, 23)';
  detailView.id = 'competitionDetailView';

  // Show loading state
  detailView.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-400">Loading ${compName}...</p>
      </div>
    </div>
  `;
  document.body.appendChild(detailView);

  // Fetch Wikipedia data
  const wikiData = await fetchCompetitionWikiData(compName);

  // Render the full competition page
  renderCompetitionDetailPage(detailView, competition, wikiData);
}

// Wikipedia article title mappings for abbreviated names
const WIKI_TITLE_MAP = {
  // American Football
  'nfl': 'National_Football_League',
  'ncaa football': 'College_football',
  'cfl': 'Canadian_Football_League',
  'elf': 'European_League_of_Football',

  // Baseball
  'mlb': 'Major_League_Baseball',
  'npb': 'Nippon_Professional_Baseball',
  'kbo league': 'KBO_League',
  'ncaa baseball': 'College_baseball',

  // Basketball
  'nba': 'National_Basketball_Association',
  'wnba': "Women's_National_Basketball_Association",
  'euroleague': 'EuroLeague',
  "ncaa men's basketball": "NCAA_Division_I_men's_basketball",
  "ncaa women's basketball": "NCAA_Division_I_women's_basketball",

  // Ice Hockey
  'nhl': 'National_Hockey_League',
  'pwhl': "Professional_Women's_Hockey_League",
  'ncaa hockey': 'College_ice_hockey',

  // Soccer
  'mls': 'Major_League_Soccer',
  'nwsl': "National_Women's_Soccer_League",
  'premier league': 'Premier_League',
  'la liga': 'La_Liga',
  'bundesliga': 'Bundesliga',
  'serie a': 'Serie_A',
  'ligue 1': 'Ligue_1',
  'liga mx': 'Liga_MX',

  // Rugby
  'nrl': 'National_Rugby_League',
  'super rugby': 'Super_Rugby',

  // Combat
  'ufc': 'Ultimate_Fighting_Championship',
  'pride fc': 'Pride_Fighting_Championships',
  'ksw': 'Konfrontacja_Sztuk_Walki',
  'rizin ff': 'Rizin_Fighting_Federation',
  'pfl': 'Professional_Fighters_League',
  'one championship': 'ONE_Championship',
  'bellator mma': 'Bellator_MMA',
  'oktagon mma': 'Oktagon_MMA',
  'k-1': 'K-1',

  // Tennis
  'atp tour': 'ATP_Tour',
  'australian open': 'Australian_Open',
  'french open': 'French_Open',
  'wimbledon': 'The_Championships,_Wimbledon',
  'us open': 'US_Open_(tennis)',
  'davis cup': 'Davis_Cup',
  'billie jean king cup': 'Billie_Jean_King_Cup',
  'laver cup': 'Laver_Cup',
  'united cup': 'United_Cup',
  'hopman cup': 'Hopman_Cup',

  // Golf
  'masters tournament': 'Masters_Tournament',
  'pga championship': 'PGA_Championship',
  'u.s. open': 'U.S._Open_(golf)',
  'the open championship': 'The_Open_Championship',

  // Cycling
  'tour de france': 'Tour_de_France',
  "giro d'italia": "Giro_d'Italia",
  'vuelta a españa': 'Vuelta_a_España',

  // Auto Racing
  'formula 1': 'Formula_One',
  'nascar': 'NASCAR',
  'motogp': 'MotoGP',
  'ntt indycar series': 'IndyCar_Series',
  'formula e': 'Formula_E',
  'fia wec': 'FIA_World_Endurance_Championship',

  // Cricket
  'ipl': 'Indian_Premier_League',
  'big bash league': 'Big_Bash_League',

  // Multi-Sports
  'summer olympic games': 'Summer_Olympic_Games',
  'winter olympic games': 'Winter_Olympic_Games',
  'asian games': 'Asian_Games',
  'commonwealth games': 'Commonwealth_Games',
  'pan american games': 'Pan_American_Games',
  'european games': 'European_Games',
};

// Fetch Wikipedia data for a competition
async function fetchCompetitionWikiData(compName) {
  try {
    // Try mapped title first
    const nameLower = compName.toLowerCase();
    let wikiTitle = WIKI_TITLE_MAP[nameLower];

    // If no mapping, try the name directly (with underscores)
    if (!wikiTitle) {
      wikiTitle = compName.replace(/ /g, '_');
    }

    console.log(`Fetching Wikipedia data for: ${wikiTitle}`);
    let summary = await Wiki.getSummary(wikiTitle);

    // If that fails and we didn't use a mapping, try common variations
    if ((!summary || !summary.extract) && !WIKI_TITLE_MAP[nameLower]) {
      const variations = [
        compName + ' (sports league)',
        compName + ' (league)',
        compName + ' (competition)',
        compName + ' (sport)',
      ];
      for (const variation of variations) {
        summary = await Wiki.getSummary(variation.replace(/ /g, '_'));
        if (summary?.extract) break;
      }
    }

    return {
      description: summary?.extract || null,
      shortDesc: summary?.description || null,
      thumbnail: summary?.thumbnail?.source || null,
      title: summary?.title || compName
    };
  } catch (e) {
    console.log('Could not fetch wiki data:', e);
    return { description: null, shortDesc: null, thumbnail: null, title: compName };
  }
}

// Render the full competition detail page - all sections on one page
function renderCompetitionDetailPage(container, comp, wikiData) {
  const revenueDisplay = comp?.revenueDisplay || (comp?.revenue ? `$${comp.revenue}M` : 'N/A');
  const thumbnail = wikiData?.thumbnail || null;

  // Get 1-2 sentences from the description
  let aboutText = 'Information about this competition will be available soon.';
  if (wikiData?.description) {
    const sentences = wikiData.description.split(/(?<=[.!?])\s+/);
    aboutText = sentences.slice(0, 2).join(' ');
  }

  // Generate sample markets for this competition
  const sampleMarkets = generateCompetitionMarkets(comp?.name || 'Competition');

  // Generate sample news
  const sampleNews = generateCompetitionNews(comp?.name || 'Competition');

  container.innerHTML = `
    <div class="min-h-screen" style="background: rgb(2, 6, 23);">
      <!-- Header -->
      <div class="sticky top-0 z-10 backdrop-blur-xl border-b border-slate-800" style="background: rgba(2, 6, 23, 0.9);">
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onclick="document.getElementById('competitionDetailView').remove()" 
            class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span class="text-xl">←</span>
            <span>Back</span>
          </button>
          <div class="flex items-center gap-3">
            <span class="text-2xl">${comp?.sportIcon || '🏆'}</span>
            <span class="text-slate-400">${comp?.sportName || 'Sports'}</span>
          </div>
        </div>
      </div>
      
      <!-- Hero Section -->
      <div class="relative">
        <div class="relative max-w-6xl mx-auto px-4 pt-8 pb-6">
          <div class="flex items-start gap-6">
            ${thumbnail ? `
              <div class="w-24 h-24 bg-slate-800 rounded-xl border-2 border-slate-700 shadow-xl p-2 flex items-center justify-center">
                <img src="${thumbnail}" alt="${comp?.name}" class="max-w-full max-h-full object-contain" />
              </div>
            ` : `
              <div class="w-24 h-24 bg-slate-800 rounded-xl border-2 border-slate-700 flex items-center justify-center text-4xl">🏆</div>
            `}
            <div class="flex-1">
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${comp?.name || 'Competition'}</h1>
              <div class="flex flex-wrap items-center gap-3 text-sm">
                <span class="bg-slate-800 text-slate-300 px-3 py-1 rounded-full">${comp?.country || 'International'}</span>
                ${comp?.tier ? `<span class="bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Tier ${comp.tier}</span>` : ''}
                <span class="bg-green-900/50 text-green-400 px-3 py-1 rounded-full font-semibold">${revenueDisplay} Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- All Content on Single Page -->
      <div class="max-w-6xl mx-auto px-4 pb-12 space-y-8">
        
        <!-- Market Statistics Section -->
        <div class="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg">
          <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
            <span>📈</span> Market Statistics
          </h3>
          
          <!-- Key Metrics Grid -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-yellow-400">${comp?.activeMarkets || Math.floor(Math.random() * 20) + 5}</div>
              <div class="text-slate-400 text-sm">Active Markets</div>
            </div>
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-green-400">$${(Math.floor(Math.random() * 500000) + 50000).toLocaleString()}</div>
              <div class="text-slate-400 text-sm">Total Volume</div>
            </div>
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-blue-400">${(Math.floor(Math.random() * 5000) + 500).toLocaleString()}</div>
              <div class="text-slate-400 text-sm">Total Traders</div>
            </div>
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-purple-400">${(Math.floor(Math.random() * 10000) + 1000).toLocaleString()}</div>
              <div class="text-slate-400 text-sm">Predictions Made</div>
            </div>
          </div>
          
          <!-- Detailed Stats -->
          <div class="grid sm:grid-cols-2 gap-4 text-sm">
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">24h Volume</span>
                <span class="text-green-400 font-semibold">$${(Math.floor(Math.random() * 50000) + 5000).toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Avg Prediction Size</span>
                <span class="text-white">$${Math.floor(Math.random() * 100) + 25}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Liquidity</span>
                <span class="text-white">$${(Math.floor(Math.random() * 200000) + 20000).toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Markets Resolved</span>
                <span class="text-white">${Math.floor(Math.random() * 50) + 10}</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Resolution Rate</span>
                <span class="text-white">${Math.floor(Math.random() * 10) + 90}%</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Avg Win Rate</span>
                <span class="text-green-400">${Math.floor(Math.random() * 20) + 45}%</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Top Payout</span>
                <span class="text-yellow-400 font-semibold">$${(Math.floor(Math.random() * 5000) + 500).toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-700">
                <span class="text-slate-400">Market Sentiment</span>
                <span class="${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}">${Math.random() > 0.5 ? '🟢 Bullish' : '🔴 Bearish'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- About Section with Stats -->
        <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📖</span> About
          </h2>
          <p class="text-slate-300 leading-relaxed mb-6">${aboutText}</p>
          ${wikiData?.shortDesc ? `<p class="text-slate-500 text-sm mb-6 italic">${wikiData.shortDesc}</p>` : ''}
          
          <!-- Stats Grid inside About -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4">
              <div class="text-slate-400 text-sm mb-1">Annual Revenue</div>
              <div class="text-xl font-bold text-yellow-400">${revenueDisplay}</div>
            </div>
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4">
              <div class="text-slate-400 text-sm mb-1">Teams/Participants</div>
              <div class="text-xl font-bold text-white">${getEstimatedTeams(comp?.name)}</div>
            </div>
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4">
              <div class="text-slate-400 text-sm mb-1">Avg Attendance</div>
              <div class="text-xl font-bold text-white">${getEstimatedAttendance(comp?.name)}</div>
            </div>
            <div class="bg-slate-800 border border-slate-600 rounded-xl p-4">
              <div class="text-slate-400 text-sm mb-1">Tier Level</div>
              <div class="text-xl font-bold text-white">${comp?.tier || 1}</div>
            </div>
          </div>
        </div>
        
        <!-- Markets Section -->
        <div>
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Active Markets
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${sampleMarkets.map(market => `
              <div class="bg-slate-900 border border-slate-700 hover:border-yellow-500/50 rounded-2xl p-5 transition-all cursor-pointer shadow-lg">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs text-green-400 font-medium">🟢 Live</span>
                  <span class="text-xs text-slate-500">${market.traders} traders</span>
                </div>
                <h3 class="text-white font-semibold mb-3 text-sm">${market.title}</h3>
      <div class="flex gap-2">
                  <button class="flex-1 bg-green-500/10 border border-green-500/50 hover:bg-green-500/20 rounded-lg py-2 px-3 transition-all">
                    <div class="text-green-400 font-bold">${market.yesOdds}¢</div>
                    <div class="text-xs text-slate-400">Yes</div>
                  </button>
                  <button class="flex-1 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 rounded-lg py-2 px-3 transition-all">
                    <div class="text-red-400 font-bold">${market.noOdds}¢</div>
                    <div class="text-xs text-slate-400">No</div>
                  </button>
                </div>
                <div class="mt-3 text-xs text-slate-500">$${market.volume.toLocaleString()} volume</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- News Section -->
        <div>
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📰</span> Latest News
          </h2>
          <div class="grid md:grid-cols-2 gap-4">
            ${sampleNews.map(news => `
              <div class="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all cursor-pointer shadow-lg">
                <h3 class="text-white font-semibold mb-2 hover:text-yellow-400 transition-colors">${news.title}</h3>
                <p class="text-slate-400 text-sm mb-2 line-clamp-2">${news.summary}</p>
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <span>${news.source}</span>
                  <span>•</span>
                  <span>${news.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>        
      </div>
    </div>
  `;
}

// Generate sample markets for a competition
function generateCompetitionMarkets(compName) {
  const marketTemplates = [
    { title: `Will ${compName} champion repeat?`, yesOdds: 35, noOdds: 65 },
    { title: `${compName}: Will there be a record-breaking season?`, yesOdds: 22, noOdds: 78 },
    { title: `Will attendance increase this season?`, yesOdds: 58, noOdds: 42 },
    { title: `Major upset in next matchday?`, yesOdds: 41, noOdds: 59 },
    { title: `New TV deal announcement this year?`, yesOdds: 30, noOdds: 70 },
    { title: `Will underdog win the title?`, yesOdds: 15, noOdds: 85 },
  ];

  return marketTemplates.map(m => ({
    ...m,
    traders: Math.floor(Math.random() * 500) + 50,
    volume: Math.floor(Math.random() * 50000) + 5000
  }));
}

// Generate sample news for a competition
function generateCompetitionNews(compName) {
  return [
    { title: `${compName} Season Preview: What to Expect`, summary: `Experts weigh in on the upcoming season with predictions and analysis of key storylines.`, source: 'Sports Weekly', time: '2 hours ago' },
    { title: `Major Transfer Rumors Swirling Around ${compName}`, summary: `Several high-profile moves could reshape the competitive landscape heading into next season.`, source: 'Transfer Central', time: '5 hours ago' },
    { title: `${compName} Viewership Numbers Hit All-Time High`, summary: `Record-breaking audiences tune in as the competition continues to grow globally.`, source: 'Media Watch', time: '1 day ago' },
    { title: `Injury Updates: Key Players Return for ${compName}`, summary: `Several star athletes are set to make their comeback after lengthy absences.`, source: 'Injury Report', time: '1 day ago' },
  ];
}

// Get estimated teams/participants
function getEstimatedTeams(compName) {
  const teamCounts = {
    // American Football
    'NFL': '32', 'CFL': '9', 'ELF': '17', 'NCAA Football': '130+',
    // Baseball
    'MLB': '30', 'NPB': '12', 'KBO': '10', 'NCAA Baseball': '300+',
    // Basketball
    'NBA': '30', 'WNBA': '12', 'EuroLeague': '18', 'NCAA': '350+',
    // Ice Hockey
    'NHL': '32', 'PWHL': '6', 'KHL': '23',
    // Soccer
    'Premier League': '20', 'Bundesliga': '18', 'La Liga': '20', 'Serie A': '20',
    'Ligue 1': '18', 'MLS': '29', 'Liga MX': '18', 'NWSL': '14',
    // Rugby
    'NRL': '17', 'Super Rugby': '12', 'Top 14': '14',
    // Combat
    'UFC': '700+', 'ONE': '600+', 'Bellator': '200+', 'PFL': '60+', 'KSW': '100+',
    // Tennis
    'ATP': '500+', 'Grand Slam': '128',
    // Golf
    'Masters': '90', 'PGA': '156', 'Open': '156',
    // Auto Racing
    'Formula 1': '20', 'NASCAR': '40+', 'IndyCar': '27', 'MotoGP': '22', 'Formula E': '22',
    // Cycling
    'Tour de France': '176', 'Giro': '176', 'Vuelta': '176',
    // Cricket
    'IPL': '10', 'Big Bash': '8',
    // Multi-Sports
    'Olympic': '200+ nations', 'Asian Games': '45 nations', 'Commonwealth': '72 nations',
  };
  for (const [key, value] of Object.entries(teamCounts)) {
    if (compName?.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return Math.floor(Math.random() * 20) + 10;
}

// Get estimated attendance
function getEstimatedAttendance(compName) {
  const attendances = {
    // American Football
    'NFL': '67,000', 'CFL': '24,000', 'NCAA Football': '45,000',
    // Baseball
    'MLB': '28,000', 'NPB': '31,000', 'KBO': '15,000',
    // Basketball
    'NBA': '17,500', 'WNBA': '6,500', 'EuroLeague': '10,000', 'NCAA Basketball': '8,000',
    // Ice Hockey
    'NHL': '17,000', 'PWHL': '8,000',
    // Soccer
    'Premier League': '40,000', 'Bundesliga': '42,000', 'La Liga': '30,000',
    'Serie A': '31,000', 'Ligue 1': '24,000', 'MLS': '21,000', 'Liga MX': '22,000',
    // Rugby
    'NRL': '18,000', 'Super Rugby': '20,000', 'Top 14': '14,000',
    // Combat
    'UFC': '18,000', 'ONE': '15,000', 'KSW': '40,000',
    // Tennis
    'Wimbledon': '42,000', 'US Open': '23,000', 'Australian': '15,000', 'French': '15,000',
    'ATP': '8,000',
    // Golf
    'Masters': '40,000', 'PGA': '50,000', 'Open': '52,000',
    // Auto Racing
    'Formula 1': '300,000', 'NASCAR': '100,000', 'IndyCar': '80,000', 'MotoGP': '150,000',
    // Cycling
    'Tour de France': '12M+ roadside', 'Giro': '8M+ roadside', 'Vuelta': '6M+ roadside',
    // Cricket
    'IPL': '50,000', 'Big Bash': '30,000',
    // Multi-Sports
    'Olympic': 'Varies', 'Asian Games': 'Varies', 'Commonwealth': 'Varies',
  };
  for (const [key, value] of Object.entries(attendances)) {
    if (compName?.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return Math.floor(Math.random() * 30000) + 5000;
}

// ========================================
// SAMSA PREDICTION MARKETS - CONFIGURATION
// ========================================

// Sports Categories
const SELECTED_SPORTS = [
  { id: 'Q2736', name: 'Soccer', icon: '⚽' },
  { id: 'Q5372', name: 'Basketball', icon: '🏀' },
  { id: 'Q847', name: 'Tennis', icon: '🎾' },
  { id: 'Q5369', name: 'Baseball', icon: '⚾' },
  { id: 'Q1734', name: 'Volleyball', icon: '🏐' },
  { id: 'Q5375', name: 'Cricket', icon: '🏏' },
  { id: 'Q41323', name: 'American Football', icon: '🏈' },
  { id: 'Q41466', name: 'Ice Hockey', icon: '🏒' },
  { id: 'Q5377', name: 'Golf', icon: '⛳' },
  { id: 'Q32112', name: 'Combat', icon: '🥊' },
  { id: 'AUTO_RACING', name: 'Auto Racing', icon: '🏎️' },
  { id: 'Q3609', name: 'Cycling', icon: '🚴' },
  { id: 'Q5849', name: 'Rugby', icon: '🏉' },
  { id: 'MULTI_SPORTS', name: 'Multi-Sports', icon: '🏆' },
  // New sports from JSON data
  { id: 'HANDBALL', name: 'Handball', icon: '🤾' },
  { id: 'LACROSSE', name: 'Lacrosse', icon: '🥍' },
  { id: 'SOFTBALL', name: 'Softball', icon: '🥎' },
];

// Sport Label Mappings
const SPORT_LABEL_MAPPINGS = {
  'association football': 'Q2736', 'football': 'Q2736', 'soccer': 'Q2736',
  'basketball': 'Q5372',
  'tennis': 'Q847',
  'baseball': 'Q5369',
  'volleyball': 'Q1734', 'beach volleyball': 'Q1734',
  'cricket': 'Q5375',
  'american football': 'Q41323', 'gridiron football': 'Q41323', 'canadian football': 'Q41323',
  'ice hockey': 'Q41466', 'hockey': 'Q41466', 'field hockey': 'Q41466',
  'swimming': 'Q5378',
  'athletics': 'Q5386', 'track and field': 'Q5386', 'marathon': 'Q5386', 'cross country running': 'Q5386', 'road running': 'Q5386',
  'golf': 'Q5377',
  'boxing': 'Q32112', 'wrestling': 'Q32112', 'judo': 'Q32112', 'karate': 'Q32112', 'taekwondo': 'Q32112',
  'mixed martial arts': 'Q32112', 'mma': 'Q32112', 'kickboxing': 'Q32112', 'muay thai': 'Q32112',
  'brazilian jiu-jitsu': 'Q32112', 'sumo': 'Q32112', 'fencing': 'Q32112', 'kung fu': 'Q32112', 'sambo': 'Q32112',
  'auto racing': 'AUTO_RACING', 'motor racing': 'AUTO_RACING', 'motorsport': 'AUTO_RACING',
  'formula one': 'AUTO_RACING', 'formula 1': 'AUTO_RACING', 'f1': 'AUTO_RACING',
  'nascar': 'AUTO_RACING', 'indycar': 'AUTO_RACING', 'rally': 'AUTO_RACING', 'rallying': 'AUTO_RACING',
  'touring car racing': 'AUTO_RACING', 'sports car racing': 'AUTO_RACING', 'endurance racing': 'AUTO_RACING',
  'drag racing': 'AUTO_RACING', 'motorcycle racing': 'AUTO_RACING', 'motogp': 'AUTO_RACING',
  'superbike racing': 'AUTO_RACING', 'karting': 'AUTO_RACING', 'stock car racing': 'AUTO_RACING',
  'grand prix racing': 'AUTO_RACING', 'open-wheel car racing': 'AUTO_RACING',
  'cycling': 'Q3609', 'road cycling': 'Q3609', 'track cycling': 'Q3609', 'mountain biking': 'Q3609',
  'bmx': 'Q3609', 'cyclo-cross': 'Q3609', 'bicycle racing': 'Q3609',
  'rugby union': 'Q5849', 'rugby': 'Q5849', 'rugby league': 'Q5849', 'rugby sevens': 'Q5849',
};

// Major Multi-Sport Events
const MAJOR_MULTI_SPORT_EVENTS = [
  { id: 'Q5389', name: 'Olympic Games', icon: '🏅', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Olympic_rings_without_rims.svg/200px-Olympic_rings_without_rims.svg.png' },
  { id: 'Q3222763', name: 'Paralympic Games', icon: '♿', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/IPC_logo_%282019%29.svg/200px-IPC_logo_%282019%29.svg.png' },
  { id: 'Q326724', name: 'Asian Games', icon: '🌏', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Asian_Games_logo.svg/200px-Asian_Games_logo.svg.png' },
  { id: 'Q1116759', name: 'European Games', icon: '🇪🇺', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/European_Games_logo.svg/200px-European_Games_logo.svg.png' },
  { id: 'Q380223', name: 'African Games', icon: '🌍', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/African_Games_logo.png/200px-African_Games_logo.png' },
  { id: 'Q320003', name: 'Pan American Games', icon: '🌎', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Pan_American_Sports_Organization_logo.svg/200px-Pan_American_Sports_Organization_logo.svg.png' },
];

// Major Combat Events
const MAJOR_COMBAT_EVENTS = [
  { id: 'Q186471', name: 'UFC', icon: '🥋', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_Logo.svg/200px-UFC_Logo.svg.png' },
  { id: 'Q35339', name: 'WWE', icon: '💪', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/WWE_Network_logo_%282021%29.svg/200px-WWE_Network_logo_%282021%29.svg.png' },
];

// League Logos
const LEAGUE_LOGOS = {
  'Q9448': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/200px-Premier_League_Logo.svg.png',
  'Q324867': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_logo_2023.svg/200px-LaLiga_logo_2023.svg.png',
  'Q82595': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/200px-Bundesliga_logo_%282017%29.svg.png',
  'Q15804': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Serie_A_logo_%282019%29.svg/200px-Serie_A_logo_%282019%29.svg.png',
  'Q13394': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Ligue_1_Uber_Eats.svg/200px-Ligue_1_Uber_Eats.svg.png',
  'Q18756': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/UEFA_Champions_League_logo.svg/200px-UEFA_Champions_League_logo.svg.png',
  'Q2131': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/FIFA_World_Cup_Logo.svg/200px-FIFA_World_Cup_Logo.svg.png',
  'Q155223': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/200px-National_Basketball_Association_logo.svg.png',
  'Q219141': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/EuroLeague_logo.svg/200px-EuroLeague_logo.svg.png',
  'Q1215884': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/200px-National_Football_League_logo.svg.png',
  'Q265538': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Major_League_Baseball_logo.svg/200px-Major_League_Baseball_logo.svg.png',
  'Q1215892': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/05_NHL_Shield.svg/200px-05_NHL_Shield.svg.png',
  'Q41920': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Wimbledon.svg/200px-Wimbledon.svg.png',
  'Q60874': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/US_Open_%28tennis%29_logo.svg/200px-US_Open_%28tennis%29_logo.svg.png',
  'Q41735': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Roland-Garros_logo.svg/200px-Roland-Garros_logo.svg.png',
  'Q60815': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Australian_Open_Logo.svg/200px-Australian_Open_Logo.svg.png',
  'Q184300': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/19/The_Masters_logo.svg/200px-The_Masters_logo.svg.png',
  'Q210055': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/PGA_Championship_logo.svg/200px-PGA_Championship_logo.svg.png',
  'Q1968': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/200px-F1.svg.png',
  'Q6520': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/NASCAR_Cup_Series_logo.svg/200px-NASCAR_Cup_Series_logo.svg.png',
  'Q1079023': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Indian_Premier_League_Official_Logo.svg/200px-Indian_Premier_League_Official_Logo.svg.png',
  'Q33881': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Tour_de_France_logo.svg/200px-Tour_de_France_logo.svg.png',
  'Q3057': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Giro_d%27Italia_logo.svg/200px-Giro_d%27Italia_logo.svg.png',
  'Q731075': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/BWF_World_Championships_logo.svg/200px-BWF_World_Championships_logo.svg.png',
  'Q192993': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/18/Rugby_World_Cup_logo.svg/200px-Rugby_World_Cup_logo.svg.png',
  'Q282520': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Six_Nations_logo.svg/200px-Six_Nations_logo.svg.png',
};

// Topic Lists
const SELECTED_POLITICAL_TOPICS = [
  { id: 'Q7188', name: 'Government', icon: '🏛️' },
  { id: 'Q179805', name: 'Political Ideology', icon: '💭' },
  { id: 'Q82955', name: 'Political Actors', icon: '👥' },
  { id: 'Q7163', name: 'Political Issues', icon: '⚖️' },
  { id: 'Q11033', name: 'Mass Media', icon: '📰' },
  { id: 'Q198', name: 'Global Issues', icon: '🌍' },
];

const SELECTED_INTERNATIONAL_TOPICS = [
  { id: 'Q1065', name: 'United Nations', icon: '🇺🇳' },
  { id: 'Q7184', name: 'NATO', icon: '🛡️' },
  { id: 'Q458', name: 'European Union', icon: '🇪🇺' },
  { id: 'Q8142', name: 'Global Trade', icon: '💱' },
  { id: 'Q8458', name: 'Human Rights', icon: '⚖️' },
  { id: 'Q131569', name: 'International Treaty', icon: '📜' },
  { id: 'Q7283', name: 'Conflicts', icon: '💣' },
];

const SELECTED_FINANCE_TOPICS = [
  { id: 'Q8142', name: 'Stock Markets', icon: '📈' },
  { id: 'Q1369352', name: 'Cryptocurrencies', icon: '₿' },
  { id: 'Q192296', name: 'Real Estate', icon: '🏠' },
  { id: 'Q860861', name: 'Commodities', icon: '🛢️' },
  { id: 'Q7889', name: 'Video Games', icon: '🎮' },
];

const SELECTED_ENVIRONMENT_TOPICS = [
  { id: 'Q183129', name: 'Conservation', icon: '🌳' },
  { id: 'Q11023', name: 'Renewable Energy', icon: '🔋' },
  { id: 'Q7918', name: 'Biodiversity', icon: '🦎' },
  { id: 'Q830077', name: 'Sustainable Development', icon: '♻️' },
  { id: 'Q51908', name: 'Environmental Policy', icon: '📋' },
];

const SELECTED_CLIMATE_TOPICS = [
  { id: 'Q7937', name: 'Global Warming', icon: '🌡️' },
  { id: 'Q125928', name: 'Carbon Emissions', icon: '💨' },
  { id: 'Q1322263', name: 'Climate Agreements', icon: '📄' },
  { id: 'Q124441', name: 'Climate Change Impacts', icon: '🌊' },
];

const SELECTED_SCIENCE_TOPICS = [
  { id: 'Q12483', name: 'Space Exploration', icon: '🚀' },
  { id: 'Q11190', name: 'Medicine', icon: '💊' },
  { id: 'Q420', name: 'Biology', icon: '🧬' },
  { id: 'Q47258', name: 'Genetics', icon: '🧬' },
  { id: 'Q11016', name: 'Artificial Intelligence', icon: '🤖' },
];

const SELECTED_HEALTH_TOPICS = [
  { id: 'Q11190', name: 'Medicine', icon: '💊' },
  { id: 'Q1928478', name: 'Vaccine', icon: '💉' },
  { id: 'Q12136', name: 'Disease', icon: '🦠' },
  { id: 'Q3391743', name: 'Public Health', icon: '🏥' },
  { id: 'Q420', name: 'Biology', icon: '🧬' },
];

const SELECTED_ARTS_CULTURE_TOPICS = [
  { id: 'Q7889', name: 'Video Games', icon: '🎮' },
  { id: 'Q11424', name: 'Film', icon: '🎬' },
  { id: 'Q7565', name: 'Concert Tours', icon: '🎤' },
  { id: 'Q483382', name: 'Music Awards', icon: '🏆' },
  { id: 'Q3305213', name: 'Art', icon: '🎨' },
];

// Category Colors
const CATEGORY_COLORS = {
  politics: 'from-blue-500 to-indigo-600',
  sports: 'from-green-500 to-emerald-600',
  international: 'from-cyan-500 to-blue-600',
  finance: 'from-amber-500 to-orange-600',
  environment: 'from-green-600 to-teal-600',
  climate: 'from-sky-500 to-blue-500',
  science: 'from-indigo-500 to-purple-600',
  health: 'from-red-500 to-pink-600',
  arts_and_culture: 'from-fuchsia-500 to-purple-600',
  technology: 'from-purple-500 to-pink-600',
  crypto: 'from-orange-500 to-red-600',
  entertainment: 'from-pink-500 to-rose-600'
};

// Name replacements
const NAME_REPLACEMENTS = {
  'Q15804': 'Serie A',
};


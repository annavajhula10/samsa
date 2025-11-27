// ========================================
// SAMSA - UTILITIES / HELPERS
// Helper functions used across the app
// ========================================

function getSportIcon(sportId) {
  const sport = SELECTED_SPORTS.find(s => s.id === sportId);
  return sport?.icon || '🏆';
}

function getLogoUrl(logoValue, width = 150) {
  if (!logoValue) return null;

  if (logoValue.includes('commons.wikimedia.org/wiki/Special:FilePath/')) {
    return logoValue + (logoValue.includes('?') ? '&' : '?') + `width=${width}`;
  }

  const filename = logoValue.split('/').pop();
  if (!filename) return null;

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
}

// ========================================
// WIKI API - Combined Wikipedia & Wikidata
// Unified interface for Wikimedia services
// ========================================

const Wiki = {
  // Internal fetch helper with timeout
  async _fetch(url, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok ? response.json() : null;
    } catch (e) {
      clearTimeout(timeoutId);
      console.log('Wiki fetch error:', e.message);
      return null;
    }
  },

  // ===== WIKIPEDIA =====

  /**
   * Get Wikipedia page summary
   * @param {string} title - Article title (e.g., 'Premier_League')
   * @param {string} lang - Language code (default: 'en')
   * @returns {Promise<Object>} - { title, extract, thumbnail, description }
   */
  async getSummary(title, lang = 'en') {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    return this._fetch(url);
  },

  /**
   * Search Wikipedia articles
   * @param {string} query - Search query
   * @param {number} limit - Max results (default: 10)
   * @param {string} lang - Language code (default: 'en')
   * @returns {Promise<Array>} - Array of page results
   */
  async search(query, limit = 10, lang = 'en') {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(query)}`;
    const data = await this._fetch(url);
    return (data?.pages || []).slice(0, limit);
  },

  /**
   * Get Wikipedia page images
   * @param {string} title - Article title
   * @param {string} lang - Language code (default: 'en')
   * @returns {Promise<Array>} - Array of media items
   */
  async getMedia(title, lang = 'en') {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
    const data = await this._fetch(url);
    return data?.items || [];
  },

  // ===== WIKIDATA =====

  /**
   * Execute SPARQL query on Wikidata
   * @param {string} query - SPARQL query
   * @returns {Promise<Object>} - Query results
   */
  async sparql(query) {
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/sparql-results+json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok ? response.json() : { results: { bindings: [] } };
    } catch (e) {
      clearTimeout(timeoutId);
      console.log('Wikidata SPARQL error:', e.message);
      return { results: { bindings: [] } };
    }
  },

  /**
   * Get Wikidata entity by ID
   * @param {string} id - Wikidata ID (e.g., 'Q9448' for Premier League)
   * @returns {Promise<Object>} - Entity data with labels, descriptions, claims
   */
  async getEntity(id) {
    const url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;
    const data = await this._fetch(url);
    return data?.entities?.[id] || null;
  },

  /**
   * Get info by Wikidata ID (combines Wikidata + Wikipedia)
   * @param {string} id - Wikidata ID (e.g., 'Q9448')
   * @param {string} lang - Language code (default: 'en')
   * @returns {Promise<Object>} - Combined data { id, label, description, wikipedia, image }
   */
  async getById(id, lang = 'en') {
    const entity = await this.getEntity(id);
    if (!entity) return null;

    const label = entity.labels?.[lang]?.value || entity.labels?.en?.value || '';
    const description = entity.descriptions?.[lang]?.value || entity.descriptions?.en?.value || '';
    const wikiTitle = entity.sitelinks?.[`${lang}wiki`]?.title || entity.sitelinks?.enwiki?.title;
    const image = entity.claims?.P154?.[0]?.mainsnak?.datavalue?.value || 
                  entity.claims?.P18?.[0]?.mainsnak?.datavalue?.value;

    let wikipedia = null;
    if (wikiTitle) {
      wikipedia = await this.getSummary(wikiTitle, lang);
    }

    return {
      id,
      label,
      description,
      wikipedia,
      image: image ? getLogoUrl(`https://commons.wikimedia.org/wiki/Special:FilePath/${image}`) : null
    };
  }
};

// Legacy function for backward compatibility
async function fetchWikidataSparql(query) {
  return Wiki.sparql(query);
}

/**
 * Fetch league revenue data from Wikidata
 * Uses P2139 (total revenue) property
 * @param {Array} leagueNames - Array of league names to search
 * @returns {Promise<Map>} - Map of league name (lowercase) to revenue in USD
 */
async function fetchLeagueRevenues(leagueNames) {
  const revenueMap = new Map();
  
  // Build SPARQL query to search for leagues and their revenue
  // P2139 = total revenue, P3529 = median income, P2295 = net profit
  const query = `
    SELECT ?item ?itemLabel ?revenue ?revenueUnit WHERE {
      ?item wdt:P31/wdt:P279* wd:Q623109.  # instance of sports league or subclass
      ?item wdt:P2139 ?revenue.
      OPTIONAL { ?item p:P2139/psv:P2139/wikibase:quantityUnit ?revenueUnit. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY DESC(?revenue)
    LIMIT 500
  `;
  
  try {
    const data = await Wiki.sparql(query);
    
    if (data?.results?.bindings) {
      for (const binding of data.results.bindings) {
        const name = binding.itemLabel?.value?.toLowerCase() || '';
        const revenue = parseFloat(binding.revenue?.value) || 0;
        
        if (name && revenue > 0) {
          revenueMap.set(name, revenue);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching league revenues:', error);
  }
  
  return revenueMap;
}

/**
 * Search Wikipedia for league revenue information
 * Falls back to text search if Wikidata doesn't have revenue
 * @param {string} leagueName - Name of the league
 * @returns {Promise<number|null>} - Revenue in USD or null
 */
async function searchLeagueRevenue(leagueName) {
  try {
    // First try to get Wikipedia summary which might mention revenue
    const summary = await Wiki.getSummary(leagueName.replace(/\s+/g, '_'));
    if (summary?.extract) {
      // Try to find revenue/income figures in the text
      const revenueMatch = summary.extract.match(/(?:revenue|income|worth)[^\d]*(?:\$|USD|US\$)\s*([\d,.]+)\s*(billion|million|B|M)?/i);
      if (revenueMatch) {
        let amount = parseFloat(revenueMatch[1].replace(/,/g, ''));
        const unit = revenueMatch[2]?.toLowerCase();
        if (unit === 'billion' || unit === 'b') amount *= 1000000000;
        else if (unit === 'million' || unit === 'm') amount *= 1000000;
        return amount;
      }
    }
  } catch (error) {
    console.log(`Could not fetch revenue for ${leagueName}`);
  }
  return null;
}

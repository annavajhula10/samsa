// ========================================
// SAMSA - MARKETS
// Handles markets page rendering and filtering
// ========================================

function renderMarkets() {
  const grid = document.getElementById('marketsGrid');
  grid.innerHTML = markets.map(market => createMarketCardHTML(market)).join('');
}

function createMarketCardHTML(market) {
  return `
    <div class="market-card group relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer rounded-2xl" data-category="${market.category}" onclick="showDetail(${market.id})">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-600/0 group-hover:from-yellow-500/5 group-hover:to-yellow-600/5 transition-all duration-300"></div>
      <div class="relative p-6">
        <div class="flex items-start justify-between mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${CATEGORY_COLORS[market.category] || 'from-slate-500 to-slate-600'} text-white">${market.category}</span>
          <span class="text-xs text-green-400 font-medium">🟢 Live</span>
        </div>
        ${market.image ? `<div class="mb-4 rounded-xl overflow-hidden"><img src="${market.image}" alt="${market.title}" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" /></div>` : ''}
        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-200">${market.title}</h3>
        <p class="text-sm text-slate-400 mb-3">${market.description}</p>
        <div class="flex gap-2">
          ${market.outcomes.slice(0, 2).map((outcome, idx) => `
            <button class="flex-1 relative overflow-hidden rounded-lg px-3 py-2 transition-all duration-200 border ${idx === 0 ? 'bg-green-500/10 border-green-500/50 hover:border-green-500 hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/50 hover:border-red-500 hover:bg-red-500/20'} active:scale-95" onclick="event.stopPropagation(); openPredictionForm(${market.id}, ${outcome.id})">
              <div class="flex flex-col gap-1">
                <span class="text-white font-medium text-xs text-center">${outcome.title}</span>
                <span class="text-lg font-bold text-center ${idx === 0 ? 'text-green-400' : 'text-red-400'}">${outcome.probability}¢</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function showMarkets() {
  hideAllViews();
  document.getElementById('marketsView').classList.remove('hidden');
}

function showDetail(marketId) {
  const market = markets.find(m => m.id === marketId);
  hideAllViews();
  document.getElementById('detailView').classList.remove('hidden');
  document.getElementById('detailContent').innerHTML = generateDetailHTML(market);
}

function generateDetailHTML(market) {
  return `
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-8">
      ${market.image ? `<div class="mb-6 rounded-2xl overflow-hidden"><img src="${market.image}" alt="${market.title}" class="w-full h-64 object-cover" /></div>` : ''}
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${CATEGORY_COLORS[market.category] || 'from-slate-500 to-slate-600'} text-white">${market.category}</span>
            <span class="text-xs text-green-400 font-medium flex items-center gap-1"><span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Live Trading</span>
          </div>
          <h1 class="text-4xl font-bold text-white mb-4">${market.title}</h1>
          <p class="text-lg text-slate-300">${market.description}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-slate-800/50 rounded-xl p-4"><p class="text-slate-400 text-sm mb-1">Total Volume</p><p class="text-2xl font-bold text-yellow-400">$${market.volume.toLocaleString()}</p></div>
        <div class="bg-slate-800/50 rounded-xl p-4"><p class="text-slate-400 text-sm mb-1">24h Volume</p><p class="text-2xl font-bold text-yellow-400">$${market.volume24h.toLocaleString()}</p></div>
        <div class="bg-slate-800/50 rounded-xl p-4"><p class="text-slate-400 text-sm mb-1">Traders</p><p class="text-2xl font-bold text-yellow-400">${market.traders.toLocaleString()}</p></div>
        <div class="bg-slate-800/50 rounded-xl p-4"><p class="text-slate-400 text-sm mb-1">Closes</p><p class="text-xl font-bold text-yellow-400">${market.closeDate}</p></div>
      </div>
    </div>
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span>📊</span> Live Odds</h2>
          <div class="space-y-4">
            ${market.outcomes.map(outcome => `
              <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 hover:border-yellow-500/50 transition-all duration-200">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">${outcome.title}</h3>
                    <div class="flex items-center gap-3">
                      <span class="text-3xl font-bold text-yellow-400">${outcome.probability}¢</span>
                      <span class="text-sm text-slate-400">$${outcome.stake.toLocaleString()} staked</span>
                    </div>
                  </div>
                  <button onclick="openPredictionForm(${market.id}, ${outcome.id})" class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all">Predict</button>
                </div>
                <div class="relative h-2 bg-slate-700 rounded-full overflow-hidden"><div class="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" style="width: ${outcome.probability}%"></div></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="space-y-8">
        <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>📰</span> News</h2>
          <div class="space-y-4">
            ${market.news.map(item => `
              <div class="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors cursor-pointer">
                <h3 class="text-white font-semibold mb-2 text-sm">${item.title}</h3>
                <div class="flex items-center justify-between text-xs"><span class="text-slate-400">${item.source}</span><span class="text-slate-500">${item.time}</span></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterMarkets() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.market-card').forEach(card => {
    const category = card.dataset.category;
    const text = card.textContent.toLowerCase();
    const matchesSearch = text.includes(searchTerm);
    const matchesCategory = currentCategory === 'all' || category === currentCategory;
    card.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
  });
}

function filterByCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-yellow-500/20', 'text-yellow-400', 'border-yellow-500/50');
    btn.classList.add('text-slate-400', 'border-slate-700');
  });
  event.target.classList.remove('text-slate-400', 'border-slate-700');
  event.target.classList.add('bg-yellow-500/20', 'text-yellow-400', 'border-yellow-500/50');
  filterMarkets();
}


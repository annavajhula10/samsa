// ========================================
// SAMSA - PAGES
// Handles other page views (Dashboard, Portfolio, etc.)
// ========================================

function showDashboard() {
  hideAllViews();
  const el = document.getElementById('dashboardView');
  if (el) {
    el.classList.remove('hidden');
    const trending = document.getElementById('dbTrending');
    if (trending && markets.length > 0) {
      trending.innerHTML = markets.slice(0, 3).map(m => `
        <div class="bg-slate-800/50 rounded-xl p-4 cursor-pointer hover:bg-slate-800/70 transition" onclick="showDetail(${m.id})">
          <div class="flex justify-between items-center">
            <span class="text-white font-medium">${m.title.substring(0, 40)}...</span>
            <span class="text-yellow-400 font-bold">$${m.volume.toLocaleString()}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

function showPortfolio() {
  hideAllViews();
  const el = document.getElementById('portfolioView');
  if (el) el.classList.remove('hidden');
}

function showActivity() {
  hideAllViews();
  const el = document.getElementById('activityView');
  if (el) el.classList.remove('hidden');
}

function showLeaderboard() {
  hideAllViews();
  const el = document.getElementById('leaderboardView');
  if (el) el.classList.remove('hidden');
}

function showSettings() {
  hideAllViews();
  const el = document.getElementById('settingsView');
  if (el) el.classList.remove('hidden');
}

function showProfile() {
  hideAllViews();
  const el = document.getElementById('profileView');
  if (el) el.classList.remove('hidden');
}

function renderDashboard() {
  const container = document.getElementById('dashboardContent');
  if (!container) return;
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <p class="text-slate-400 text-sm mb-2">Portfolio Value</p>
        <p class="text-3xl font-bold text-yellow-400">$12,450</p>
        <p class="text-green-400 text-sm mt-2">+5.2% today</p>
      </div>
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <p class="text-slate-400 text-sm mb-2">Active Predictions</p>
        <p class="text-3xl font-bold text-yellow-400">8</p>
        <p class="text-slate-400 text-sm mt-2">3 winning</p>
      </div>
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <p class="text-slate-400 text-sm mb-2">Win Rate</p>
        <p class="text-3xl font-bold text-yellow-400">68%</p>
        <p class="text-slate-400 text-sm mt-2">Last 30 days</p>
      </div>
    </div>
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <h2 class="text-xl font-bold text-white mb-4">Recent Activity</h2>
      <p class="text-slate-400">No recent activity to display.</p>
    </div>
  `;
}


// ========================================
// SAMSA - NAVIGATION
// Handles page navigation and view switching
// ========================================

function navigateTo(page) {
  const clickedItem = (typeof event !== 'undefined' && event && event.target) ? event.target.closest('.sidebar-item') : null;
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  if (clickedItem) clickedItem.classList.add('active');

  switch (page) {
    case 'markets': showMarkets(); break;
    case 'portfolio': showPortfolio(); break;
    case 'activity': showActivity(); break;
    case 'interests': showInterests(); break;
    case 'leaderboard': showLeaderboard(); break;
    case 'dashboard': showDashboard(); break;
    case 'settings': showSettings(); break;
    case 'profile': showProfile(); break;
  }
}

function hideAllViews() {
  ['marketsView', 'detailView', 'dashboardView', 'portfolioView', 'activityView', 'interestsView', 'leaderboardView', 'settingsView', 'profileView', 'subcategoryView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

function goBack() {
  showMarkets();
}


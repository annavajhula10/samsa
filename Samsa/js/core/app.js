// ========================================
// SAMSA PREDICTION MARKETS - MAIN APP
// Version: 3.1 - Organized Folders (Nov 27, 2025)
// ========================================
console.log('%c[SAMSA] App v3.1 loaded - Organized folder structure', 'color: yellow; font-weight: bold');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  // Load favorites from storage
  loadLocalFavorites();

  // Render initial markets
  renderMarkets();

  // Setup search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterMarkets);
  }

  const interestsSearch = document.getElementById('interestsSearchInput');
  if (interestsSearch) {
    interestsSearch.addEventListener('input', function () {
      renderInterests(this.value);
    });
  }

  // Pre-load interests data (don't await - let it load in background)
  loadAllInterestsData().catch(e => console.log('Background data load:', e));

  // Show markets by default
  showMarkets();

  console.log('Samsa Prediction Markets initialized');
});


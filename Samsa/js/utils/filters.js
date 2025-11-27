// ========================================
// SAMSA - FILTERS
// Placeholder for filtering logic
// ========================================

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function hasYearInName(name) {
  return /\b(18|19|20)\d{2}\b/.test(name);
}

function isLowerTier(name, description = '', sitelinks = 0) {
  return false;
}

// ========================================
// SAMSA - LOCAL STORAGE
// ========================================

const FAVORITES = {
  items: [],
  loaded: false
};

function loadLocalFavorites() {
  try {
    const stored = localStorage.getItem('samsa_favorites');
    if (stored) {
      FAVORITES.items = JSON.parse(stored);
      FAVORITES.loaded = true;
    }
  } catch (e) {
    console.log('Could not load favorites from localStorage');
  }
}

function isFavorited(itemId) {
  return FAVORITES.items.some(f => f.item_id === itemId);
}

async function toggleFavorite(itemId, itemName, itemType, category) {
  const existing = FAVORITES.items.find(f => f.item_id === itemId);

  if (existing) {
    FAVORITES.items = FAVORITES.items.filter(f => f.item_id !== itemId);
    fetch(`/api/favorites/item/${itemId}?user_id=demo`, { method: 'DELETE' }).catch(() => { });
    localStorage.setItem('samsa_favorites', JSON.stringify(FAVORITES.items));
    return false;
  } else {
    const favorite = {
      item_id: itemId,
      item_type: itemType,
      item_name: itemName,
      category: category,
      user_id: 'demo',
      created_at: new Date().toISOString()
    };
    FAVORITES.items.push(favorite);
    postJson('/api/favorites', {
      user_id: 'demo', item_id: itemId, item_type: itemType, item_name: itemName, category: category
    }).catch(() => { });
    localStorage.setItem('samsa_favorites', JSON.stringify(FAVORITES.items));
    return true;
  }
}

function readSettings() {
  try { return JSON.parse(localStorage.getItem('samsa.settings') || '{}'); }
  catch (e) { return {}; }
}

function writeSettings(settings) {
  localStorage.setItem('samsa.settings', JSON.stringify(settings));
}

async function postJson(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('POST failed');
  return response.json();
}

loadLocalFavorites();


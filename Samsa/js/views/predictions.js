// ========================================
// SAMSA - PREDICTIONS
// Handles prediction form modal
// ========================================

function openPredictionForm(marketId, outcomeId) {
  const market = markets.find(m => m.id === marketId);
  const outcome = market.outcomes.find(o => o.id === outcomeId);

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-white">Place Prediction</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <div class="bg-slate-800/50 rounded-xl p-4 mb-6">
        <p class="text-slate-400 text-sm mb-1">Predicting on</p>
        <p class="text-white font-semibold">${outcome.title}</p>
        <p class="text-yellow-400 text-2xl font-bold mt-2">${outcome.probability}¢</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="text-white font-medium mb-2 block">Stake Amount ($)</label>
          <input type="number" id="stakeAmount" min="1" placeholder="Enter amount" class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/20" />
        </div>
        <div class="bg-slate-800/50 rounded-xl p-4">
          <div class="flex justify-between mb-2"><span class="text-slate-400">Potential Return</span><span class="text-green-400 font-bold" id="potentialReturn">$0.00</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Potential Profit</span><span class="text-green-400 font-semibold" id="potentialProfit">$0.00</span></div>
        </div>
        <button onclick="submitPrediction()" class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-950 font-bold py-3 rounded-lg transition-all">Confirm Prediction</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('stakeAmount').addEventListener('input', function (e) {
    const stake = parseFloat(e.target.value) || 0;
    const multiplier = 100 / outcome.probability;
    const potentialReturn = stake * multiplier;
    document.getElementById('potentialReturn').textContent = '$' + potentialReturn.toFixed(2);
    document.getElementById('potentialProfit').textContent = '$' + (potentialReturn - stake).toFixed(2);
  });
}

function submitPrediction() {
  alert('Prediction submitted successfully! (Demo mode)');
  document.querySelector('.fixed').remove();
}


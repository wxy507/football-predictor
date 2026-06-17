/* ===== DOM refs ===== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const pages = {
  dashboard: $('#page-dashboard'),
  matches: $('#page-matches'),
  predictions: $('#page-predictions'),
};
const navLinks = $$('.nav-link');
const matchListEl = $('#match-list');
const predictionListEl = $('#prediction-list');
const modalOverlay = $('#modal-overlay');

/* ===== State ===== */
let currentPage = 'dashboard';
let currentFilter = { query: '', league: 'all', status: 'all' };

/* ===== Navigation ===== */
function navigate(page) {
  currentPage = page;
  Object.entries(pages).forEach(([k, el]) => {
    el.classList.toggle('hidden', k !== page);
  });
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === page));
  render();
}

navLinks.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  navigate(a.dataset.page);
}));

/* ===== Notification ===== */
function notify(msg, type = 'success') {
  const old = $('.notification');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ===== Render ===== */
function render() {
  switch (currentPage) {
    case 'dashboard': renderDashboard(); break;
    case 'matches': renderMatches(); break;
    case 'predictions': renderPredictions(); break;
  }
}

/* ===== Dashboard ===== */
function renderDashboard() {
  const upcomings = getUpcomingMatches();
  const predictions = STORAGE.getPredictions();
  const stats = STORAGE.getStats();

  // Stats
  const totalPredicted = Object.keys(predictions).length;
  const finishedPredicted = stats.total;
  $('#stat-total-predicted').textContent = totalPredicted;
  $('#stat-accuracy').textContent = stats.total ? stats.outcomeAccuracy + '%' : '--';
  $('#stat-score-accuracy').textContent = stats.total ? stats.scoreAccuracy + '%' : '--';
  $('#stat-correct-score').textContent = stats.scoreCorrect;
  $('#stat-matched-count').textContent = stats.outcomeCorrect;

  // Today / upcoming
  const upcomingList = $('#upcoming-list');
  if (upcomings.length === 0) {
    upcomingList.innerHTML = '<div class="empty-state"><div class="icon">⚽</div><h3>暂无即将开始的比赛</h3><p>稍后再来看看吧</p></div>';
  } else {
    upcomingList.innerHTML = upcomings.slice(0, 8).map(m => renderMatchCard(m, true)).join('');
  }

  // Recent finished with predictions
  const recentDone = $('#recent-predicted');
  const finishedDone = MATCHES
    .filter(m => m.status === 'finished' && predictions[m.id])
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    .slice(0, 5);

  if (finishedDone.length === 0) {
    recentDone.innerHTML = '<div class="empty-state"><p>还没有已结束的预测，去比赛页面预测吧</p></div>';
  } else {
    recentDone.innerHTML = finishedDone.map(m => renderMatchCard(m, true)).join('');
  }

  // Cheat history count
  const cheatCount = STORAGE.getCheatHistory().length;
  $('#cheat-count').textContent = cheatCount;
}

/* ===== Matches Page ===== */
function renderMatches() {
  const query = ($('#search-input')?.value || '').trim().toLowerCase();
  const leagueFilter = $('#league-filter')?.value || 'all';
  const statusFilter = $('#status-filter')?.value || 'all';

  let matches = [...MATCHES];

  if (query) {
    matches = matches.filter(m => {
      const home = getTeam(m.homeId);
      const away = getTeam(m.awayId);
      const league = getLeague(m.leagueId);
      const searchText = (home?.name + ' ' + home?.short + ' ' + away?.name + ' ' + away?.short + ' ' + league?.name).toLowerCase();
      return searchText.includes(query);
    });
  }

  if (leagueFilter !== 'all') {
    matches = matches.filter(m => m.leagueId === parseInt(leagueFilter));
  }

  if (statusFilter === 'upcoming') {
    matches = matches.filter(m => m.status === 'upcoming');
  } else if (statusFilter === 'finished') {
    matches = matches.filter(m => m.status === 'finished');
  }

  // Sort: upcoming first (by date), then finished (by date desc)
  matches.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'upcoming' ? -1 : 1;
    if (a.status === 'upcoming') return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
  });

  if (matches.length === 0) {
    matchListEl.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>没有找到匹配的比赛</h3><p>试试其他搜索条件</p></div>';
  } else {
    matchListEl.innerHTML = matches.map(m => renderMatchCard(m, false)).join('');
  }

  // Attach click listeners
  $$('.match-card').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.edit-prediction-btn') || e.target.closest('.btn')) return;
      const id = parseInt(el.dataset.matchId);
      openModal(id);
    });
  });

  // Edit prediction buttons
  $$('.edit-prediction-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(parseInt(btn.dataset.matchId));
    });
  });
}

/* ===== Predictions Page ===== */
function renderPredictions() {
  const predictions = STORAGE.getPredictions();
  const entries = Object.entries(predictions);

  if (entries.length === 0) {
    predictionListEl.innerHTML = '<div class="empty-state"><div class="icon">📋</div><h3>还没有任何预测</h3><p>去比赛页面开始预测吧</p></div>';
    return;
  }

  // Separate finished and upcoming
  const upcomingEntries = [];
  const finishedEntries = [];

  for (const [midStr, pred] of entries) {
    const mid = parseInt(midStr);
    const match = MATCHES.find(m => m.id === mid);
    if (!match) continue;
    if (match.status === 'finished') {
      finishedEntries.push({ match, pred });
    } else {
      upcomingEntries.push({ match, pred });
    }
  }

  const html = [];

  if (upcomingEntries.length > 0) {
    upcomingEntries.sort((a, b) => a.match.date.localeCompare(b.match.date) || a.match.time.localeCompare(b.match.time));
    html.push('<div class="section-header"><h2>待确认赛果</h2></div>');
    html.push(`<div class="match-list">${upcomingEntries.map(e => renderMatchCard(e.match, true)).join('')}</div>`);
  }

  if (finishedEntries.length > 0) {
    finishedEntries.sort((a, b) => b.match.date.localeCompare(a.match.date) || b.match.time.localeCompare(a.match.time));
    html.push('<div class="section-header"><h2>已结束（预测比对）</h2></div>');
    html.push(`<div class="match-list">${finishedEntries.map(e => renderMatchCard(e.match, true)).join('')}</div>`);
  }

  predictionListEl.innerHTML = html.join('');

  // Attach listeners
  $$('.match-card').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.edit-prediction-btn') || e.target.closest('.btn')) return;
      openModal(parseInt(el.dataset.matchId));
    });
  });
  $$('.edit-prediction-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(parseInt(btn.dataset.matchId));
    });
  });
}

/* ===== Render Match Card ===== */
function renderMatchCard(match, compact) {
  const league = getLeague(match.leagueId);
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const prediction = STORAGE.getPrediction(match.id);
  const actualResult = STORAGE.getActualResult(match);
  const actualLabel = match.status === 'finished' || actualResult ? '赛果' : '';

  let statusHtml = match.status === 'upcoming'
    ? '<span class="status-badge upcoming"><span class="dot"></span>待开赛</span>'
    : '<span class="status-badge finished"><span class="dot"></span>已结束</span>';

  // Score display
  let scoreDisplay;
  let scoreIndicator;
  if (match.status === 'finished' && match.homeScore != null) {
    scoreDisplay = `${match.homeScore} : ${match.awayScore}`;
    const r = getResult(match.homeScore, match.awayScore);
    scoreIndicator = `<span class="score-indicator ${r}">${resultLabel(r)}</span>`;
  } else {
    scoreDisplay = 'vs';
    scoreIndicator = '<span class="score-indicator upcoming">未开始</span>';
  }

  // Prediction display
  let predictionHtml = '';
  if (prediction) {
    const pScore = `${prediction.predictedHomeScore} : ${prediction.predictedAwayScore}`;
    const pOutcome = resultLabel(prediction.predictedOutcome);
    const cheatBadge = prediction.cheatModified ? ' <span class="cheat-dot" title="赛后修改过"></span>' : '';

    if (match.status === 'finished' && actualResult) {
      const actualR = getResult(actualResult.homeScore, actualResult.awayScore);
      const oc = actualR === prediction.predictedOutcome;
      const sc = prediction.predictedHomeScore === actualResult.homeScore && prediction.predictedAwayScore === actualResult.awayScore;
      let badgeClass, badgeText;
      if (sc) { badgeClass = 'correct'; badgeText = '✓ 比分+赛果正确'; }
      else if (oc) { badgeClass = 'partial'; badgeText = '✓ 赛果正确'; }
      else { badgeClass = 'wrong'; badgeText = '✗ 预测错误'; }
      if (prediction.cheatModified) { badgeClass = 'cheat'; badgeText = '⚡ 赛后修改'; }
      predictionHtml = `
        <div class="compare-row">
          <span class="item">预测: <span class="pred-score">${pScore}</span> <span class="outcome-icon ${prediction.predictedOutcome}">${pOutcome}</span>${cheatBadge}</span>
          <span class="item">${actualLabel}: <span class="actual-score">${actualResult.homeScore}:${actualResult.awayScore}</span> <span class="outcome-icon ${actualR}">${resultLabel(actualR)}</span></span>
          <span class="item"><span class="result-highlight ${badgeClass}">${badgeText}</span></span>
        </div>`;
    } else {
      predictionHtml = `
        <div class="card-footer" style="display:flex;align-items:center;gap:8px;padding-top:8px;border-top:1px solid var(--border);margin-top:8px;">
          <span class="prediction-badge pending">📝 已预测: ${pScore} ${pOutcome}${cheatBadge}</span>
        </div>`;
    }
  } else if (match.status === 'upcoming') {
    predictionHtml = `
      <div class="card-footer" style="display:flex;align-items:center;gap:8px;padding-top:8px;border-top:1px solid var(--border);margin-top:8px;">
        <span class="no-prediction">尚未预测</span>
        <button class="edit-prediction-btn" data-match-id="${match.id}">+ 预测</button>
      </div>`;
  }

  return `
    <div class="match-card" data-match-id="${match.id}">
      <div class="match-header">
        <span class="league-badge" style="background:${league?.color || '#333'}">${league?.name || ''}</span>
        <span class="match-round">${match.round || ''}</span>
        <span class="match-time">${match.date} ${match.time}</span>
      </div>
      <div class="match-body">
        <div class="team home">${home?.name || '未知'}</div>
        <div class="score-area">
          <div class="score">${scoreDisplay}</div>
          ${scoreIndicator}
        </div>
        <div class="team away">${away?.name || '未知'}</div>
      </div>
      ${predictionHtml}
    </div>`;
}

/* ===== Modal ===== */
function openModal(matchId) {
  const match = MATCHES.find(m => m.id === matchId);
  if (!match) return;

  const league = getLeague(match.leagueId);
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const prediction = STORAGE.getPrediction(matchId);
  const actual = STORAGE.getActualResult(match);
  const isCheatMode = $('#cheat-toggle')?.classList.contains('active') || false;

  // Populate header
  $('#modal-league').textContent = league?.name || '';
  $('#modal-round').textContent = match.round || '';
  $('#modal-date').textContent = `${match.date} ${match.time}`;
  $('#modal-home-team').textContent = home?.name || '主队';
  $('#modal-away-team').textContent = away?.name || '客队';
  
  // Team short names
  if (home) {
    $('#modal-home-team-short').textContent = home.short;
    $('#modal-home-team-short').style.display = "";
  } else {
    $('#modal-home-team-short').style.display = "none";
  }
  if (away) {
    $('#modal-away-team-short').textContent = away.short;
    $('#modal-away-team-short').style.display = "";
  } else {
    $('#modal-away-team-short').style.display = "none";
  }
  // Status
  const statusEl = $('#modal-status');
  if (match.status === 'finished') {
    statusEl.innerHTML = '<span class="status-badge finished"><span class="dot"></span>已结束</span>';
  } else {
    statusEl.innerHTML = '<span class="status-badge upcoming"><span class="dot"></span>未开始</span>';
  }

  // Prediction form
  const form = $('#prediction-form');
  const homeScoreInput = $('#pred-home-score');
  const awayScoreInput = $('#pred-away-score');
  const outcomeBtns = $$('.outcome-btn');

  const pred = STORAGE.getPrediction(matchId);
  if (pred) {
    homeScoreInput.value = pred.predictedHomeScore;
    awayScoreInput.value = pred.predictedAwayScore;
    outcomeBtns.forEach(b => {
      b.classList.toggle('selected', b.dataset.outcome === pred.predictedOutcome);
    });
  } else {
    homeScoreInput.value = '';
    awayScoreInput.value = '';
    outcomeBtns.forEach(b => b.classList.remove('selected'));
  }

  // Outcome selection
  outcomeBtns.forEach(btn => {
    btn.onclick = () => {
      outcomeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });

  // Allow manual score entry for upcoming matches (no auto-select)
  if (!pred && match.status === 'upcoming') {
    // Auto-select middle
    outcomeBtns.forEach(b => b.classList.remove('selected'));
  }

  // Comparison section
  const comparisonEl = $('#comparison-section');
  const resultEntryEl = $('#result-entry-section');
  const cheatEl = $('#cheat-section');

  comparisonEl.classList.add('hidden');
  resultEntryEl.classList.add('hidden');
  cheatEl.classList.add('hidden');

  if (match.status === 'finished' && actual) {
    comparisonEl.classList.remove('hidden');
    const actualR = getResult(actual.homeScore, actual.awayScore);
    $('#compare-actual-score').textContent = `${actual.homeScore} : ${actual.awayScore}`;
    $('#compare-actual-result').textContent = resultLabel(actualR);
    $('#compare-actual-result').className = `value ${actualR === 'home' ? 'correct' : actualR === 'away' ? 'wrong' : ''}`;

    if (pred) {
      const oc = actualR === pred.predictedOutcome;
      const sc = pred.predictedHomeScore === actual.homeScore && pred.predictedAwayScore === actual.awayScore;
      $('#compare-pred-score').textContent = `${pred.predictedHomeScore} : ${pred.predictedAwayScore}`;
      $('#compare-pred-outcome').textContent = resultLabel(pred.predictedOutcome);
      $('#compare-pred-outcome').className = `value ${oc ? 'correct' : 'wrong'}`;
      $('#compare-outcome-correct').textContent = oc ? '✓ 正确' : '✗ 错误';
      $('#compare-outcome-correct').className = `value ${oc ? 'correct' : 'wrong'}`;
      $('#compare-score-correct').textContent = sc ? '✓ 正确' : '✗ 错误';
      $('#compare-score-correct').className = `value ${sc ? 'correct' : 'wrong'}`;
    } else {
      $('#compare-pred-score').textContent = '未预测';
      $('#compare-pred-outcome').textContent = '--';
      $('#compare-pred-outcome').className = 'value';
      $('#compare-outcome-correct').textContent = '--';
      $('#compare-outcome-correct').className = 'value';
      $('#compare-score-correct').textContent = '--';
      $('#compare-score-correct').className = 'value';
    }

    // Cheat section - only for finished matches
    cheatEl.classList.remove('hidden');
    $('#cheat-save-btn').onclick = handleCheatSave;
  }

  // Result entry for upcoming matches
  if (match.status === 'upcoming') {
    resultEntryEl.classList.remove('hidden');
    $('#result-home-score').value = '';
    $('#result-away-score').value = '';
    $('#save-result-btn').onclick = () => handleSaveResult(matchId);
  } else {
    // Re-enter result button
    $('#reenter-result-btn').onclick = () => {
      $('#result-entry-form').classList.remove('hidden');
      $('#result-home-score').value = actual?.homeScore ?? '';
      $('#result-away-score').value = actual?.awayScore ?? '';
    };
    $('#save-result-btn').onclick = () => handleSaveResult(matchId);
  }

  // Submit prediction
  $('#submit-prediction').onclick = () => handlePredictionSubmit(matchId, match);

  // Show modal
  modalOverlay.classList.remove('hidden');
  modalOverlay.dataset.matchId = matchId;

  // Update save button text
  if (pred) {
    $('#submit-prediction').textContent = '更新预测';
  } else {
    $('#submit-prediction').textContent = '提交预测';
  }
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  render();
}

$('#modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

/* ===== Prediction Submit ===== */
function handlePredictionSubmit(matchId, match) {
  const homeScore = parseInt($('#pred-home-score').value);
  const awayScore = parseInt($('#pred-away-score').value);
  const selectedOutcome = $('.outcome-btn.selected');

  if (isNaN(homeScore) || isNaN(awayScore)) {
    notify('请输入正确的比分', 'error');
    return;
  }

  if (homeScore < 0 || awayScore < 0 || homeScore > 20 || awayScore > 20) {
    notify('比分范围：0-20', 'error');
    return;
  }

  let predictedOutcome;
  if (selectedOutcome) {
    predictedOutcome = selectedOutcome.dataset.outcome;
  } else {
    // Auto-determine based on score
    if (homeScore > awayScore) predictedOutcome = 'home';
    else if (homeScore < awayScore) predictedOutcome = 'away';
    else predictedOutcome = 'draw';
  }

  STORAGE.savePrediction(matchId, {
    predictedHomeScore: homeScore,
    predictedAwayScore: awayScore,
    predictedOutcome,
  });

  notify('预测成功保存！', 'success');
  closeModal();
}

/* ===== Save Result ===== */
function handleSaveResult(matchId) {
  const homeScore = parseInt($('#result-home-score').value);
  const awayScore = parseInt($('#result-away-score').value);

  if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
    notify('请输入正确的比分', 'error');
    return;
  }

  STORAGE.setMatchResult(matchId, homeScore, awayScore);

  // Also update the actual match data in MATCHES array for live comparison
  const match = MATCHES.find(m => m.id === matchId);
  if (match && match.status === 'upcoming') {
    match.status = 'finished';
    match.homeScore = homeScore;
    match.awayScore = awayScore;
  }

  notify('赛果已录入！', 'success');
  closeModal();
}

/* ===== Cheat Save ===== */
function handleCheatSave() {
  const matchId = parseInt(modalOverlay.dataset.matchId);
  const match = MATCHES.find(m => m.id === matchId);
  const oldPred = STORAGE.getPrediction(matchId);

  const homeScore = parseInt($('#pred-home-score').value);
  const awayScore = parseInt($('#pred-away-score').value);

  if (isNaN(homeScore) || isNaN(awayScore)) {
    notify('请输入正确的比分', 'error');
    return;
  }

  const selectedOutcome = $('.outcome-btn.selected');
  let newOutcome;
  if (selectedOutcome) {
    newOutcome = selectedOutcome.dataset.outcome;
  } else {
    if (homeScore > awayScore) newOutcome = 'home';
    else if (homeScore < awayScore) newOutcome = 'away';
    else newOutcome = 'draw';
  }

  const newPred = {
    predictedHomeScore: homeScore,
    predictedAwayScore: awayScore,
    predictedOutcome: newOutcome,
    cheatModified: true,
  };

  if (oldPred) {
    STORAGE.cheatModify(matchId, oldPred, newPred);
  } else {
    newPred.cheatModified = true;
    STORAGE.savePrediction(matchId, newPred);
  }

  notify('⚡ 预测已修改（作弊模式）！', 'warning');
  closeModal();
}

/* ===== Cheat Toggle ===== */
$('#cheat-toggle')?.addEventListener('click', () => {
  $('#cheat-toggle').classList.toggle('active');
  const isActive = $('#cheat-toggle').classList.contains('active');
  $('#cheat-toggle-label').textContent = isActive ? '作弊模式 开' : '作弊模式 关';
});

/* ===== Helpers ===== */
function getUpcomingMatches() {
  // Get today's and upcoming matches
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  return MATCHES
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

/* ===== Search Events ===== */
$('#search-input')?.addEventListener('input', renderMatches);
$('#league-filter')?.addEventListener('change', renderMatches);
$('#status-filter')?.addEventListener('change', renderMatches);

/* ===== Chrome / External Data Integration ===== */
// The app can receive external match data updates through this function.
// When the Chrome scraper (scraper/fetch-matches.js) runs, it can call
// updateLocalData(data) to refresh matches in localStorage.
function updateLocalData(newMatches) {
  if (!newMatches || !Array.isArray(newMatches)) return;
  // Merge new data into MATCHES (preserve predictions)
  const existing = STORAGE.getMatchResults();
  for (const nm of newMatches) {
    const idx = MATCHES.findIndex(m => m.id === nm.id);
    if (idx !== -1) {
      // Update existing
      if (nm.status === 'finished' && nm.homeScore != null) {
        MATCHES[idx].status = 'finished';
        MATCHES[idx].homeScore = nm.homeScore;
        MATCHES[idx].awayScore = nm.awayScore;
      }
    } else {
      // Add new match
      MATCHES.push(nm);
    }
  }
  // Save last update time
  localStorage.setItem('fp_last_update', new Date().toISOString());
  notify('比赛数据已更新！', 'success');
  render();
}

/* ===== Manual API fetch ===== */
async function fetchLiveDataFromApi() {
  // Try to fetch from a public football API
  // Since CORS may be an issue from static sites, we try multiple sources
  const sources = [
    // Free API: OpenLigaDB (German football, but works globally)
    'https://api.openligadb.de/api/getmatchdata/bl1/2026',
  ];

  const refreshIndicator = $('#refresh-indicator');
  if (refreshIndicator) refreshIndicator.classList.remove('hidden');

  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data && data.length > 0) {
        // Transform data into our format
        const transformed = transformOpenLigaDB(data);
        if (transformed.length > 0) {
          updateLocalData(transformed);
          document.querySelector('.update-bar .time').textContent = '刚刚更新';
        }
      }
      break;
    } catch (e) {
      console.warn('Fetch failed:', url, e);
    }
  }

  if (refreshIndicator) refreshIndicator.classList.add('hidden');
}

function transformOpenLigaDB(data) {
  // Transform OpenLigaDB data to our match format
  // This is a basic transformation - real usage needs proper team/league mapping
  return data.map((m, idx) => ({
    id: 1000 + idx,
    leagueId: 1, // Default to Bundesliga
    homeId: 1,
    awayId: 2,
    date: m.matchDateTime?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    time: m.matchDateTime?.slice(11, 16) || '00:00',
    round: `Matchday ${m.group?.groupOrderID || ''}`,
    status: m.matchIsFinished ? 'finished' : 'upcoming',
    homeScore: m.matchResults?.find(r => r.resultTypeID === 2)?.pointsTeam1 ?? null,
    awayScore: m.matchResults?.find(r => r.resultTypeID === 2)?.pointsTeam2 ?? null,
  }));
}

// Manual refresh button
$('#refresh-data-btn')?.addEventListener('click', fetchLiveDataFromApi);

/* ===== Init ===== */
navigate('dashboard');

// Show last update time
const lastUpdate = localStorage.getItem('fp_last_update');
if (lastUpdate) {
  const d = new Date(lastUpdate);
  document.querySelector('.update-bar .time').textContent = d.toLocaleString('zh-CN');
} else {
  document.querySelector('.update-bar .time').textContent = '内置数据';
}

// Keyboard support

// Listen for external data updates
window.addEventListener("footballDataUpdated", function() {
  const lu = localStorage.getItem("fp_last_update");
  if (lu) {
    document.querySelector(".update-bar .time").textContent = new Date(lu).toLocaleString("zh-CN");
  }
  render();
});document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/** localStorage 封装 - 存储预测数据和比赛结果 */
const STORAGE = {
  _prefix: 'fp_',

  /** 获取所有预测 */
  getPredictions() {
    try {
      const data = localStorage.getItem(this._prefix + 'predictions');
      return data ? JSON.parse(data) : {};
    } catch { return {}; }
  },

  /** 获取单场比赛预测 */
  getPrediction(matchId) {
    const all = this.getPredictions();
    return all[matchId] || null;
  },

  /** 保存预测 */
  savePrediction(matchId, prediction) {
    const all = this.getPredictions();
    const now = new Date().toISOString();
    if (all[matchId]) {
      prediction.createdAt = all[matchId].createdAt;
      prediction.updatedAt = now;
    } else {
      prediction.createdAt = now;
      prediction.updatedAt = now;
    }
    all[matchId] = prediction;
    localStorage.setItem(this._prefix + 'predictions', JSON.stringify(all));
  },

  /** 作弊修改 - 记录修改历史 */
  cheatModify(matchId, oldPred, newPred) {
    const history = this.getCheatHistory();
    history.push({
      matchId,
      oldHomeScore: oldPred.predictedHomeScore,
      oldAwayScore: oldPred.predictedAwayScore,
      oldOutcome: oldPred.predictedOutcome,
      newHomeScore: newPred.predictedHomeScore,
      newAwayScore: newPred.predictedAwayScore,
      newOutcome: newPred.predictedOutcome,
      modifiedAt: new Date().toISOString(),
    });
    newPred.cheatModified = true;
    this.savePrediction(matchId, newPred);
    localStorage.setItem(this._prefix + 'cheat_history', JSON.stringify(history));
  },

  /** 获取作弊修改历史 */
  getCheatHistory() {
    try {
      const data = localStorage.getItem(this._prefix + 'cheat_history');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  /** 录入实际比赛结果 */
  setMatchResult(matchId, homeScore, awayScore) {
    const results = this.getMatchResults();
    results[matchId] = { homeScore, awayScore, enteredAt: new Date().toISOString() };
    localStorage.setItem(this._prefix + 'match_results', JSON.stringify(results));
  },

  /** 获取所有手动录入的赛果 */
  getMatchResults() {
    try {
      const data = localStorage.getItem(this._prefix + 'match_results');
      return data ? JSON.parse(data) : {};
    } catch { return {}; }
  },

  /** 获取实际赛果（优先用内置数据，没有则用手动录入） */
  getActualResult(match) {
    if (match.status === 'finished' && match.homeScore != null) {
      return { homeScore: match.homeScore, awayScore: match.awayScore };
    }
    const results = this.getMatchResults();
    const r = results[match.id];
    if (r) return r;
    return null;
  },

  /** 清除所有数据 */
  clearAll() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this._prefix));
    keys.forEach(k => localStorage.removeItem(k));
  },

  /** 统计预测表现 */
  getStats() {
    const predictions = this.getPredictions();
    let total = 0, outcomeCorrect = 0, scoreCorrect = 0;
    const details = [];

    for (const [matchIdStr, pred] of Object.entries(predictions)) {
      const mid = parseInt(matchIdStr);
      const match = MATCHES.find(m => m.id === mid);
      if (!match || match.status !== 'finished') continue;

      const actual = this.getActualResult(match);
      if (!actual) continue;

      const actualResult = getResult(actual.homeScore, actual.awayScore);
      const predictedResult = pred.predictedOutcome;

      total++;
      const oc = actualResult === predictedResult;
      const sc = pred.predictedHomeScore === actual.homeScore &&
                 pred.predictedAwayScore === actual.awayScore;
      if (oc) outcomeCorrect++;
      if (sc) scoreCorrect++;

      details.push({
        match,
        prediction: pred,
        actual,
        outcomeCorrect: oc,
        scoreCorrect: sc,
      });
    }

    return {
      total,
      outcomeCorrect,
      scoreCorrect,
      outcomeAccuracy: total ? Math.round((outcomeCorrect / total) * 100) : 0,
      scoreAccuracy: total ? Math.round((scoreCorrect / total) * 100) : 0,
      details,
    };
  },
};

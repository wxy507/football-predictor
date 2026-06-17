/** 联赛数据 */
const LEAGUES = [
  { id: 1, name: '英超', country: '英格兰', fullName: 'Premier League', color: '#38003c' },
  { id: 2, name: '西甲', country: '西班牙', fullName: 'La Liga', color: '#febe1b' },
  { id: 3, name: '意甲', country: '意大利', fullName: 'Serie A', color: '#0068a8' },
  { id: 4, name: '德甲', country: '德国', fullName: 'Bundesliga', color: '#d2051e' },
  { id: 5, name: '法甲', country: '法国', fullName: 'Ligue 1', color: '#004170' },
  { id: 6, name: '中超', country: '中国', fullName: 'Chinese Super League', color: '#db2b2b' },
  { id: 7, name: '欧冠', country: '欧洲', fullName: 'Champions League', color: '#00285e' },
];

/** 球队数据 */
const TEAMS = [
  { id: 1,  name: '曼城 Manchester City', short: '曼城' },
  { id: 2,  name: '阿森纳 Arsenal', short: '阿森纳' },
  { id: 3,  name: '利物浦 Liverpool', short: '利物浦' },
  { id: 4,  name: '曼联 Manchester United', short: '曼联' },
  { id: 5,  name: '切尔西 Chelsea', short: '切尔西' },
  { id: 6,  name: '热刺 Tottenham', short: '热刺' },
  { id: 7,  name: '皇马 Real Madrid', short: '皇马' },
  { id: 8,  name: '巴萨 Barcelona', short: '巴萨' },
  { id: 9,  name: '马竞 Atletico Madrid', short: '马竞' },
  { id: 10, name: 'AC米兰 AC Milan', short: 'AC米兰' },
  { id: 11, name: '国米 Inter Milan', short: '国米' },
  { id: 12, name: '尤文图斯 Juventus', short: '尤文' },
  { id: 13, name: '拜仁 Bayern Munich', short: '拜仁' },
  { id: 14, name: '多特 Dortmund', short: '多特' },
  { id: 15, name: '巴黎 PSG', short: '巴黎' },
  { id: 16, name: '马赛 Marseille', short: '马赛' },
  { id: 17, name: '上海海港', short: '海港' },
  { id: 18, name: '山东泰山', short: '泰山' },
  { id: 19, name: '北京国安', short: '国安' },
  { id: 20, name: '上海申花', short: '申花' },
];

/** 比赛数据 - 已结束的比赛（有比分） + 未开始的比赛 */
const MATCHES = [
  // ========== 已结束的比赛 ==========
  { id: 1,  leagueId: 1, homeId: 1,  awayId: 2,  date: '2026-05-03', time: '23:00', round: '第35轮', status: 'finished', homeScore: 2, awayScore: 1 },
  { id: 2,  leagueId: 1, homeId: 3,  awayId: 6,  date: '2026-05-04', time: '20:30', round: '第35轮', status: 'finished', homeScore: 3, awayScore: 1 },
  { id: 3,  leagueId: 1, homeId: 4,  awayId: 5,  date: '2026-05-04', time: '23:00', round: '第35轮', status: 'finished', homeScore: 0, awayScore: 0 },
  { id: 4,  leagueId: 2, homeId: 7,  awayId: 8,  date: '2026-05-05', time: '03:00', round: '第34轮', status: 'finished', homeScore: 2, awayScore: 2 },
  { id: 5,  leagueId: 2, homeId: 9,  awayId: 8,  date: '2026-05-05', time: '22:15', round: '第34轮', status: 'finished', homeScore: 1, awayScore: 0 },
  { id: 6,  leagueId: 3, homeId: 10, awayId: 11, date: '2026-05-06', time: '02:45', round: '第36轮', status: 'finished', homeScore: 1, awayScore: 2 },
  { id: 7,  leagueId: 3, homeId: 12, awayId: 10, date: '2026-05-06', time: '22:00', round: '第36轮', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 8,  leagueId: 4, homeId: 13, awayId: 14, date: '2026-05-03', time: '21:30', round: '第32轮', status: 'finished', homeScore: 3, awayScore: 0 },
  { id: 9,  leagueId: 5, homeId: 15, awayId: 16, date: '2026-05-04', time: '23:00', round: '第33轮', status: 'finished', homeScore: 4, awayScore: 1 },
  { id: 10, leagueId: 6, homeId: 17, awayId: 18, date: '2026-05-05', time: '19:35', round: '第12轮', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 11, leagueId: 6, homeId: 19, awayId: 20, date: '2026-05-06', time: '19:35', round: '第12轮', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 12, leagueId: 7, homeId: 7,  awayId: 1,  date: '2026-05-07', time: '03:00', round: '半决赛首回合', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 13, leagueId: 7, homeId: 15, awayId: 13, date: '2026-05-08', time: '03:00', round: '半决赛首回合', status: 'finished', homeScore: 2, awayScore: 3 },

  // ========== 进行中 / 即将开始的比赛 ==========
  { id: 14, leagueId: 1, homeId: 1,  awayId: 4,  date: '2026-06-17', time: '22:00', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 15, leagueId: 1, homeId: 2,  awayId: 3,  date: '2026-06-17', time: '22:00', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 16, leagueId: 1, homeId: 5,  awayId: 6,  date: '2026-06-17', time: '22:00', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 17, leagueId: 2, homeId: 8,  awayId: 9,  date: '2026-06-18', time: '03:00', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 18, leagueId: 2, homeId: 7,  awayId: 9,  date: '2026-06-18', time: '22:15', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 19, leagueId: 3, homeId: 11, awayId: 12, date: '2026-06-18', time: '02:45', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 20, leagueId: 4, homeId: 14, awayId: 13, date: '2026-06-19', time: '21:30', round: '第34轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 21, leagueId: 5, homeId: 16, awayId: 15, date: '2026-06-20', time: '23:00', round: '第38轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 22, leagueId: 6, homeId: 18, awayId: 19, date: '2026-06-21', time: '19:35', round: '第15轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 23, leagueId: 6, homeId: 20, awayId: 17, date: '2026-06-21', time: '19:35', round: '第15轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 24, leagueId: 7, homeId: 1,  awayId: 13, date: '2026-06-22', time: '03:00', round: '决赛', status: 'upcoming', homeScore: null, awayScore: null },
];

/** 工具函数：获取联赛名 */
function getLeague(id) { return LEAGUES.find(l => l.id === id); }
/** 工具函数：获取球队名 */
function getTeam(id) { return TEAMS.find(t => t.id === id); }

/** 判断比赛结果类型 */
function getResult(homeScore, awayScore) {
  if (homeScore == null || awayScore == null) return null;
  if (homeScore > awayScore) return 'home';
  if (homeScore < awayScore) return 'away';
  return 'draw';
}

/** 结果类型转中文 */
function resultLabel(type) {
  const map = { home: '主胜', away: '客胜', draw: '平局' };
  return map[type] || '未知';
}

/** 判断预测是否正确 */
function isPredictionCorrect(match, prediction) {
  if (!match || match.status !== 'finished' || !prediction) return null;
  const actualResult = getResult(match.homeScore, match.awayScore);
  const predictedResult = prediction.predictedOutcome;
  const exactScore = prediction.predictedHomeScore === match.homeScore &&
                     prediction.predictedAwayScore === match.awayScore;
  return {
    outcomeCorrect: actualResult === predictedResult,
    scoreCorrect: exactScore,
    actualResult,
    predictedResult,
  };
}

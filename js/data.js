/** 联赛数据 - 2026世界杯 */
const LEAGUES = [
  { id: 1, name: '世界杯', country: '全球', fullName: 'FIFA World Cup 2026', color: '#1a1a2e' },
];

/** 球队数据 - 已从懂球帝确认 */
const TEAMS = [
  { id: 1,  name: '墨西哥 Mexico', short: '墨西哥' },
  { id: 2,  name: '南非 South Africa', short: '南非' },
  { id: 3,  name: '加拿大 Canada', short: '加拿大' },
  { id: 4,  name: '波黑 Bosnia', short: '波黑' },
  { id: 5,  name: '卡塔尔 Qatar', short: '卡塔尔' },
  { id: 6,  name: '瑞士 Switzerland', short: '瑞士' },
  { id: 7,  name: '德国 Germany', short: '德国' },
  { id: 8,  name: '库拉索 Curaçao', short: '库拉索' },
  { id: 9,  name: '西班牙 Spain', short: '西班牙' },
  { id: 10, name: '佛得角 Cape Verde', short: '佛得角' },
  { id: 11, name: '伊拉克 Iraq', short: '伊拉克' },
  { id: 12, name: '挪威 Norway', short: '挪威' },
  { id: 13, name: '法国 France', short: '法国' },
  { id: 14, name: '塞内加尔 Senegal', short: '塞内加尔' },
  { id: 15, name: '阿根廷 Argentina', short: '阿根廷' },
  { id: 16, name: '阿尔及利亚 Algeria', short: '阿尔及利亚' },
  { id: 17, name: '奥地利 Austria', short: '奥地利' },
  { id: 18, name: '约旦 Jordan', short: '约旦' },
];

/** 世界杯 2026 比赛数据 - 从懂球帝实时获取 */
const MATCHES = [
  // ===== 已结束 =====
  { id: 1,  leagueId: 1, homeId: 1,  awayId: 2,  date: '2026-06-12', time: '03:00', round: '小组赛', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 2,  leagueId: 1, homeId: 3,  awayId: 4,  date: '2026-06-13', time: '03:00', round: '小组赛', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 3,  leagueId: 1, homeId: 5,  awayId: 6,  date: '2026-06-14', time: '03:00', round: '小组赛', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 4,  leagueId: 1, homeId: 7,  awayId: 8,  date: '2026-06-15', time: '01:00', round: '小组赛', status: 'finished', homeScore: 7, awayScore: 1 },
  { id: 5,  leagueId: 1, homeId: 9,  awayId: 10, date: '2026-06-16', time: '00:00', round: '小组赛', status: 'finished', homeScore: 0, awayScore: 0 },
  { id: 6,  leagueId: 1, homeId: 11, awayId: 12, date: '2026-06-16', time: '06:00', round: '小组赛', status: 'finished', homeScore: 1, awayScore: 4 },
  { id: 7,  leagueId: 1, homeId: 13, awayId: 14, date: '2026-06-17', time: '03:00', round: '小组赛', status: 'finished', homeScore: 3, awayScore: 1 },
  { id: 8,  leagueId: 1, homeId: 15, awayId: 16, date: '2026-06-17', time: '09:00', round: '小组赛', status: 'finished', homeScore: 3, awayScore: 0 },

  // ===== 今日待开赛（6月17日） =====
  { id: 9,  leagueId: 1, homeId: 17, awayId: 18, date: '2026-06-17', time: '12:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },

  // ===== 未来比赛（占位，数据每天自动更新） =====
  { id: 10, leagueId: 1, homeId: 1,  awayId: 3,  date: '2026-06-18', time: '00:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 11, leagueId: 1, homeId: 2,  awayId: 4,  date: '2026-06-18', time: '06:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 12, leagueId: 1, homeId: 5,  awayId: 7,  date: '2026-06-19', time: '03:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 13, leagueId: 1, homeId: 6,  awayId: 8,  date: '2026-06-19', time: '06:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 14, leagueId: 1, homeId: 9,  awayId: 11, date: '2026-06-20', time: '03:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 15, leagueId: 1, homeId: 10, awayId: 12, date: '2026-06-20', time: '06:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 16, leagueId: 1, homeId: 13, awayId: 15, date: '2026-06-21', time: '03:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 17, leagueId: 1, homeId: 14, awayId: 16, date: '2026-06-21', time: '06:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 18, leagueId: 1, homeId: 17, awayId: 1,  date: '2026-06-22', time: '00:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 19, leagueId: 1, homeId: 18, awayId: 2,  date: '2026-06-22', time: '06:00', round: '小组赛', status: 'upcoming', homeScore: null, awayScore: null },
];

function getLeague(id) { return LEAGUES.find(l => l.id === id); }
function getTeam(id) { return TEAMS.find(t => t.id === id); }
function getResult(homeScore, awayScore) {
  if (homeScore == null || awayScore == null) return null;
  if (homeScore > awayScore) return 'home';
  if (homeScore < awayScore) return 'away';
  return 'draw';
}
function resultLabel(type) {
  const map = { home: '主胜', away: '客胜', draw: '平局' };
  return map[type] || '未知';
}
function isPredictionCorrect(match, prediction) {
  if (!match || match.status !== 'finished' || !prediction) return null;
  const actualResult = getResult(match.homeScore, match.awayScore);
  const predictedResult = prediction.predictedOutcome;
  const exactScore = prediction.predictedHomeScore === match.homeScore && prediction.predictedAwayScore === match.awayScore;
  return {
    outcomeCorrect: actualResult === predictedResult,
    scoreCorrect: exactScore,
    actualResult, predictedResult,
  };
}

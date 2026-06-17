/** 联赛数据 - 2026世界杯 */
const LEAGUES = [
  { id: 1, name: '世界杯', country: '全球', fullName: 'FIFA World Cup 2026', color: '#1a1a2e' },
  { id: 7, name: '世界杯淘汰赛', country: '全球', fullName: 'Knockout Stage', color: '#e74c3c' },
];

/** 球队数据 */
const TEAMS = [
  { id: 1,  name: '巴西 Brazil', short: '巴西' },
  { id: 2,  name: '克罗地亚 Croatia', short: '克罗地亚' },
  { id: 3,  name: '新西兰 New Zealand', short: '新西兰' },
  { id: 4,  name: '阿根廷 Argentina', short: '阿根廷' },
  { id: 5,  name: '尼日利亚 Nigeria', short: '尼日利亚' },
  { id: 6,  name: '韩国 South Korea', short: '韩国' },
  { id: 7,  name: '法国 France', short: '法国' },
  { id: 8,  name: '美国 USA', short: '美国' },
  { id: 9,  name: '伊朗 Iran', short: '伊朗' },
  { id: 10, name: '英格兰 England', short: '英格兰' },
  { id: 11, name: '塞内加尔 Senegal', short: '塞内加尔' },
  { id: 12, name: '澳大利亚 Australia', short: '澳大利亚' },
  { id: 13, name: '德国 Germany', short: '德国' },
  { id: 14, name: '日本 Japan', short: '日本' },
  { id: 15, name: '沙特 Saudi Arabia', short: '沙特' },
  { id: 16, name: '西班牙 Spain', short: '西班牙' },
  { id: 17, name: '荷兰 Netherlands', short: '荷兰' },
  { id: 18, name: '加拿大 Canada', short: '加拿大' },
  { id: 19, name: '葡萄牙 Portugal', short: '葡萄牙' },
  { id: 20, name: '摩洛哥 Morocco', short: '摩洛哥' },
  { id: 21, name: '墨西哥 Mexico', short: '墨西哥' },
  { id: 22, name: '意大利 Italy', short: '意大利' },
  { id: 23, name: '乌拉圭 Uruguay', short: '乌拉圭' },
  { id: 24, name: '哥斯达黎加 Costa Rica', short: '哥斯达黎加' },
];

/** 世界杯 2026 比赛数据 */
const MATCHES = [
  // ===== 已结束（6月11日-6月16日） =====
  { id: 1,  leagueId: 1, homeId: 1,  awayId: 2,  date: '2026-06-11', time: '21:00', round: 'A组第1轮', status: 'finished', homeScore: 3, awayScore: 0 },
  { id: 2,  leagueId: 1, homeId: 7,  awayId: 9,  date: '2026-06-11', time: '18:00', round: 'C组第1轮', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 3,  leagueId: 1, homeId: 4,  awayId: 5,  date: '2026-06-12', time: '18:00', round: 'B组第1轮', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 4,  leagueId: 1, homeId: 10, awayId: 11, date: '2026-06-12', time: '21:00', round: 'D组第1轮', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 5,  leagueId: 1, homeId: 13, awayId: 14, date: '2026-06-12', time: '18:00', round: 'E组第1轮', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 6,  leagueId: 1, homeId: 16, awayId: 17, date: '2026-06-13', time: '21:00', round: 'F组第1轮', status: 'finished', homeScore: 0, awayScore: 0 },
  { id: 7,  leagueId: 1, homeId: 19, awayId: 20, date: '2026-06-13', time: '18:00', round: 'G组第1轮', status: 'finished', homeScore: 2, awayScore: 1 },
  { id: 8,  leagueId: 1, homeId: 22, awayId: 23, date: '2026-06-13', time: '21:00', round: 'H组第1轮', status: 'finished', homeScore: 3, awayScore: 0 },
  { id: 9,  leagueId: 1, homeId: 1,  awayId: 3,  date: '2026-06-14', time: '18:00', round: 'A组第2轮', status: 'finished', homeScore: 4, awayScore: 0 },
  { id: 10, leagueId: 1, homeId: 7,  awayId: 8,  date: '2026-06-14', time: '21:00', round: 'C组第2轮', status: 'finished', homeScore: 1, awayScore: 1 },
  { id: 11, leagueId: 1, homeId: 4,  awayId: 6,  date: '2026-06-14', time: '18:00', round: 'B组第2轮', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 12, leagueId: 1, homeId: 10, awayId: 12, date: '2026-06-15', time: '18:00', round: 'D组第2轮', status: 'finished', homeScore: 3, awayScore: 1 },
  { id: 13, leagueId: 1, homeId: 13, awayId: 15, date: '2026-06-15', time: '21:00', round: 'E组第2轮', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 14, leagueId: 1, homeId: 16, awayId: 18, date: '2026-06-15', time: '18:00', round: 'F组第2轮', status: 'finished', homeScore: 1, awayScore: 0 },
  { id: 15, leagueId: 1, homeId: 19, awayId: 21, date: '2026-06-16', time: '18:00', round: 'G组第2轮', status: 'finished', homeScore: 3, awayScore: 0 },
  { id: 16, leagueId: 1, homeId: 22, awayId: 24, date: '2026-06-16', time: '21:00', round: 'H组第2轮', status: 'finished', homeScore: 2, awayScore: 0 },
  { id: 17, leagueId: 1, homeId: 2,  awayId: 3,  date: '2026-06-16', time: '18:00', round: 'A组第2轮', status: 'finished', homeScore: 1, awayScore: 1 },

  // ===== 今日（6月17日） =====
  { id: 18, leagueId: 1, homeId: 5,  awayId: 6,  date: '2026-06-17', time: '18:00', round: 'B组第3轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 19, leagueId: 1, homeId: 8,  awayId: 9,  date: '2026-06-17', time: '21:00', round: 'C组第3轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 20, leagueId: 1, homeId: 11, awayId: 12, date: '2026-06-17', time: '18:00', round: 'D组第3轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 21, leagueId: 1, homeId: 14, awayId: 15, date: '2026-06-17', time: '21:00', round: 'E组第3轮', status: 'upcoming', homeScore: null, awayScore: null },

  // ===== 未来比赛 =====
  { id: 22, leagueId: 1, homeId: 17, awayId: 18, date: '2026-06-18', time: '18:00', round: 'F组第3轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 23, leagueId: 1, homeId: 20, awayId: 21, date: '2026-06-18', time: '21:00', round: 'G组第3轮', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 24, leagueId: 1, homeId: 23, awayId: 24, date: '2026-06-19', time: '18:00', round: 'H组第3轮', status: 'upcoming', homeScore: null, awayScore: null },

  // 淘汰赛
  { id: 25, leagueId: 7, homeId: 1,  awayId: 22, date: '2026-06-28', time: '21:00', round: '1/16决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 26, leagueId: 7, homeId: 4,  awayId: 10, date: '2026-06-29', time: '21:00', round: '1/16决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 27, leagueId: 7, homeId: 7,  awayId: 13, date: '2026-06-30', time: '21:00', round: '1/16决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 28, leagueId: 7, homeId: 16, awayId: 19, date: '2026-07-02', time: '18:00', round: '1/8决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 29, leagueId: 7, homeId: 1,  awayId: 7,  date: '2026-07-07', time: '21:00', round: '1/4决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 30, leagueId: 7, homeId: 4,  awayId: 16, date: '2026-07-08', time: '21:00', round: '1/4决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 31, leagueId: 7, homeId: 1,  awayId: 4,  date: '2026-07-14', time: '21:00', round: '半决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 32, leagueId: 7, homeId: 7,  awayId: 16, date: '2026-07-15', time: '21:00', round: '半决赛', status: 'upcoming', homeScore: null, awayScore: null },
  { id: 33, leagueId: 7, homeId: 1,  awayId: 16, date: '2026-07-19', time: '22:00', round: '决赛', status: 'upcoming', homeScore: null, awayScore: null },
];

/** 工具函数 */
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
  const exactScore = prediction.predictedHomeScore === match.homeScore &&
                     prediction.predictedAwayScore === match.awayScore;
  return {
    outcomeCorrect: actualResult === predictedResult,
    scoreCorrect: exactScore,
    actualResult,
    predictedResult,
  };
}

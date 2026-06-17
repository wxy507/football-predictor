/**
 * 足球比赛数据抓取脚本
 * 使用内置 fetch 从中国可访问的体育网站抓取比赛数据
 * 支持 Node 18+
 */
const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '..', 'js', 'data.js');
async function fetchFrom500() {
  try {
    const res = await fetch('https://trade.500.com/jczq/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept-Language': 'zh-CN,zh;q=0.9' }
    });
    if (!res.ok) return [];
    const html = await res.text();
    const matches = [];
    const trRegex = /<tr[^>]*id="tr_(\d+)"[^>]*>([\s\S]*?)<\/tr>/g;
    let m;
    while ((m = trRegex.exec(html)) !== null) {
      const block = m[2];
      const home = block.match(/<span[^>]*class="[^"]*home[^"]*"[^>]*>([^<]+)<\/span>/);
      const away = block.match(/<span[^>]*class="[^"]*away[^"]*"[^>]*>([^<]+)<\/span>/);
      const score = block.match(/(\d+)\s*:\s*(\d+)/);
      if (home && away) {
        matches.push({ home: home[1].trim(), away: away[1].trim(), homeScore: score ? parseInt(score[1]) : null, awayScore: score ? parseInt(score[2]) : null, status: score ? 'finished' : 'upcoming', source: '500.com' });
      }
    }
    return matches;
  } catch (e) { console.warn('500.com error:', e.message); return []; }
}
async function fetchFromDongqiudi() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(`https://api.dongqiudi.com/data/v1/schedule/${today}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json', 'Origin': 'https://www.dongqiudi.com' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const matches = [];
    for (const league of (data?.league_list || [])) {
      for (const m of (league.matches || [])) {
        matches.push({
          home: m.home_team?.name || '', away: m.away_team?.name || '',
          homeScore: m.home_score ?? null, awayScore: m.away_score ?? null,
          status: m.status === 'completed' ? 'finished' : 'upcoming',
          time: m.time || '', league: league.name || '', source: 'dongqiudi'
        });
      }
    }
    return matches;
  } catch (e) { console.warn('dongqiudi error:', e.message); return []; }
}
async function main() {
  console.log('开始抓取数据...');
  let all = [];
  console.log('1. 尝试懂球帝...');
  all = await fetchFromDongqiudi();
  if (all.length === 0) { console.log('2. 尝试500.com...'); all = await fetchFrom500(); }
  if (all.length === 0) { console.log('⚠ 所有数据源失败'); return; }
  const obj = { matches: all, updatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(__dirname, '..', 'js', 'matches.json'), JSON.stringify(obj, null, 2));
  console.log(`✓ 保存 ${all.length} 场比赛`);
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { fetchFromDongqiudi, fetchFrom500, main };

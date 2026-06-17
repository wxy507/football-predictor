/**
 * 2026世界杯数据抓取脚本
 * 从懂球帝等中国可访问的网站拉取实时比赛数据
 * 运行：node scraper/fetch-matches.js （需要 Node 18+）
 */
const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '..', 'js', 'data.js');
const MATCHES_JSON = path.join(__dirname, '..', 'js', 'matches.json');

async function fetchFromDongqiudi() {
  try {
    // 懂球帝赛事列表页 - 抓取世界杯比赛
    const res = await fetch('https://www.dongqiudi.com/match', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    
    const matches = [];
    // 查找世界杯比赛数据行
    const wcRegex = /世界杯/g;
    let match;
    let lastIdx = 0;
    const results = [];
    
    // 按 "世界杯" 分段提取比赛数据
    let parts = html.split('世界杯');
    for (let i = 1; i < parts.length; i++) {
      const block = parts[i].slice(0, 500);
      
      // 提取主队名、客队名、比分、时间
      const teamRegex = /([\u4e00-\u9fa5a-zA-Z\s]+?)\s+(\d+)\s*-\s*(\d+)/;
      const vsRegex = /([\u4e00-\u9fa5a-zA-Z\s]+?)\s+vs\s+([\u4e00-\u9fa5a-zA-Z\s]+?)(?:\s|$)/;
      const timeRegex = /(\d{2}:\d{2})/;
      
      const tMatch = teamRegex.exec(block);
      const vMatch = vsRegex.exec(block);
      const timeMatch = timeRegex.exec(block);
      
      if (tMatch && timeMatch) {
        results.push({
          home: tMatch[1].trim(),
          away: '',
          homeScore: parseInt(tMatch[2]),
          awayScore: parseInt(tMatch[3]),
          time: timeMatch[1],
          status: 'finished'
        });
      } else if (vMatch && timeMatch) {
        results.push({
          home: vMatch[1].trim(),
          away: vMatch[2].trim(),
          homeScore: null,
          awayScore: null,
          time: timeMatch[1],
          status: 'upcoming'
        });
      }
    }
    return results;
  } catch (e) {
    console.warn('懂球帝抓取失败:', e.message);
    return [];
  }
}

async function main() {
  console.log('开始抓取世界杯数据...');
  let all = await fetchFromDongqiudi();
  
  if (all.length === 0) {
    console.log('⚠ 数据源失败，使用内置数据');
    return;
  }
  
  const obj = { matches: all, updatedAt: new Date().toISOString(), source: 'dongqiudi' };
  fs.writeFileSync(MATCHES_JSON, JSON.stringify(obj, null, 2));
  console.log(`✓ 保存 ${all.length} 场比赛到 js/matches.json`);
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { fetchFromDongqiudi, main };

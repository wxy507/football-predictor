/**
 * 外部数据加载器
 * 启动时尝试加载 scraper 生成的 matches.json
 * 如果成功则用新数据补充内置数据
 */
(async function loadExternalData() {
  try {
    const res = await fetch('js/matches.json');
    if (!res.ok) {
      console.log('无外部数据文件，使用内置数据');
    window.dispatchEvent(new CustomEvent("footballDataUpdated", { detail: { added: addedCount, updated: updatedCount } }));      return;
    }
    const data = await res.json();
    if (!data || !data.matches || !Array.isArray(data.matches) || data.matches.length === 0) return;

    const newMatches = data.matches;
    const teamsByName = {};
    TEAMS.forEach(t => {
      const short = t.short || t.name.split(' ')[0];
      teamsByName[t.name] = t;
      teamsByName[short] = t;
      teamsByName[t.name.toLowerCase()] = t;
    });

    let addedCount = 0;
    let updatedCount = 0;

    for (const nm of newMatches) {
      if (!nm.home || !nm.away) continue;

      // Try to find matching teams
      const homeKey = nm.home.toLowerCase().trim();
      const awayKey = nm.away.toLowerCase().trim();
      let homeId = null, awayId = null;

      for (const [k, t] of Object.entries(teamsByName)) {
        if (k.toLowerCase().includes(homeKey) || homeKey.includes(k.toLowerCase())) {
          homeId = t.id;
        }
        if (k.toLowerCase().includes(awayKey) || awayKey.includes(k.toLowerCase())) {
          awayId = t.id;
        }
      }

      if (!homeId || !awayId) continue;

      const dateStr = nm.date || new Date().toISOString().slice(0, 10);
      const timeStr = nm.time || '00:00';

      // Check if this match exists
      const existing = MATCHES.find(m =>
        m.homeId === homeId && m.awayId === awayId &&
        m.date === dateStr
      );

      if (existing) {
        // Update score if finished
        if (nm.status === 'finished' && nm.homeScore != null && existing.status === 'upcoming') {
          existing.status = 'finished';
          existing.homeScore = nm.homeScore;
          existing.awayScore = nm.awayScore;
          updatedCount++;
        }
      } else if (nm.status === 'upcoming') {
        // Add new upcoming match
        const maxId = Math.max(...MATCHES.map(m => m.id), 0);
        MATCHES.push({
          id: maxId + 1 + addedCount,
          leagueId: 1,
          homeId, awayId,
          date: dateStr,
          time: timeStr,
          round: nm.league || '',
          status: 'upcoming',
          homeScore: null,
          awayScore: null,
        });
        addedCount++;
      }
    }

    localStorage.setItem('fp_last_update', data.updatedAt || new Date().toISOString());
    console.log(`外部数据加载完成: +${addedCount} 新增, ${updatedCount} 更新`);
    window.dispatchEvent(new CustomEvent("footballDataUpdated", { detail: { added: addedCount, updated: updatedCount } }));  } catch (e) {
    console.log('加载外部数据失败，使用内置数据:', e.message);
    window.dispatchEvent(new CustomEvent("footballDataUpdated", { detail: { added: addedCount, updated: updatedCount } }));  }
})();

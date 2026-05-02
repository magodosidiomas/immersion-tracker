/* ════════════════════════════════════════════════════════════
   LIBRARY
   Aba de biblioteca: estatísticas, lista de conteúdos e filtros.
════════════════════════════════════════════════════════════ */

let activeTypeFilter = '', searchQuery = '';

function computeStreak() {
  const contents = getLangContents();
  const studySessions = getLangStudySessions();
  const days = new Set();

  contents.forEach(c => (c.sessions || []).forEach(s => {
    const d = new Date(s.createdAt);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }));
  studySessions.forEach(s => {
    const d = s.date ? new Date(s.date + 'T12:00:00') : new Date(s.createdAt);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  });

  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) { streak++; }
    else if (i === 0) { continue; } // hoje pode estar vazio, checar ontem
    else break;
  }
  return streak;
}

function renderLibrary() {
  const contents = getLangContents();
  const weekStart = getWeekStart();
  const todayStr = new Date().toISOString().slice(0, 10);
  let total = 0, week = 0, today = 0;

  contents.forEach(c => {
    (c.sessions || []).forEach(s => {
      const min = s.durationMin || 0;
      total += min;
      if (new Date(s.createdAt) >= weekStart) week += min;
      const sDate = s.date || new Date(s.createdAt).toISOString().slice(0, 10);
      if (sDate === todayStr) today += min;
    });
  });

  const streak = computeStreak();
  document.getElementById('statTotal').textContent  = fmtMinNoSec(total);
  document.getElementById('statWeek').textContent   = fmtMinNoSec(week);
  document.getElementById('statToday').textContent  = fmtMinNoSec(today);
  document.getElementById('statStreak').textContent = streak;
  const fireEl = document.querySelector('.stat-chip__streak-icon');
  if (fireEl) fireEl.style.opacity = streak > 0 ? '1' : '0.3';

  renderContentList();
}

function renderContentList() {
  const el = document.getElementById('contentList');
  let list = getLangContents();

  if (activeTypeFilter) list = list.filter(c => c.type === activeTypeFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(c => (c.title || '').toLowerCase().includes(q));
  }

  list = [...list].sort((a, b) => {
    const la = a.sessions?.length ? Math.max(...a.sessions.map(s => new Date(s.createdAt))) : new Date(a.createdAt);
    const lb = b.sessions?.length ? Math.max(...b.sessions.map(s => new Date(s.createdAt))) : new Date(b.createdAt);
    return lb - la;
  });

  if (!list.length) {
    const filtered = activeTypeFilter || searchQuery;
    el.innerHTML = `<div class="lib-empty">
      <div class="lib-empty__icon">${filtered ? '🔍' : '📭'}</div>
      <div class="lib-empty__text">${filtered ? 'Nenhum resultado' : 'Nenhum conteúdo ainda'}</div>
      <div class="lib-empty__sub">${filtered ? 'Tente outros filtros' : 'Toque no + para adicionar'}</div>
    </div>`;
    return;
  }

  el.innerHTML = list.map(item => {
    const totalMin = contentTotalMin(item), sess = item.sessions?.length || 0;
    const thumbHtml = item.thumbnail
      ? `<div class="content-card__thumb"><img src="${esc(item.thumbnail)}" alt="" loading="lazy" /></div>`
      : '';
    return `<div class="content-card" data-id="${item.id}" role="button" tabindex="0">
      ${thumbHtml}
      <div class="content-card__left">
        <div class="content-card__top">${typeBadgeHtml(item.type)}</div>
        <div class="content-card__title">${esc(item.title || 'Sem título')}</div>
        <div class="content-card__meta">
          ${totalMin > 0 ? `<span class="content-card__meta-item"><svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>${fmtMin(totalMin)}</span>` : ''}
          ${sess > 0 ? `<span class="content-card__meta-item"><svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z"/></svg>${sess} ${sess === 1 ? 'sessão' : 'sessões'}</span>` : ''}
          ${totalMin === 0 && sess === 0 ? `<span style="color:var(--text-disabled);font-size:12px;">Sem sessões</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('.content-card').forEach(c => {
    c.addEventListener('click', () => openDetail(c.dataset.id));
    c.addEventListener('keydown', e => { if (e.key === 'Enter') openDetail(c.dataset.id); });
  });
}

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  renderContentList();
});

document.getElementById('filterBtn').addEventListener('click', () => {
  const chips = document.getElementById('typeChips');
  const btn   = document.getElementById('filterBtn');
  const open  = chips.style.display === 'none';
  chips.style.display = open ? 'flex' : 'none';
  btn.classList.toggle('active', open);
});

document.getElementById('typeChips').querySelectorAll('.type-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.type-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeTypeFilter = chip.dataset.type;
    const label = chip.dataset.type ? (TYPE_META[chip.dataset.type]?.label || chip.dataset.type) : 'Tipo';
    document.getElementById('filterLabel').textContent = label;
    renderContentList();
  });
});

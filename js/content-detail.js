/* ════════════════════════════════════════════════════════════
   CONTENT DETAIL
   Painel de detalhe de um conteúdo: estatísticas e lista de sessões.
════════════════════════════════════════════════════════════ */

let currentDetailId = null;

function openDetail(id) {
  currentDetailId = id;
  renderDetail(id);
  openPanel('contentDetailModal');
}

function renderDetail(id) {
  const item = getLangContents().find(c => c.id === id);
  if (!item) return;

  document.getElementById('detailTitle').textContent = item.title || 'Sem título';
  const sessions  = item.sessions || [];
  const totalMin  = contentTotalMin(item);
  const sessCount = sessions.length;

  const breakdown = { 'escuta-leitura': 0, escuta: 0, leitura: 0 };
  sessions.forEach(s => {
    const k = s.sub || 'escuta-leitura';
    breakdown[k] = (breakdown[k] || 0) + (s.durationMin || 0);
  });

  const BREAKDOWN_ORDER = ['escuta-leitura', 'escuta', 'leitura'];
  const breakdownHtml = BREAKDOWN_ORDER.map(k => `
    <div class="detail-stat-row">
      <span class="detail-stat-row__label">${SUB_LABELS[k] || k}</span>
      <span class="detail-stat-row__val">${fmtMin(breakdown[k] || 0)}</span>
    </div>`).join('');

  const sessionsListHtml = sessionsGroupedHtml(sessions);

  document.getElementById('detailBody').innerHTML = `
    <div class="detail-hero">
      <div class="detail-type-badge">${typeBadgeHtml(item.type)}</div>
      <h1 class="detail-title">${esc(item.title || 'Sem título')}</h1>
      ${item.link
        ? `<a class="detail-link" href="${esc(item.link)}" target="_blank" rel="noopener">
            <svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            ${esc(item.link.replace(/^https?:\/\//, '').slice(0, 48))}
           </a>`
        : ''}
    </div>
    <div class="detail-stats">
      <div class="detail-stats__label">Estatísticas</div>
      <div class="detail-stats__total">
        <span class="detail-stats__total-val">${fmtMin(totalMin)}</span>
        <span class="detail-stats__total-sessions">${sessCount} ${sessCount === 1 ? 'sessão' : 'sessões'}</span>
      </div>
      <div class="detail-stats__breakdown">${breakdownHtml}</div>
    </div>
    <div class="detail-sessions">
      <div class="detail-sessions__header">
        <span class="detail-sessions__label">Sessões</span>
        <button class="sessions-add-btn" id="detailAddSessionBtn">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> Adicionar
        </button>
      </div>
      ${sessCount === 0 ? `<div class="sessions-empty"><span>Nenhuma sessão ainda</span></div>` : sessionsListHtml}
    </div>`;

  document.getElementById('detailAddSessionBtn').addEventListener('click', () => openSessionForm(null, true));
  document.querySelectorAll('#detailBody .session-item__edit').forEach(btn => {
    btn.addEventListener('click', () => openSessionForm(btn.dataset.sid, true));
  });
}

document.getElementById('detailEditBtn').addEventListener('click', () => {
  if (!currentDetailId) return;
  const item = getLangContents().find(c => c.id === currentDetailId);
  if (item) pendingSessionDraft = [...(item.sessions || [])];
  closePanel('contentDetailModal');
  openContentForm(currentDetailId);
});

document.getElementById('detailBack').addEventListener('click', () => closePanel('contentDetailModal'));

document.getElementById('detailDeleteBtn').addEventListener('click', () => {
  if (!currentDetailId) return;
  const item = getLangContents().find(c => c.id === currentDetailId);
  if (!item) return;
  openConfirm({
    title: 'Excluir conteúdo?',
    body: `"${item.title || 'Sem título'}" e todas as suas sessões serão removidos. Essa ação não pode ser desfeita.`,
    confirmText: 'Remover',
    onConfirm: () => {
      const langId = state.activeLanguage;
      state.contents[langId] = (state.contents[langId] || []).filter(c => c.id !== currentDetailId);
      closePanel('contentDetailModal');
      save(); renderLibrary();
      toast(`"${item.title || 'Conteúdo'}" removido`);
    }
  });
});

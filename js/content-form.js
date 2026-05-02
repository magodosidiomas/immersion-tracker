/* ════════════════════════════════════════════════════════════
   CONTENT FORM
   Painel de adicionar / editar conteúdo (título, link, tipo,
   thumbnail automática via oEmbed YouTube/Spotify).
════════════════════════════════════════════════════════════ */

let editingContentId = null, pendingSessionDraft = [];

const cfEls = {
  title:        document.getElementById('cfTitle'),
  link:         document.getElementById('cfLink'),
  titleError:   document.getElementById('cfTitleError'),
  sessionsList: document.getElementById('cfSessionsList'),
  thumbSection: document.getElementById('cfThumbSection'),
  thumbImg:     document.getElementById('cfThumbImg'),
  linkHint:     document.getElementById('cfLinkHint'),
};

function getContentTypePills() {
  return document.querySelectorAll('#cfTypePills .type-pill');
}

function setActiveContentType(type) {
  getContentTypePills().forEach(p => p.classList.toggle('active', p.dataset.type === type));
}

function getActiveContentType() {
  return document.querySelector('#cfTypePills .type-pill.active')?.dataset.type || 'youtube';
}

function openContentForm(id = null) {
  editingContentId = id;
  pendingSessionDraft = [];
  _pendingThumbnail = '';

  if (id) {
    const item = getLangContents().find(c => c.id === id);
    if (!item) return;
    document.getElementById('contentFormTitle').textContent = 'Editar conteúdo';
    cfEls.link.value  = item.link  || '';
    cfEls.title.value = item.title || '';
    setActiveContentType(item.type);
    pendingSessionDraft = (item.sessions || []).map(s => ({ ...s }));
    _pendingThumbnail = item.thumbnail || '';
    setFormThumb(_pendingThumbnail);
  } else {
    document.getElementById('contentFormTitle').textContent = 'Novo conteúdo';
    cfEls.link.value  = '';
    cfEls.title.value = '';
    setActiveContentType('youtube');
    setFormThumb('');
    setLinkHint(false);
  }
  renderCfSessions();
  openPanel('contentFormModal');
}

document.getElementById('cfTypePills').querySelectorAll('.type-pill').forEach(pill => {
  pill.addEventListener('click', () => setActiveContentType(pill.dataset.type));
});

/* ── Session items dentro do form de conteúdo ── */
function sessionItemHtml(s) {
  const catLabel = CAT_LABELS[s.cat] || s.cat || '';
  const subLabel = SUB_LABELS[s.sub] || s.sub || '';
  let timeStr = '';
  if (s.mode === 'horario' && s.start)
    timeStr = s.end ? `${s.start} — ${s.end}` : `${s.start} — em andamento`;
  else
    timeStr = fmtSec(Math.round((s.durationMin || 0) * 60));
  return `<div class="session-item">
    <div class="session-item__left">
      <div class="session-item__time">${timeStr}</div>
      <div class="session-item__meta">${catLabel}${subLabel ? ' • ' + subLabel : ''}</div>
    </div>
    <button class="session-item__edit" data-sid="${s.id}" aria-label="Editar sessão">
      <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
    </button>
  </div>`;
}

function sessionsGroupedHtml(sessions) {
  const groups = {};
  sessions.forEach(s => {
    const d = s.date || new Date(s.createdAt).toISOString().slice(0, 10);
    if (!groups[d]) groups[d] = [];
    groups[d].push(s);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0])).map(([d, list]) => `
    <div class="session-day-group">
      <div class="session-day-label">${fmtPtDateLabel(d)}</div>
      <div class="session-day-card">${list.map(s => sessionItemHtml(s)).join('')}</div>
    </div>`).join('');
}

function renderCfSessions() {
  const el = cfEls.sessionsList;
  if (!pendingSessionDraft.length) {
    el.innerHTML = `<div class="sessions-empty"><span>Nenhuma sessão ainda</span></div>`;
    return;
  }
  el.innerHTML = sessionsGroupedHtml(pendingSessionDraft);
  el.querySelectorAll('.session-item__edit').forEach(btn => {
    btn.addEventListener('click', () => openSessionForm(btn.dataset.sid, false));
  });
}

document.getElementById('cfAddSessionBtn').addEventListener('click', () => openSessionForm(null, false));

function closeContentForm() { closePanel('contentFormModal'); }

function saveContentForm() {
  const title = cfEls.title.value.trim();
  const link  = cfEls.link.value.trim();
  const type  = getActiveContentType();

  if (!title) {
    cfEls.title.classList.add('text-field--error');
    cfEls.titleError.classList.add('visible');
    cfEls.title.focus();
    return;
  }

  const langId = state.activeLanguage;
  if (!state.contents[langId]) state.contents[langId] = [];

  if (editingContentId) {
    const idx = state.contents[langId].findIndex(c => c.id === editingContentId);
    if (idx > -1)
      state.contents[langId][idx] = {
        ...state.contents[langId][idx],
        title, link, type, thumbnail: _pendingThumbnail,
        sessions: pendingSessionDraft, updatedAt: new Date().toISOString()
      };
    save(); closeContentForm(); renderLibrary();
    toast('Conteúdo atualizado');
  } else {
    state.contents[langId].unshift({
      id: uid(), title, link, type, thumbnail: _pendingThumbnail,
      sessions: pendingSessionDraft, createdAt: new Date().toISOString()
    });
    save(); closeContentForm(); renderLibrary();
    toast('Conteúdo adicionado');
  }
}

cfEls.title.addEventListener('input', () => {
  cfEls.title.classList.remove('text-field--error');
  cfEls.titleError.classList.remove('visible');
});

document.getElementById('contentFormSave').addEventListener('click', saveContentForm);
document.getElementById('contentFormSaveBtn').addEventListener('click', saveContentForm);
document.getElementById('contentFormBack').addEventListener('click', closeContentForm);
document.getElementById('contentFormCancelBtn').addEventListener('click', closeContentForm);

/* ── Auto-detecção de link (YouTube / Spotify) ── */
function extractYtId(url) {
  try {
    const u = new URL(url.trim());
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    if (!u.hostname.includes('youtube.com') && !u.hostname.includes('music.youtube.com')) return null;
    const shorts = u.pathname.match(/\/shorts\/([^/?]+)/);
    if (shorts) return shorts[1];
    return u.searchParams.get('v');
  } catch {}
  return null;
}

function isYouTubeUrl(url) {
  try { const h = new URL(url.trim()).hostname; return h === 'youtu.be' || h.includes('youtube.com'); }
  catch { return false; }
}

function isSpotifyUrl(url) {
  try { return new URL(url.trim()).hostname.includes('spotify.com'); }
  catch { return false; }
}

function setFormThumb(url) {
  if (url) { cfEls.thumbImg.src = url; cfEls.thumbSection.style.display = 'block'; }
  else      { cfEls.thumbImg.src = ''; cfEls.thumbSection.style.display = 'none'; }
}

function setLinkHint(visible) { cfEls.linkHint.classList.toggle('visible', visible); }

let _fetchController = null;
let _pendingThumbnail = '';

function onLinkChange() {
  const url     = cfEls.link.value.trim();
  const titleEl = cfEls.title;

  if (_fetchController) { _fetchController.abort(); _fetchController = null; }
  if (!url) { _pendingThumbnail = ''; setFormThumb(''); setLinkHint(false); return; }

  if (isYouTubeUrl(url)) {
    setLinkHint(false);
    const ytId = extractYtId(url);
    if (!ytId) { _pendingThumbnail = ''; setFormThumb(''); return; }
    setActiveContentType('youtube');
    _pendingThumbnail = ''; setFormThumb('');
    _fetchController = new AbortController();
    if (!titleEl.value.trim()) titleEl.placeholder = 'Buscando título...';
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { signal: _fetchController.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (data.title && !titleEl.value.trim()) titleEl.value = data.title;
        if (data.thumbnail_url) { _pendingThumbnail = data.thumbnail_url; setFormThumb(data.thumbnail_url); }
        titleEl.placeholder = 'Nome do conteúdo';
      })
      .catch(err => { if (err.name !== 'AbortError') titleEl.placeholder = 'Nome do conteúdo'; });
    return;
  }

  if (isSpotifyUrl(url)) {
    setLinkHint(false);
    setActiveContentType('podcast');
    _pendingThumbnail = ''; setFormThumb('');
    _fetchController = new AbortController();
    if (!titleEl.value.trim()) titleEl.placeholder = 'Buscando título...';
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { signal: _fetchController.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (data.title && !titleEl.value.trim()) titleEl.value = data.title;
        if (data.thumbnail_url) { _pendingThumbnail = data.thumbnail_url; setFormThumb(data.thumbnail_url); }
        titleEl.placeholder = 'Nome do conteúdo';
      })
      .catch(err => { if (err.name !== 'AbortError') titleEl.placeholder = 'Nome do conteúdo'; });
    return;
  }

  _pendingThumbnail = ''; setFormThumb(''); setLinkHint(true);
}

const cfLinkEl = cfEls.link;
let _linkPrev = '', _linkPollTimer = null;
function _pollLink() { const c = cfLinkEl.value; if (c !== _linkPrev) { _linkPrev = c; onLinkChange(); } }
cfLinkEl.addEventListener('input',  () => { _linkPrev = cfLinkEl.value; onLinkChange(); });
cfLinkEl.addEventListener('paste',  () => setTimeout(() => { _linkPrev = cfLinkEl.value; onLinkChange(); }, 100));
cfLinkEl.addEventListener('change', () => { _linkPrev = cfLinkEl.value; onLinkChange(); });
cfLinkEl.addEventListener('focus',  () => { _linkPollTimer = setInterval(_pollLink, 400); });
cfLinkEl.addEventListener('blur',   () => { clearInterval(_linkPollTimer); _pollLink(); });

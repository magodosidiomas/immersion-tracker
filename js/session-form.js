/* ════════════════════════════════════════════════════════════
   SESSION FORM
   Formulário de sessão de imersão (vinculada a um conteúdo).
   detailMode=true  → salva direto no conteúdo (state)
   detailMode=false → adiciona ao pendingSessionDraft
════════════════════════════════════════════════════════════ */

let editingSessionId = null, sessionDetailMode = false;

function openSessionForm(sessionId = null, detailMode = false) {
  editingSessionId  = sessionId;
  sessionDetailMode = detailMode;
  document.getElementById('sessionFormTitle').textContent = sessionId ? 'Editar sessão' : 'Nova sessão';

  if (sessionId) {
    const pool = detailMode
      ? (getLangContents().find(c => c.id === currentDetailId)?.sessions || [])
      : pendingSessionDraft;
    const s = pool.find(x => x.id === sessionId);
    if (!s) return;
    document.getElementById('sfDate').value = s.date || new Date().toISOString().slice(0, 10);
    document.querySelectorAll('#sfCatPills .cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === s.cat));
    document.querySelectorAll('#sfSubPills .cat-pill').forEach(p => p.classList.toggle('active', p.dataset.sub === s.sub));
    setSessionMode(s.mode || 'horario');
    if (s.mode === 'horario') {
      document.getElementById('sfStart').value = s.start || '';
      document.getElementById('sfEnd').value   = s.end   || '';
    } else {
      const _totalSec = Math.round((s.durationMin || 0) * 60);
      document.getElementById('sfHoras').value    = Math.floor(_totalSec / 3600);
      document.getElementById('sfMinutos').value  = Math.floor((_totalSec % 3600) / 60);
      document.getElementById('sfSegundos').value = _totalSec % 60;
    }
  } else {
    document.getElementById('sfDate').value = new Date().toISOString().slice(0, 10);
    document.querySelectorAll('#sfCatPills .cat-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    document.querySelectorAll('#sfSubPills .cat-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    setSessionMode('duracao');
    const now = new Date();
    document.getElementById('sfStart').value    = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    document.getElementById('sfEnd').value      = '';
    document.getElementById('sfHoras').value    = '';
    document.getElementById('sfMinutos').value  = '';
    document.getElementById('sfSegundos').value = '';
    document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'));
  }
  openPanel('sessionFormModal');
}

function closeSessionForm() { closePanel('sessionFormModal', true); }

function setSessionMode(mode) {
  document.querySelectorAll('#sfSegmented .segmented__btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('sfHorarioSection').style.display = mode === 'horario' ? '' : 'none';
  document.getElementById('sfDuracaoSection').style.display = mode === 'duracao' ? '' : 'none';
}

document.getElementById('sfSegmented').querySelectorAll('.segmented__btn').forEach(btn => {
  btn.addEventListener('click', () => setSessionMode(btn.dataset.mode));
});

document.getElementById('sfCatPills').querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#sfCatPills .cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

document.getElementById('sfSubPills').querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#sfSubPills .cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

document.getElementById('sfQuickChips').querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const min = +chip.dataset.min;
    document.getElementById('sfHoras').value    = Math.floor(min / 60) || '';
    document.getElementById('sfMinutos').value  = min % 60 || '';
    document.getElementById('sfSegundos').value = '';
  });
});

['sfHoras', 'sfMinutos', 'sfSegundos'].forEach((id, idx, arr) => {
  const el  = document.getElementById(id);
  const max = id === 'sfHoras' ? 23 : 59;
  el.addEventListener('input', () => document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active')));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = arr[idx + 1];
      if (next) document.getElementById(next).focus();
      else document.getElementById('sfSaveBtn').focus();
    }
  });
  el.addEventListener('blur', () => {
    let v = parseInt(el.value);
    if (isNaN(v) || v < 0) v = 0;
    if (v > max) {
      const parsed = parseInt(String(v).replace(/^0+/, '') || '0');
      v = Math.min(parsed > max ? max : parsed, max);
    }
    el.value = v === 0 ? '' : v;
  });
  el.addEventListener('focus', () => setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150));
});

document.getElementById('sfSaveBtn').addEventListener('click', () => {
  const mode = document.querySelector('#sfSegmented .segmented__btn.active').dataset.mode;
  const cat  = document.querySelector('#sfCatPills .cat-pill.active')?.dataset.cat || 'imersao';
  const sub  = document.querySelector('#sfSubPills .cat-pill.active')?.dataset.sub || 'escuta-leitura';
  const date = document.getElementById('sfDate').value || new Date().toISOString().slice(0, 10);
  let durationMin = 0, start = '', end = '';

  if (mode === 'horario') {
    start = document.getElementById('sfStart').value;
    end   = document.getElementById('sfEnd').value;
    if (start && end) {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      durationMin = (eh * 60 + em) - (sh * 60 + sm);
      if (durationMin < 0) durationMin += 24 * 60;
    }
  } else {
    const _h = parseInt(document.getElementById('sfHoras').value)    || 0;
    const _m = parseInt(document.getElementById('sfMinutos').value)   || 0;
    const _s = parseInt(document.getElementById('sfSegundos').value)  || 0;
    durationMin = (_h * 3600 + _m * 60 + _s) / 60;
  }

  if (sessionDetailMode) {
    const langId = state.activeLanguage;
    const idx    = state.contents[langId].findIndex(c => c.id === currentDetailId);
    if (idx > -1) {
      if (!state.contents[langId][idx].sessions) state.contents[langId][idx].sessions = [];
      if (editingSessionId) {
        const si = state.contents[langId][idx].sessions.findIndex(s => s.id === editingSessionId);
        if (si > -1)
          state.contents[langId][idx].sessions[si] = {
            ...state.contents[langId][idx].sessions[si],
            mode, cat, sub, start, end, durationMin, date
          };
      } else {
        state.contents[langId][idx].sessions.push({
          id: uid(), mode, cat, sub, start, end, durationMin, date,
          createdAt: new Date().toISOString()
        });
      }
      save(); closeSessionForm(); renderDetail(currentDetailId); renderLibrary();
      toast(editingSessionId ? 'Sessão atualizada' : 'Sessão adicionada');
    }
  } else {
    if (editingSessionId) {
      const si = pendingSessionDraft.findIndex(s => s.id === editingSessionId);
      if (si > -1)
        pendingSessionDraft[si] = { ...pendingSessionDraft[si], mode, cat, sub, start, end, durationMin, date };
    } else {
      pendingSessionDraft.push({
        id: uid(), mode, cat, sub, start, end, durationMin, date,
        createdAt: new Date().toISOString()
      });
    }
    closeSessionForm(); renderCfSessions();
    toast(editingSessionId ? 'Sessão atualizada' : 'Sessão adicionada');
  }
});

document.getElementById('sfCancelBtn').addEventListener('click', closeSessionForm);
document.getElementById('sessionFormBack').addEventListener('click', closeSessionForm);

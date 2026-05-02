/* ════════════════════════════════════════════════════════════
   STUDY VIEW + STUDY SESSION FORM
   Aba de estudo (sessões standalone) e formulário correspondente.
════════════════════════════════════════════════════════════ */

/* ── Render da aba ── */
function renderStudyView() {
  const sessions  = getLangStudySessions();
  const weekStart = getWeekStart();
  const todayStr  = new Date().toISOString().slice(0, 10);
  let total = 0, week = 0, today = 0;

  sessions.forEach(s => {
    const min   = s.durationMin || 0;
    const sDate = s.date || new Date(s.createdAt).toISOString().slice(0, 10);
    total += min;
    if (new Date(sDate + 'T12:00:00') >= weekStart) week += min;
    if (sDate === todayStr) today += min;
  });

  const streak = computeStreak();
  document.getElementById('studyStatTotal').textContent  = fmtMinNoSec(total);
  document.getElementById('studyStatWeek').textContent   = fmtMinNoSec(week);
  document.getElementById('studyStatToday').textContent  = fmtMinNoSec(today);
  document.getElementById('studyStatStreak').textContent = streak;
  const fireEl = document.querySelector('#studyView .stat-chip__streak-icon');
  if (fireEl) fireEl.style.opacity = streak > 0 ? '1' : '0.3';

  const el = document.getElementById('studySessionsList');
  if (!sessions.length) {
    el.innerHTML = `<div class="study-empty">
      <div class="study-empty__icon">✏️</div>
      <div class="study-empty__text">Nenhuma sessão ainda</div>
      <div class="study-empty__sub">Toque no + para registrar seu primeiro estudo.</div>
    </div>`;
    return;
  }

  const groups = {};
  sessions.forEach(s => {
    const d = s.date || new Date(s.createdAt).toISOString().slice(0, 10);
    if (!groups[d]) groups[d] = [];
    groups[d].push(s);
  });

  el.innerHTML = Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([d, list]) => {
      const itemsHtml = list.map(s => {
        const catLabel  = CAT_LABELS[s.cat] || s.cat || '';
        const subLabel  = SUB_LABELS[s.sub] || s.sub || '';
        const timeStr   = s.mode === 'horario' && s.start
          ? (s.end ? `${s.start} — ${s.end}` : `${s.start} — em andamento`)
          : fmtSec(Math.round((s.durationMin || 0) * 60));
        const notesHtml = s.notes ? `<div class="study-session-item__notes">${esc(s.notes)}</div>` : '';
        return `<div class="study-session-item">
          <div class="study-session-item__left">
            <div class="study-session-item__header">
              ${esc(catLabel)}
              ${subLabel ? `<span class="study-session-item__sep">•</span><span class="study-session-item__sub-text">${esc(subLabel)}</span>` : ''}
            </div>
            <div class="study-session-item__time">${timeStr}</div>
            ${notesHtml}
          </div>
          <button class="study-session-item__edit" data-sid="${s.id}" aria-label="Editar sessão">
            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
        </div>`;
      }).join('');
      return `<div class="study-day-group">
        <div class="study-day-label">${fmtPtDateLabel(d)}</div>
        <div class="study-day-card">${itemsHtml}</div>
      </div>`;
    }).join('');

  el.querySelectorAll('.study-session-item__edit').forEach(btn => {
    btn.addEventListener('click', () => openStudySessionForm(btn.dataset.sid));
  });
}

/* ── Study session form ── */
let editingStudySessionId = null;

function ssfRenderSubs(cat, activeSub) {
  const pills = document.getElementById('ssfSubPills');
  const opts  = SSF_SUBS[cat] || SSF_SUBS.estudo;
  pills.innerHTML = opts.map((o, i) =>
    `<button class="cat-pill${(!activeSub && i === 0) || activeSub === o.value ? ' active' : ''}" data-sub="${o.value}">${o.label}</button>`
  ).join('');
  pills.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

function setStudySessionMode(mode) {
  document.querySelectorAll('#ssfSegmented .segmented__btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('ssfHorarioSection').style.display = mode === 'horario' ? '' : 'none';
  document.getElementById('ssfDuracaoSection').style.display = mode === 'duracao' ? '' : 'none';
}

function openStudySessionForm(sessionId = null) {
  editingStudySessionId = sessionId;
  document.getElementById('studySessionFormTitle').textContent = sessionId ? 'Editar sessão' : 'Nova sessão de estudo';

  if (sessionId) {
    const s = getLangStudySessions().find(x => x.id === sessionId);
    if (!s) return;
    document.getElementById('ssfDate').value  = s.date  || new Date().toISOString().slice(0, 10);
    document.getElementById('ssfNotes').value = s.notes || '';
    document.querySelectorAll('#ssfCatPills .cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === s.cat));
    ssfRenderSubs(s.cat || 'estudo', s.sub);
    setStudySessionMode(s.mode || 'duracao');
    if (s.mode === 'horario') {
      document.getElementById('ssfStart').value = s.start || '';
      document.getElementById('ssfEnd').value   = s.end   || '';
    } else {
      const _totalSec = Math.round((s.durationMin || 0) * 60);
      document.getElementById('ssfHoras').value    = Math.floor(_totalSec / 3600)        || '';
      document.getElementById('ssfMinutos').value  = Math.floor((_totalSec % 3600) / 60) || '';
      document.getElementById('ssfSegundos').value = _totalSec % 60                      || '';
    }
  } else {
    document.getElementById('ssfDate').value    = new Date().toISOString().slice(0, 10);
    document.getElementById('ssfNotes').value   = '';
    document.querySelectorAll('#ssfCatPills .cat-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    ssfRenderSubs('estudo', null);
    setStudySessionMode('duracao');
    document.getElementById('ssfHoras').value    = '';
    document.getElementById('ssfMinutos').value  = '';
    document.getElementById('ssfSegundos').value = '';
    document.getElementById('ssfStart').value    = '';
    document.getElementById('ssfEnd').value      = '';
    document.querySelectorAll('#ssfQuickChips .quick-chip').forEach(c => c.classList.remove('active'));
  }
  openPanel('studySessionFormModal');
}

function closeStudySessionForm() { closePanel('studySessionFormModal'); }

document.getElementById('ssfCatPills').querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#ssfCatPills .cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    ssfRenderSubs(pill.dataset.cat, null);
  });
});

document.getElementById('ssfSegmented').querySelectorAll('.segmented__btn').forEach(btn => {
  btn.addEventListener('click', () => setStudySessionMode(btn.dataset.mode));
});

document.getElementById('ssfQuickChips').querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#ssfQuickChips .quick-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const min = +chip.dataset.min;
    document.getElementById('ssfHoras').value    = Math.floor(min / 60) || '';
    document.getElementById('ssfMinutos').value  = min % 60 || '';
    document.getElementById('ssfSegundos').value = '';
  });
});

['ssfHoras', 'ssfMinutos', 'ssfSegundos'].forEach((id, idx, arr) => {
  const el  = document.getElementById(id);
  const max = id === 'ssfHoras' ? 23 : 59;
  el.addEventListener('input', () => document.querySelectorAll('#ssfQuickChips .quick-chip').forEach(c => c.classList.remove('active')));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = arr[idx + 1];
      if (next) document.getElementById(next).focus();
      else document.getElementById('ssfSaveBtn').focus();
    }
  });
  el.addEventListener('blur', () => {
    let v = parseInt(el.value);
    if (isNaN(v) || v < 0) v = 0;
    if (v > max) v = max;
    el.value = v === 0 ? '' : v;
  });
  el.addEventListener('focus', () => setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150));
});

document.getElementById('ssfSaveBtn').addEventListener('click', () => {
  const mode  = document.querySelector('#ssfSegmented .segmented__btn.active').dataset.mode;
  const cat   = document.querySelector('#ssfCatPills .cat-pill.active')?.dataset.cat || 'estudo';
  const sub   = document.querySelector('#ssfSubPills .cat-pill.active')?.dataset.sub || '';
  const date  = document.getElementById('ssfDate').value || new Date().toISOString().slice(0, 10);
  const notes = document.getElementById('ssfNotes').value.trim();
  let durationMin = 0, start = '', end = '';

  if (mode === 'horario') {
    start = document.getElementById('ssfStart').value;
    end   = document.getElementById('ssfEnd').value;
    if (start && end) {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      durationMin = (eh * 60 + em) - (sh * 60 + sm);
      if (durationMin < 0) durationMin += 24 * 60;
    }
  } else {
    const _h = parseInt(document.getElementById('ssfHoras').value)    || 0;
    const _m = parseInt(document.getElementById('ssfMinutos').value)   || 0;
    const _s = parseInt(document.getElementById('ssfSegundos').value)  || 0;
    durationMin = (_h * 3600 + _m * 60 + _s) / 60;
  }

  const langId = state.activeLanguage;
  if (!state.studySessions[langId]) state.studySessions[langId] = [];

  if (editingStudySessionId) {
    const idx = state.studySessions[langId].findIndex(s => s.id === editingStudySessionId);
    if (idx > -1)
      state.studySessions[langId][idx] = {
        ...state.studySessions[langId][idx],
        mode, cat, sub, start, end, durationMin, date, notes
      };
    save(); closeStudySessionForm(); renderStudyView();
    toast('Sessão atualizada');
  } else {
    state.studySessions[langId].push({
      id: uid(), mode, cat, sub, start, end, durationMin, date, notes,
      createdAt: new Date().toISOString()
    });
    save(); closeStudySessionForm(); renderStudyView();
    toast('Sessão adicionada');
  }
});

document.getElementById('ssfCancelBtn').addEventListener('click', closeStudySessionForm);
document.getElementById('studySessionFormBack').addEventListener('click', closeStudySessionForm);

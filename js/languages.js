/* ════════════════════════════════════════════════════════════
   LANGUAGES
   Tudo relacionado a adicionar, trocar e gerenciar idiomas:
   dropdown desktop, modal mobile (switch), modal add, modal manage.
════════════════════════════════════════════════════════════ */

/* ── Dropdown (desktop) ── */
let ddOpen = false;

function renderDD() {
  const list = document.getElementById('ddList');
  if (!state.userLanguages.length) {
    list.innerHTML = '<div class="dd-empty">Nenhum idioma adicionado ainda.</div>';
    return;
  }
  list.innerHTML = state.userLanguages.map(l => `
    <div class="dd-row ${l.id === state.activeLanguage ? 'active' : ''}" data-id="${l.id}" role="option" aria-selected="${l.id === state.activeLanguage}" tabindex="0">
      <span class="dd-row__flag">${l.flag}</span>
      <span class="dd-row__name">${l.name}</span>
      ${l.id === state.activeLanguage
        ? '<svg class="icon dd-row__check" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
        : ''}
    </div>`).join('');
  list.querySelectorAll('.dd-row').forEach(el =>
    el.addEventListener('click', () => { pickLang(el.dataset.id); closeDD(); })
  );
}

function openDD()  {
  renderDD();
  document.getElementById('langDropdown').classList.add('open');
  document.getElementById('langTrigger').classList.add('active');
  document.getElementById('langTrigger').setAttribute('aria-expanded', 'true');
  ddOpen = true;
}

function closeDD() {
  document.getElementById('langDropdown').classList.remove('open');
  document.getElementById('langTrigger').classList.remove('active');
  document.getElementById('langTrigger').setAttribute('aria-expanded', 'false');
  ddOpen = false;
}

document.getElementById('langTrigger').addEventListener('click', () => {
  if (desktop()) {
    ddOpen ? closeDD() : openDD();
  } else {
    if (!state.userLanguages.length) { renderAdd(); openModal('addModal'); }
    else { renderSwitch(); openModal('switchModal'); }
  }
});

document.addEventListener('click', e => {
  if (!document.querySelector('.lang-wrap').contains(e.target)) closeDD();
});

document.getElementById('ddAddBtn').addEventListener('click', () => { closeDD(); renderAdd(); openModal('addModal'); });
document.getElementById('ddManageBtn').addEventListener('click', () => { closeDD(); renderManage(); openModal('manageModal'); });

function pickLang(id) {
  state.activeLanguage = id;
  save();
  syncTopbar();
  const l = getLang(id);
  toast(`${l.flag} ${l.name} selecionado`);
}

/* ── Switch modal (mobile) ── */
function renderSwitch() {
  document.getElementById('switchList').innerHTML = state.userLanguages.map(l => `
    <div class="sw-row ${l.id === state.activeLanguage ? 'active' : ''}" data-id="${l.id}" tabindex="0" role="option" aria-selected="${l.id === state.activeLanguage}">
      <span class="sw-row__flag">${l.flag}</span><span class="sw-row__name">${l.name}</span>
      ${l.id === state.activeLanguage
        ? '<svg class="icon sw-row__check" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
        : ''}
    </div>`).join('');
  document.querySelectorAll('.sw-row').forEach(el =>
    el.addEventListener('click', () => { pickLang(el.dataset.id); closeModal('switchModal'); })
  );
}
document.getElementById('switchAddBtn').addEventListener('click', () => { closeModal('switchModal'); renderAdd(); openModal('addModal'); });
document.getElementById('switchManageBtn').addEventListener('click', () => { closeModal('switchModal'); renderManage(); openModal('manageModal'); });

/* ── Add modal ── */
function renderAdd() {
  const added = new Set(state.userLanguages.map(l => l.id));
  document.getElementById('addList').innerHTML = ALL_LANGUAGES.map(l => `
    <div class="al-row ${added.has(l.id) ? 'added' : ''}" data-id="${l.id}" role="option" aria-selected="${added.has(l.id)}" tabindex="0">
      <span class="al-row__flag">${l.flag}</span><span class="al-row__name">${l.name}</span>
      ${added.has(l.id) ? '<span class="al-row__badge">Adicionado</span>' : ''}
    </div>`).join('');

  document.querySelectorAll('.al-row:not(.added)').forEach(el => {
    el.addEventListener('click', () => addLang(el.dataset.id));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') addLang(el.dataset.id); });
  });
  document.querySelectorAll('.al-row.added').forEach(el => {
    el.addEventListener('click', () => { closeModal('addModal'); renderManage(); openModal('manageModal'); });
    el.title = 'Ir para Gerenciar idiomas para remover';
  });
}

document.getElementById('addModalManageBtn').addEventListener('click', () => { closeModal('addModal'); renderManage(); openModal('manageModal'); });

function addLang(id) {
  const l = ALL_LANGUAGES.find(x => x.id === id);
  if (!l || state.userLanguages.find(x => x.id === id)) return;
  state.userLanguages.push({ ...l });
  if (!state.activeLanguage) state.activeLanguage = id;
  save(); syncTopbar(); renderAdd(); renderDD();
  toast(`${l.flag} ${l.name} adicionado`);
}

document.getElementById('addCloseBtn').addEventListener('click', () => closeModal('addModal'));
document.getElementById('emptyAddBtn').addEventListener('click', () => { renderAdd(); openModal('addModal'); });

/* ── Manage modal ── */
let dragSrc = null;

function renderManage() {
  const el = document.getElementById('manageList');
  if (!state.userLanguages.length) {
    el.innerHTML = '<div style="padding:16px;font-size:14px;color:var(--text-secondary);">Nenhum idioma adicionado.</div>';
    return;
  }
  el.innerHTML = state.userLanguages.map((l, i) => `
    <div class="mg-row" draggable="true" data-idx="${i}" data-id="${l.id}">
      <span class="mg-row__drag"><svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></span>
      <span class="mg-row__flag">${l.flag}</span>
      <span class="mg-row__name">${l.name}</span>
      <button class="mg-row__delete" data-id="${l.id}" aria-label="Remover ${l.name}"><svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:inline-block;vertical-align:middle"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
    </div>`).join('');

  el.querySelectorAll('.mg-row__delete').forEach(btn =>
    btn.addEventListener('click', () => {
      const l = getLang(btn.dataset.id);
      askDelete(btn.dataset.id, l.name);
    })
  );

  el.querySelectorAll('.mg-row').forEach(row => {
    row.addEventListener('dragstart', e => {
      dragSrc = +row.dataset.idx;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => row.style.opacity = '.4', 0);
    });
    row.addEventListener('dragend', () => {
      row.style.opacity = '';
      el.querySelectorAll('.mg-row').forEach(r => r.classList.remove('drag-over'));
    });
    row.addEventListener('dragover', e => {
      e.preventDefault();
      el.querySelectorAll('.mg-row').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });
    row.addEventListener('drop', e => {
      e.preventDefault();
      const ti = +row.dataset.idx;
      if (dragSrc === null || dragSrc === ti) return;
      const [m] = state.userLanguages.splice(dragSrc, 1);
      state.userLanguages.splice(ti, 0, m);
      dragSrc = null;
      save(); renderManage();
    });
  });
}

document.getElementById('manageDoneBtn').addEventListener('click', () => { closeModal('manageModal'); renderDD(); });

/* ── Confirm delete language ── */
let pendingDeleteId = null;

function askDelete(id, name) {
  pendingDeleteId = id;
  openConfirm({
    title: `Remover ${name}?`,
    body: `Você perderá todos os dados de "${name}". Essa ação não pode ser desfeita.`,
    confirmText: 'Remover',
    onCancel: () => { pendingDeleteId = null; },
    onConfirm: () => {
      if (!pendingDeleteId) return;
      const l = getLang(pendingDeleteId);
      state.userLanguages = state.userLanguages.filter(x => x.id !== pendingDeleteId);
      if (state.activeLanguage === pendingDeleteId)
        state.activeLanguage = state.userLanguages[0]?.id || null;
      pendingDeleteId = null;
      save(); syncTopbar(); renderManage(); renderDD();
      toast(`${l.flag} ${l.name} removido`);
    }
  });
}

/* ════════════════════════════════════════════════════════════
   TOPBAR / TABS / FAB
   Sincroniza a barra superior, troca de abas e o botão flutuante.
════════════════════════════════════════════════════════════ */

let activeTab = 'library';

function syncTopbar() {
  const lang = state.activeLanguage ? getLang(state.activeLanguage) : null;
  document.getElementById('currentFlag').textContent = lang ? lang.flag : '🌐';
  document.getElementById('currentName').textContent = lang ? lang.name : 'Idioma';

  const has = state.userLanguages.length > 0;
  document.getElementById('emptyState').style.display = has ? 'none' : 'flex';
  document.getElementById('tabbar').classList.toggle('visible', has);
  document.getElementById('libraryView').classList.toggle('visible',   has && activeTab === 'library');
  document.getElementById('studyView').classList.toggle('visible',     has && activeTab === 'study');
  document.getElementById('dashboardView').classList.toggle('visible', has && activeTab === 'dashboard');
  updateFab();

  if (has) {
    if      (activeTab === 'library')   renderLibrary();
    else if (activeTab === 'study')     renderStudyView();
    else if (activeTab === 'dashboard') renderDashboard();
  }
}

function updateFab() {
  const has = state.userLanguages.length > 0;
  const fab = document.getElementById('fabBtn');
  const fabLabel = document.getElementById('fabLabel');

  if (!has || activeTab === 'dashboard') { fab.style.display = 'none'; return; }

  fab.style.display = 'flex';
  if (activeTab === 'library') {
    fab.classList.remove('fab--study');
    fabLabel.textContent = 'Adicionar conteúdo';
    fab.setAttribute('aria-label', 'Adicionar conteúdo');
  } else if (activeTab === 'study') {
    fab.classList.add('fab--study');
    fabLabel.textContent = 'Adicionar sessão';
    fab.setAttribute('aria-label', 'Adicionar sessão de estudo');
  }
}

function switchTab(tab) {
  activeTab = tab;
  ['library', 'study', 'dashboard'].forEach(t => {
    document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`).classList.toggle('active', tab === t);
    document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`).setAttribute('aria-selected', tab === t);
    document.getElementById(`${t}View`).classList.toggle('visible', tab === t);
  });
  updateFab();
  if      (tab === 'library')   renderLibrary();
  else if (tab === 'study')     renderStudyView();
  else if (tab === 'dashboard') renderDashboard();
}

document.getElementById('tabLibrary').addEventListener('click',   () => switchTab('library'));
document.getElementById('tabStudy').addEventListener('click',     () => switchTab('study'));
document.getElementById('tabDashboard').addEventListener('click', () => switchTab('dashboard'));

document.getElementById('settingsBtn').addEventListener('click', () => openPanel('settingsPage'));
document.getElementById('settingsBack').addEventListener('click', () => closePanel('settingsPage'));

// FAB: ação contextual dependendo da aba ativa
document.getElementById('fabBtn').addEventListener('click', () => {
  if (activeTab === 'library') openContentForm();
  else if (activeTab === 'study') openStudySessionForm();
});

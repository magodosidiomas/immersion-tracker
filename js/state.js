/* ════════════════════════════════════════════════════════════
   STATE
   Carrega e salva os dados do usuário no localStorage.
════════════════════════════════════════════════════════════ */

function loadState() {
  try {
    const r = localStorage.getItem('imerso_v2');
    if (r) {
      const s = JSON.parse(r);
      if (!s.contents) s.contents = {};
      if (!s.studySessions) s.studySessions = {};
      return s;
    }
  } catch {}
  return { userLanguages: [], activeLanguage: null, contents: {}, studySessions: {} };
}

function save() {
  localStorage.setItem('imerso_v2', JSON.stringify(state));
}

let state = loadState();
if (!state.studySessions) state.studySessions = {};

// Helpers para acessar dados do idioma ativo
function getLangContents() {
  const id = state.activeLanguage; if (!id) return [];
  if (!state.contents[id]) state.contents[id] = [];
  return state.contents[id];
}

function getLangStudySessions() {
  const id = state.activeLanguage; if (!id) return [];
  if (!state.studySessions[id]) state.studySessions[id] = [];
  return state.studySessions[id];
}

function normalizeImportedState(s) {
  const out = {
    userLanguages: Array.isArray(s?.userLanguages) ? s.userLanguages : [],
    activeLanguage: s?.activeLanguage ?? null,
    contents: (s?.contents && typeof s.contents === 'object') ? s.contents : {},
    studySessions: (s?.studySessions && typeof s.studySessions === 'object') ? s.studySessions : {}
  };
  if (out.activeLanguage && !out.userLanguages.find(l => l?.id === out.activeLanguage)) {
    out.activeLanguage = out.userLanguages[0]?.id || null;
  }
  if (!out.studySessions) out.studySessions = {};
  return out;
}

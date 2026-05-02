/* ════════════════════════════════════════════════════════════
   SETTINGS
   Exportar backup JSON, importar backup e resetar dados.
════════════════════════════════════════════════════════════ */

const importJsonFileEl = document.getElementById('importJsonFile');

document.getElementById('exportJsonBtn').addEventListener('click', () => {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, '0');
  const d   = String(now.getDate()).padStart(2, '0');
  downloadTextFile(`imerso-backup-${y}-${m}-${d}.json`, JSON.stringify(state, null, 2));
  toast('Backup JSON baixado');
});

document.getElementById('importJsonBtn').addEventListener('click', () => {
  importJsonFileEl.value = '';
  importJsonFileEl.click();
});

importJsonFileEl.addEventListener('change', async () => {
  const f = importJsonFileEl.files?.[0];
  if (!f) return;
  try {
    const text   = await f.text();
    const parsed = JSON.parse(text);
    const next   = normalizeImportedState(parsed);
    openConfirm({
      title: 'Importar backup?',
      body: 'Isso vai substituir seus dados atuais neste dispositivo. Essa ação não pode ser desfeita.',
      confirmText: 'Importar',
      onConfirm: () => {
        state = next;
        save();
        syncTopbar();
        renderDD();
        toast('Backup importado');
        if (state.userLanguages.length) switchTab('library');
        syncTopbar();
      }
    });
  } catch {
    toast('Formato de arquivo inválido. Envie um arquivo no formato JSON', 'error');
  }
});

/* ════════════════════════════════════════════════════════════
   MODALS
   Lógica genérica de abertura/fechamento de painéis e modais,
   além do diálogo de confirmação reutilizável.
════════════════════════════════════════════════════════════ */

function openPanel(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel(id, keepBodyLocked = false) {
  document.getElementById(id).classList.remove('open');
  if (!keepBodyLocked) document.body.style.overflow = '';
}

function openModal(id)  { openPanel(id); }

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (!document.querySelector('.overlay.open,.confirm-overlay.open')) {
    document.body.style.overflow = '';
  }
}

// Fechar qualquer overlay clicando fora do conteúdo
document.querySelectorAll('.overlay').forEach(o =>
  o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); })
);

/* ── Confirm dialog ── */
let _confirmAction = null;
let _confirmCancel = null;

function openConfirm({ title, body, confirmText = 'Confirmar', onConfirm, onCancel } = {}) {
  document.getElementById('confirmTitle').textContent = title || 'Confirmar';
  document.getElementById('confirmBody').textContent  = body  || '';
  document.getElementById('confirmDeleteBtn').textContent = confirmText;
  _confirmAction = typeof onConfirm === 'function' ? onConfirm : null;
  _confirmCancel = typeof onCancel  === 'function' ? onCancel  : null;
  openPanel('confirmModal');
}

function closeConfirm() {
  closePanel('confirmModal', true);
  document.getElementById('confirmDeleteBtn').textContent = 'Remover';
  _confirmAction = null;
  _confirmCancel = null;
  if (!document.querySelector('.overlay.open,.confirm-overlay.open')) {
    document.body.style.overflow = '';
  }
}

document.getElementById('confirmCancelBtn').addEventListener('click', () => {
  try { if (_confirmCancel) _confirmCancel(); } finally { closeConfirm(); }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  if (!_confirmAction) return;
  const fn = _confirmAction;
  closeConfirm();
  fn();
});

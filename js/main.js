/* ════════════════════════════════════════════════════════════
   MAIN
   Inicialização do app. Deve ser o último script carregado.
════════════════════════════════════════════════════════════ */

syncTopbar();

// Se o usuário não tem idiomas ainda, abre o modal de adicionar automaticamente
if (!state.userLanguages.length) {
  setTimeout(() => { renderAdd(); openModal('addModal'); }, 250);
}

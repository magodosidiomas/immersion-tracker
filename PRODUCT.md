# Imerso — Product Specification & Business Rules

## 1. Product Vision & Goals
Imerso is a zero-friction language immersion tracking application.
- **Goal 1:** Make language study progress tangible and gamified.
- **Goal 2:** Zero friction to start or log a session.

## 2. Core Structure & Mental Model
- **Language Profiles & Onboarding:** All sessions, history, goals, and levels are scoped to the currently selected language profile. New users start with **0 languages** and are presented directly with the onboarding view ("Qual idioma você está aprendendo?") to pick their initial language from the catalog. Switching languages switches profiles.
- **Navigation:** 4 main bottom nav tabs: **Timer**, **Metas** (Goals/Levels), **Estatísticas** (Statistics), and **Histórico** (History).
- **Session Locking:** While a timer session is active (running or paused):
  - Bottom nav is hidden.
  - Language selector is locked (shows toast "Encerre a sessão para trocar de idioma").

## 3. Session & Timer Logic
- States: Idle (`00:00:00`), Running, Paused.
- Measured via **timestamp comparison** (not simple setInterval) so app minimize/screen lock doesn't affect accuracy.
- **Persistência do Timer Ativo (`localStorage`):** O estado do timer (`running`, `paused` ou `summary`), o idioma ativo e os timestamps de início são salvos continuamente no navegador. Se o usuário recarregar a página (F5), fechar o navegador ou se o sistema operacional suspender a aba no celular por falta de RAM, ao reabrir o app o timer continua correndo exatamente do ponto em que deveria estar, sem perda de tempo.
- **Proteção contra Fechamento Acidental (`beforeunload`):** O navegador exibe aviso nativo de confirmação caso o usuário tente fechar a aba enquanto houver um timer ou resumo em andamento.
- Practice is chosen **after** clicking "Encerrar" (never before/during).
- **Ajuste Pós-Sessão & Esquecimento (Zero Fricção):** Sem interrupções de modais durante a contagem. Caso o usuário esqueça o timer aberto, o editor de tempo estilo Samsung na tela de encerramento permite corrigir ou descartar o registro com agilidade.

## 4. Practices & Styles
- Exactly 1 practice per session.
- Practices:
  1. Escuta e leitura (Listening & Reading)
  2. Escuta (Listening)
  3. Leitura (Reading)
  4. Fala (Speaking)
  5. Escrita (Writing)
  6. Pronúncia (Pronunciation)
  7. Gramática (Grammar)
  8. Vocabulário (Vocabulary / Anki)
- Sub-styles (Only for Immersion practices 1, 2, 3):
  - **Imersão:** Few or no pauses to look up words.
  - **Imersão interativa:** Frequent pauses to look up words.

## 5. Daily Cap & Rules
- Duração máxima de uma sessão individual limitada a **24h** no editor de tempo.
- Sessões que cruzam a meia-noite pertencem ao dia de início (`startedAt`).
- Campo de duração no resumo/registro manual utiliza deslocamento de dígitos da direita para a esquerda (estilo relógio Samsung).

## 6. Data, Settings & Backup Strategy
- **Settings View Dedicada:** As opções do sistema (aparência, sincronização na nuvem, backup local e sobre o app) residem em uma tela completa com navegação e header próprios (`SettingsView.tsx`), substituindo gavetas/drawers comprimidos.
- **Local Storage (Offline-First):** Todos os perfis de idiomas e registros de sessões são salvos prioritariamente no `localStorage` do navegador. O aplicativo é 100% funcional sem internet.
- **JSON Export / Import:** Exportação e importação manual de arquivo `.json` (`imerso-backup-YYYY-MM-DD.json`) via página de Configurações, garantindo portabilidade entre navegadores e dispositivos.
- **Google Drive Sync (Custo Zero & Privacidade Total):**
  - **Client-Side OAuth:** Integração direta com Google Identity Services (GIS) e Google Drive REST API v3 sem necessidade de backend, banco de dados ou servidor intermediário.
  - **Isolamento via `appDataFolder`:** O escopo restrito `drive.appdata` isola os dados do Imerso em uma pasta interna oculta do Google Drive da conta do usuário. O app tem **zero acesso** a pastas, fotos ou arquivos pessoais do usuário.
  - **Sincronização Bidirecional Inteligente:** O algoritmo faz merge por união de IDs de sessões e preserva os timestamps mais recentes de alteração de idiomas, impedindo perda de dados mesmo se o usuário usar o app simultaneamente no celular e no computador.
  - **Auto-Sync Silencioso:** Sincroniza automaticamente em background após salvar ou excluir sessões quando a conta estiver conectada.
  - **Privacidade & Conformidade (LGPD/GDPR):** O usuário possui soberania total dos seus dados, podendo desconectar a conta, limpar os registros locais ou exportar seu histórico a qualquer momento.

## 7. Copy Guidelines
- Buttons: Imperative verbs (`Iniciar`, `Pausar`, `Retomar`, `Encerrar`, `Pronto`, `Salvar sessão`, `Salvar alterações`).
- Toasts: Past tense (`Sessão salva`, `Sessão descartada`, `Japonês adicionado`, `Backup exportado`).
- Case: Sentence case throughout. Never use generic labels like "OK".


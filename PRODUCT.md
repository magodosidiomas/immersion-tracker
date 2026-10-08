# Imerso — Product Specification & Business Rules

## 1. Product Vision & Goals
Imerso is a zero-friction language immersion tracking application.
- **Goal 1:** Make language study progress tangible and gamified.
- **Goal 2:** Zero friction to start or log a session.

## 2. Core Structure & Mental Model
- **Language Profiles:** All sessions, history, goals, and levels are scoped to the currently selected language profile. Switching languages switches profiles.
- **Navigation:** 4 main bottom nav tabs: **Timer**, **Metas** (Goals/Levels), **Estatísticas** (Statistics), and **Histórico** (History).
- **Session Locking:** While a timer session is active (running or paused):
  - Bottom nav is hidden.
  - Language selector is locked (shows toast "Encerre a sessão para trocar de idioma").

## 3. Session & Timer Logic
- States: Idle (`00:00:00`), Running, Paused.
- Measured via **timestamp comparison** (not simple setInterval) so app minimize/screen lock doesn't affect accuracy.
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

## 6. Data & Backup Strategy
- **Local Storage & Backup (MVP):** All profiles and session records are stored in browser `localStorage`.
- **JSON Export / Import:** Users can export a complete `.json` backup file (`imerso-backup-YYYY-MM-DD.json`) and import it at any time via the Settings menu (`Configurações`).
- **Roadmap (Próxima Versão - Custo Zero):**
  - **Google Drive Sync:** Sincronização automática via `appDataFolder` do Google Drive do usuário (OAuth client-side, $0 custo de backend e zero manutenção).

## 7. Copy Guidelines
- Buttons: Imperative verbs (`Iniciar`, `Pausar`, `Retomar`, `Encerrar`, `Pronto`, `Salvar sessão`, `Salvar alterações`).
- Toasts: Past tense (`Sessão salva`, `Sessão descartada`, `Japonês adicionado`, `Backup exportado`).
- Case: Sentence case throughout. Never use generic labels like "OK".


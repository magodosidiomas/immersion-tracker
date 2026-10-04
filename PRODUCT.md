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
- **3-Hour Threshold ("Ainda está aí?"):** After 3h continuous running session, prompt user, but keep measuring in background.

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
- Total logged study hours across all language profiles cannot exceed **24h per calendar day**.
- Sessions crossing midnight count entirely toward the `startedAt` day.
- Single duration field in summary/manual log uses right-to-left digit shift (Samsung clock style).

## 6. Copy Guidelines
- Buttons: Imperative verbs (`Iniciar`, `Pausar`, `Retomar`, `Encerrar`, `Pronto`, `Salvar sessão`, `Salvar alterações`).
- Toasts: Past tense (`Sessão salva`, `Sessão descartada`, `Japonês adicionado`).
- Case: Sentence case throughout. Never use generic labels like "OK".

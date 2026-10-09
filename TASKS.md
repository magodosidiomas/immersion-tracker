# 📋 TASKS.md — Imerso Tasks & Open Questions

## 💡 Maintenance Rule for AI & Contributors
> **Rule for AI Agents & Collaborators:**
> 1. **Continuous Update:** Whenever you inspect, work on, or complete a task in this workspace, update this file immediately.
> 2. **Capture Open Questions:** If any requirement, architectural decision, or UX detail is ambiguous or undecided, log it under **Open Questions & Ambiguities**.
> 3. **Strict Prioritization:** Organize tasks strictly by priority level (P0 = Critical, P1 = High, P2 = Medium, P3 = Low/Future).

---

## 轨 Task Backlog

### 🔴 P0 — Launch v1 Checklist
- [x] **Timer & Locking Verification:** Verificado logicamente via comparação de timestamp (`Date.now()` vs `startTimeRef`), bloqueio do bottom nav e bloqueio de troca de idioma durante sessão ativa.
- [x] **Duration Input:** Entrada e ajuste de duração estilo Samsung (shift da direita para a esquerda via teclado numérico) validado.
- [x] **Practice Selection:** Seletor de prática disparado exclusivamente após clicar em "Encerrar", com sub-estilos de imersão (livre vs. interativa).
- [x] **Esquecimento / Alerta de 3h (Decisão Zero-Fricção):** Eliminado modal invasivo no timer; usuário confia na edição pós-sessão via teclado numérico para corrigir eventuais esquecimentos.
- [x] **PWA & Mobile Metadata:** Configurado `manifest.webmanifest`, tags mobile para iOS/Android e link para `favicon.svg`.
- [x] **Hospedagem & SPA Fallback:** Regra `public/_redirects` criada para deploy na Cloudflare Pages.
- [x] **v1 Build Audit:** Clean build (`npm run build`) e lint (`oxlint`) validados sem erros.

### 🟠 P1 — Mentoring Accountability Features (v2 Roadmap)
- [x] **Document v2 Roadmap:** Created [ROADMAP_V2.md](file:///c:/Users/vitor/Desktop/Imerso/ROADMAP_V2.md) detailing mentoring export & student proof-of-work.
- [ ] **Meta Diária no Timer (Linear Progress):** Integrar barra tática sutil com progresso diário sem anel circular (protótipos interativos explorados e salvos nos artifacts).
- [ ] **Calendário Mensal de Consistência:** Heatmap/calendário na aba de Estatísticas/Histórico mostrando dias de estudo ativo.
- [ ] **Student Export / Share:** Implement 1-click weekly immersion summary card (image or text) for students to send to mentor.
- [ ] **Consistency Streaks:** Track weekly active days (e.g. 6/7 days active) to prevent notification fatigue.
- [ ] **Cloud Persistence:** Evaluate Google Drive / Supabase backup sync for cross-device support.

### 🟡 P2 — Medium Priority
- [ ] **Revisitar paleta de cores das estatísticas:** Avaliar contraste e harmonia das cores de cada atividade no Donut de `StatsView` após testes com dados reais de uso.
- [ ] **UX Polish:** Audit `StatsView` and `ImersoApp` layout against design tokens ([ImersoApp.tsx](file:///c:/Users/vitor/Desktop/Imerso/src/components/ImersoApp.tsx)).

### 🟣 P3 — Portfolio Showcase (v1 ➔ v2 Transition)
- [x] **Master Blueprint & Teardown Doc:** Criado documento base de estudo de caso com foco visual e conciso em [CASE_STUDY.md](file:///c:/Users/vitor/Desktop/Imerso/CASE_STUDY.md) cobrindo os 4 pilares: Core Flow, IA/Gamificação CEFR, Arquitetura e Human+AI Steering.
- [ ] **Live Minimal HTML Showcase (`showcase.html`):** Desenvolver mini-site/layout web ultraraw e minimalista com toggles interativos de Antes/Depois (v1 vs v2) e seletor bilíngue (EN / PT-BR).
- [ ] **Behance Slide & Asset Checklist:** Estruturar grid visual e checklist de mockups de alta resolução para apresentação no Behance.
- [ ] **Captura de Telas & Comparações Visuais:** Gerar capturas comparativas lado a lado do protótipo v1 (`_prototype_old.html`) e do app v2 (Timer circular, Keypad numérico, Níveis CEFR).

---

## ❓ Open Questions & Ambiguities
- [ ] **Student Export Format:** Do students prefer sending a generated image card or a formatted WhatsApp text message with their weekly Imerso stats?
- [ ] **Showcase Destination:** Priorizar publicação web independente ou exportação direta para Behance/Figma? (Em espera conforme solicitação).

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
- [ ] **Student Export / Share:** Implement 1-click weekly immersion summary card (image or text) for students to send to mentor.
- [ ] **Consistency Streaks:** Track weekly active days (e.g. 6/7 days active) to prevent notification fatigue.
- [ ] **Cloud Persistence:** Evaluate Supabase/Firebase backup sync for cross-device support.

### 🟡 P2 — Medium Priority
- [ ] **Revisitar paleta de cores das estatísticas:** Avaliar contraste e harmonia das cores de cada atividade no Donut de `StatsView` após testes com dados reais de uso.
- [ ] **UX Polish:** Audit `StatsView` and `ImersoApp` layout against design tokens ([ImersoApp.tsx](file:///c:/Users/vitor/Desktop/Imerso/src/components/ImersoApp.tsx)).

---

## ❓ Open Questions & Ambiguities
- [ ] **Student Export Format:** Do students prefer sending a generated image card or a formatted WhatsApp text message with their weekly Imerso stats?

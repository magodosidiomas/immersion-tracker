# Imerso — Design System & Visual Identity

## 1. Visual Aesthetics & Theme (Anti-AI-Slop Direction: Linear / Raycast Dark)
- **Mode:** Operate (High clarity, zero distraction, fast task completion).
- **Theme:** Monochromatic / High-contrast Dark wireframe style com refinamento tático sóbrio (estilo Linear / Raycast).
- **Backgrounds & Surfaces:**
  - Background: Deep neutral dark (`#09090b` / `zinc-950`).
  - Cards & Containers: Superfícies planas sutis (`zinc-900`/`zinc-800/50`) com bordas finas e nítidas (`zinc-800`).
  - **Acentos:** Monocromático funcional. Se roxo for usado, deve ser profundo/sóbrio (`#6e56cf` / `violet-600`), **nunca neon, nunca com glow colorido**.
- **Typography:**
  - Fonte Oficial: **Satoshi Variable** (Indian Type Foundry · 300 a 900 · Self-hosted em `/fonts/satoshi/`).
  - Identidade: Neo-grotesca independente e autoral, fora dos clichês de IA/shadcn/Vercel templates.
  - ❌ **Evitar fontes clichê de IA:** Não usar `Outfit` ou presets default de IA sem curadoria.
  - **Tipografia Padrão (Base 14px & Piso 12px):** Começar sempre textos secundários, descrições, labels e botões em 14px (`text-sm`). Reservar 12px (`text-xs`) exclusivamente para micro-metadados pontuais (timestamps curtos como *"Há 2 min"*, tags mínimas). Piso absoluto é 12px; banido qualquer valor menor (`text-[10px]`, `text-[11px]`).
  - Tabular Numbers (`tabular-nums` / `font-feature-settings: 'tnum' on, 'lnum' on`) aplicados globalmente para timers, durações e metas.
  - **Section Titles & Subheaders (Sentence Case):** Estritamente **Sentence case** (`text-sm font-semibold text-muted-foreground`), nunca ALL CAPS com tracking artificial e **NUNCA** usar a classe CSS `capitalize` em strings em português (pois ela transforma preposições em maiúsculas indevidamente, gerando anomalias como *"Outubro De 2026"*). Preposições e artigos devem permanecer minúsculos. Exemplos canônicos: `Outubro de 2026`, `Tempo total`, `Por atividade`, `Privacidade & dados`, `Backup local`.

## 2. Component & Layout Rules
- **Interactive Targets:** Minimum 44px height for buttons, bottom sheets, list items, and inputs.
- **Action Bar & Primary Buttons:**
  - Single primary action button (full width, 56px height, rounded-2xl).
  - **Tom do Botão Primário:** Roxo Sólido Linear-style (`bg-[#6d28d9]`, texto `#ffffff`, borda física `violet-500/30`, hover `bg-[#5b21b6]`). Cor sólida profunda e deliberada, sem gradiente, sem glow e com contraste real WCAG AA (5.67:1).
  - Fixed or sticky above keyboard without jumping.
  - No disabled buttons on forms: show explicit inline errors on submit attempt instead.
- **Bottom Sheets (Radix / Vaul):**
  - Practice selection, language switcher.
  - Max height 92vh.
  - Footer buttons must have identical height (min 44px) and matching typography (`text-sm`).
  - Dynamic scroll fades (`ScrollAreaFade`): Top fade **must be 0 opacity** when `scrollTop === 0`.
- **Inline Validation & Errors:**
  - Highlight field with warning border and present clear Portuguese inline error text below field.

## 3. Anti-Patterns & Strict Exclusions (Zero AI-Slop Bar)
- ❌ **Zero AI-Slop:** Proibido gradientes coloridos aleatórios, sombras coloridas difusas (`shadow-purple-500/50`), bordas iluminadas ("glows"), banners vermelhos neon espalhafatosos ou estética genérica de landing page de IA.
- ❌ **Zero shadcn clichê:** Não aplicar estilos padrão não refinados do shadcn sem adaptar para a paleta tática/sóbria do Imerso.
- ❌ **Piso estrito de 12px:** Proibido fontes menores que 12px (`text-[10px]`, `text-[11px]`, etc.) no app e em qualquer arquivo de preview. Piso absoluto é `text-xs` (12px).
- ❌ **Zero ALL CAPS & Tracking artificial:** Proibido `uppercase` ou `capitalize` em títulos, seções e badges. Usar estritamente **Sentence case** em português.
- ❌ **Zero termos em inglês:** Microcopy 100% em português brasileiro autêntico. Banido "Sync", "Retry", "Login", etc.
- ❌ **Zero setas/adereços em botões:** Proibido adereços clichê como `→`, `>>` em botões de ação.
- ❌ **Zero touch targets < 44px:** Todo botão ou controle interativo deve ter altura real de no mínimo 44px (`h-11`).
- ❌ **Zero dividers desalinhados ou colados:** Proibido terminantemente dividers colados em elementos, com margens assimétricas ou espaçamento irregular. Priorizar ritmo espacial limpo (`space-y-*` / `gap-*`). Dividers só devem existir em listas homogêneas (`divide-y divide-border/50`).
- ❌ NO generic vibrant rainbow colors unless explicitly representing macro-pillars (Imerso macro-pilares use subtle grayscale scale: Imersão `#ededed`, Produção `#8b8b85`, Fundamentos `#50504d`).
- ❌ NO unstyled native scrollbars or missing scroll masks.
- ❌ NO layout shift when switching states or opening/closing keyboard.
- ❌ NO redundant labels like "Total em Inglês" when screen context is already scoped.

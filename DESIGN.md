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
  - Strict **Font Floor:** Minimum 12px (`text-xs`) across the entire app. No tiny text below 12px.
  - Tabular Numbers (`tabular-nums` / `font-feature-settings: 'tnum' on, 'lnum' on`) aplicados globalmente para timers, durações e metas.

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
- ❌ **Zero AI-Slop:** Proibido gradientes coloridos aleatórios, sombras coloridas difusas (`shadow-purple-500/50`), bordas iluminadas ("glows") ou estética genérica de landing page de IA.
- ❌ **Zero shadcn clichê:** Não aplicar estilos padrão não refinados do shadcn sem adaptar para a paleta tática/sóbria do Imerso.
- ❌ NO generic vibrant rainbow colors unless explicitly representing macro-pillars (Imerso macro-pilares use subtle grayscale scale: Imersão `#ededed`, Produção `#8b8b85`, Fundamentos `#50504d`).
- ❌ NO unstyled native scrollbars or missing scroll masks.
- ❌ NO layout shift when switching states or opening/closing keyboard.
- ❌ NO fonts smaller than 12px.
- ❌ NO redundant labels like "Total em Inglês" when screen context is already scoped.

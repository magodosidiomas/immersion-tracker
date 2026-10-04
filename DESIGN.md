# Imerso — Design System & Visual Identity

## 1. Visual Aesthetics & Theme
- **Mode:** Operate (High clarity, zero distraction, fast task completion).
- **Theme:** Monochromatic / High-contrast Dark wireframe style with refined modern polish.
- **Backgrounds & Surfaces:**
  - Background: Deep neutral dark (`#09090b` / `zinc-950`).
  - Cards & Containers: Slightly lighter subtle surfaces (`zinc-900`/`zinc-800/50`) with thin subtle borders (`zinc-800`).
- **Typography:**
  - Modern sans-serif stack (`Plus Jakarta Sans`, `Geist`, `Nunito`, `Outfit`).
  - Strict **Font Floor:** Minimum 12px (`text-xs`) across the entire app. No tiny text below 12px.
  - Tabular Numbers (`font-mono` / `tabular-nums`) for timers, durations, level progress.

## 2. Component & Layout Rules
- **Interactive Targets:** Minimum 44px height for buttons, bottom sheets, list items, and inputs.
- **Action Bar:**
  - Single primary action button (full width, 56px height).
  - Fixed or sticky above keyboard without jumping.
  - No disabled buttons on forms: show explicit inline errors on submit attempt instead.
- **Bottom Sheets (Radix / Vaul):**
  - Practice selection, language switcher.
  - Max height 92vh.
  - Footer buttons must have identical height (min 44px) and matching typography (`text-sm`).
  - Dynamic scroll fades (`ScrollAreaFade`): Top fade **must be 0 opacity** when `scrollTop === 0`.
- **Inline Validation & Errors:**
  - Highlight field with warning border and present clear Portuguese inline error text below field.

## 3. Anti-Patterns & Strict Exclusions
- ❌ NO generic vibrant rainbow colors unless explicitly representing macro-pillars (Imerso macro-pilares use subtle grayscale scale: Imersão `#ededed`, Produção `#8b8b85`, Fundamentos `#50504d`).
- ❌ NO unstyled native scrollbars or missing scroll masks.
- ❌ NO layout shift when switching states or opening/closing keyboard.
- ❌ NO fonts smaller than 12px.
- ❌ NO redundant labels like "Total em Inglês" when screen context is already scoped.

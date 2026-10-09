# Imerso: v1 ➔ v2 Showcase
*Visual Case Study • Product Design & AI Engineering*

---

## ⚡ At a Glance

| Metric | v1 (Prototype) | v2 (Shipped App) |
| :--- | :--- | :--- |
| **Tech** | 1 monolithic file (`.html`, 53KB) | React 19 + Tailwind v4 + PWA |
| **Timer** | Monospace digital string | Circular tactile progress ring |
| **Time Edit** | 3 awkward `<input>` fields | Samsung-style right-to-left keypad |
| **Profiles** | Single flat array (8 junk languages) | 100% isolated multi-language profiles |
| **Gamification** | Raw minutes list | CEFR fluency milestones (A1 ➔ C2) |
| **Design Language** | Generic gray cards & system font | Matte architectural dark, 44px touch targets |

---

## 01. The Core Flow: From Friction to Flow

### 🔴 v1 Friction
- **Interruption before study:** Pressure to configure tags before entering focus.
- **Sterile timer:** Static numbers, zero tactile feeling of elapsed time.
- **Awkward edits:** Typing `hh:mm:ss` manually on mobile triggers keyboard layout shifts.

### 🟢 v2 Solution
- **Post-Session Tagging:** Tap `Iniciar` instantly. Categorize *only after* finishing.
- **Circular Tactile Ring:** Visual time passage without anxiety.
- **Keypad Editor:** Natural right-to-left digit shift (typing `4-5` = `00:45:00`).

```
[VISUAL ASSET: Side-by-Side Comparison]
┌──────────────────────────────┐   ┌──────────────────────────────┐
│  v1: Digital Text Counter   │   │  v2: Circular Tactile Ring   │
│         00:45:12             │   │             ╭───╮            │
│  [Hour] [Min] [Sec] inputs   │   │             │45m│            │
│  awkward keyboard overlap    │   │             ╰───╯            │
│                              │   │   Keypad digit-shift edit    │
└──────────────────────────────┘   └──────────────────────────────┘
```

---

## 02. Information Architecture & Gamification

### 🔴 v1 Friction
- Single flat log.
- 8 dummy languages injected on first boot. Overwhelming clutter.
- Abstract time ("140 hours") with no sense of milestone.

### 🟢 v2 Solution
- **Zero-State Onboarding:** Starts with 0 languages. Pick 1 from a curated 20+ catalog.
- **Isolated Profiles:** Spanish, Japanese, and German never cross-pollinate logs.
- **CEFR Milestones:** Hours mapped to A1, A2, B1, B2, C1, C2. Tangible progress.
- **High-Contrast Empty States:** Clean dark surfaces, zero gray rings, dedicated action CTAs.

```
[VISUAL ASSET: IA Architecture Diagram]
Single User
 ├── 🇯🇵 Japanese Profile ─── [CEFR: A2] ─── [Isolated History & Stats]
 ├── 🇩🇪 German Profile   ─── [CEFR: B1] ─── [Isolated History & Stats]
 └── 🇪🇸 Spanish Profile  ─── [CEFR: A1] ─── [Isolated History & Stats]
```

---

## 03. Human + AI Steering: Killing "AI-Slop"

### 🔴 Without Strict Constraints (AI Defaults)
- Generic purple/cyan gradients.
- Muddy low-contrast shadows and "glows".
- Non-standard buttons, erratic padding, broken tap targets.

### 🟢 With Spec-Driven Design (`DESIGN.md` + `PRODUCT.md`)
- **Architectural Dark:** Matte dark surfaces (`#0a0a0a`), high-contrast WCAG AA text.
- **Ergonomics:** 44px strict minimum tap target.
- **Voice:** Imperative microcopy (`Iniciar`, `Encerrar`, `Salvar sessão`).
- **Empirical Gate:** Every AI commit verified with `npm run lint` and `tsc --noEmit`.

---

## 04. Code Evolution

```
v1 Monolith (53KB)                       v2 Modular Architecture
_prototype_old.html                      src/
├── Inline CSS & DOM hacks               ├── components/ (Atomic UI & Drawers)
├── setInterval drift                    ├── hooks/      (useTimer, useStorage)
└── Mocked global state                  ├── types/      (Strict TS models)
                                         └── styles/     (Tailwind v4 tokens)
```

---

## 05. Before / After Scorecard

| Area | v1 Prototype | v2 Shipped |
| :--- | :--- | :--- |
| **First-Run Time** | ~18s (config modals) | **< 2s (1 tap)** |
| **Time Correction** | ~12s (typing 3 inputs) | **~3s (keypad tap)** |
| **Motivation Loop** | Static log list | **CEFR level progress bars** |
| **Code Modularity** | 1 file (fragile) | **Component-driven (scalable)** |

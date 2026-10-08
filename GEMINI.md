# Project Guidelines & Token Efficiency Rules

## 1. Context & MD Documentation Architecture
- **`PRODUCT.md`**: Authoritative product vision, business rules, language profiling, feature specs. Read ONLY for feature/business logic tasks.
- **`DESIGN.md`**: Authoritative visual tokens, typography rules, layout floors, component anti-patterns. Read ONLY for UI/UX tasks.
- **`GEMINI.md`**: Core execution rules & token efficiency guidelines. Always enforced.
- **Why this architecture?**: Scoping context into distinct MDs avoids loading massive, irrelevant prompt text into the LLM window, saving context tokens on every turn while ensuring zero-guessing accuracy.

## 2. Front-End Impeccable Quality Bar (Zero Basic Mistakes & Anti-AI-Slop)
- **Design Alignment:** Read `DESIGN.md` before performing UI edits.
- **Visual & Layout Floor:**
  - Minimum touch target 44px.
  - Minimum font size 12px (`text-xs`).
  - Single action bar sticky/fixed with primary submit buttons.
  - Portuguese microcopy with imperative buttons and past-tense toasts.
  - **Zero AI-Slop:** Banido o uso de gradientes coloridos aleatórios, sombras coloridas difusas ("glows") e estética genérica de IA. Priorizar tons sólidos, materiais escuros arquiteturais foscos e contraste real WCAG.
- **Visual Exploration & Preview Protocol:**
  - Quando o usuário pedir exploração de design, fontes ou estilo: **NUNCA** alterar o código global diretamente às cegas.
  - **Sempre gerar um preview interativo rápido (HTML/widget ou preview dedicado)** para aprovação prévia do usuário antes de comitar mudanças na UI.
- **Empirical Verification:** Always run `npm run lint` or `npx tsc --noEmit` after modifying code before claiming completion.

## 3. Token Optimization & Workflow Rules
- **Plan First:** For complex tasks or multi-file edits, outline a concise step-by-step plan before writing code.
- **Targeted File Inspection:** Only view files directly relevant to the task. Avoid reading entire large directories or irrelevant context.
- **Concise Output:** Keep responses direct, code-focused, and free of unnecessary fluff to save output tokens.
- **Ultra-Concise Verbosity:** Omit introductory/concluding pleasantries, chat recap, and unnecessary explanations. Provide only direct answers, code-focused diffs, and essential findings unless explanations are explicitly requested.
- **Subagent Delegation:** Delegate simple research or file searching to lightweight subagents (`flash`/`flash_lite`) to keep the main context lean.

## 4. Code Quality & Modularity
- **Precise File Edits:** Edit only affected code lines using targeted replacements instead of rewriting whole files.
- **Global Component Consistency:** When fixing performance, behavior, or rendering issues for a component or UI element, inspect and apply the fix globally across ALL locations where the component/element is rendered or searched.
- **Empirical Verification:** Verify code modifications with builds or tests before declaring completion.

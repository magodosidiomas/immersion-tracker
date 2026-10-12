# Project Guidelines & Token Efficiency Rules

## 1. Context & MD Documentation Architecture
- **`PRODUCT.md`**: Authoritative product vision, business rules, language profiling, feature specs. Read ONLY for feature/business logic tasks.
- **`DESIGN.md`**: Authoritative visual tokens, typography rules, layout floors, component anti-patterns. Read ONLY for UI/UX tasks.
- **`KNOWLEDGE.md`**: Base de conhecimento técnico, modelo mental de deploy (Cloudflare Pages), terminal e dicionário de comandos operacionais.
- **`GEMINI.md`**: Core execution rules & token efficiency guidelines. Always enforced.
- **Why this architecture?**: Scoping context into distinct MDs avoids loading massive, irrelevant prompt text into the LLM window, saving context tokens on every turn while ensuring zero-guessing accuracy.

## 2. Front-End Impeccable Quality Bar (Zero Basic Mistakes & Anti-AI-Slop)
- **Design Alignment:** Read `DESIGN.md` before performing UI edits.
- **Zero Tolerance UI Gates (Must Be Self-Audited Before Presenting ANY UI / Preview):**
  - 🚫 **Tipografia Padrão (Base 14px & Piso 12px):** Todo texto descritivo, label, botão e conteúdo secundário deve **começar por padrão em 14px (`text-sm`)**. O tamanho 12px (`text-xs`) é estritamente reservado para micro-metadados pontuais (ex.: timestamps como *"Há 2 min"*, tags minúsculas). Banido terminantemente qualquer tamanho abaixo de 12px (`text-[10px]`, `text-[11px]`).
  - 🚫 **Sentence Case Obrigatório:** Banido `uppercase`, `capitalize` e tracking artificial (`tracking-widest`, `tracking-wider`). Títulos, seções, subtítulos e badges devem ser escritos em **Sentence case** natural em português, preservando preposições e artigos minúsculos.
  - 🚫 **Touch Target Real (≥ 44px):** Todo botão, trigger ou elemento clicável deve ter altura real de no mínimo 44px (`h-11`). Proibido usar `h-8` ou `h-9` em botões de ação.
  - 🚫 **Zero AI-Slop & Paleta Sóbria:** Banido o uso de gradientes coloridos aleatórios, sombras coloridas difusas ("glows"), banners vermelhos neon genéricos e estética de template de IA. Priorizar tons sólidos, materiais escuros arquiteturais foscos (`zinc-900`/`zinc-800`), acentos sóbrios e contraste real WCAG.
  - 🚫 **Microcopy 100% em Português & Anti-Adorno:** Proibido usar termos em inglês ("Sync", "Retry", "Login", etc.) e adereços visuais clichê (ex.: `→`, `>>`). Botões no imperativo ("Sincronizar", "Desconectar", "Tentar novamente"), toasts no particípio passado ("Sincronizado", "Salvo").
  - 🚫 **Paridade Estrita em Previews:** Previews (arquivos `.html`, widgets, telas temporárias de exploração) **DEVEM** respeitar 100% das regras acima com a mesma disciplina do código de produção.
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

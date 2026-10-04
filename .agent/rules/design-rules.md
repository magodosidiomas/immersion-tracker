# UI & Design System Rules (Imerso)

## 1. Botões em Bottom Sheets e Drawers
- **Mesma Altura Obrigatória:** Quando múltiplos botões de ação são dispostos no rodapé de um Bottom Sheet ou Drawer (empilhados ou lado a lado), eles devem possuir **EXATAMENTE a mesma altura** (padrão: `h-11 min-h-[44px]`).
- **Sem Botões Diminutos:** É proibido que um botão secundário/ghost tenha altura reduzida em relação ao outro (ex: nunca misturar `h-10` com `h-8`). A hierarquia visual entre primário, secundário e terciário deve ser feita pela variante de preenchimento (`secondary`, `ghost`, etc.), e NÃO pela diminuição da altura física ou tamanho do texto.
- **Acessibilidade de Toque (WCAG 2.5.5 / 2.5.8):** A área de toque deve ter no mínimo 44px de altura (`h-11 min-h-[44px]`) para garantir ergonomia em dispositivos móveis.

## 2. Piso Absoluto de Tipografia (Regra dos 12px)
- **NUNCA usar fonte abaixo de 12px:** É estritamente proibido o uso de `text-[10px]`, `text-[11px]` ou qualquer valor inferior a 12px (`text-xs` / `0.75rem`) no aplicativo inteiro.
- **Tamanhos e Usos Recomendados:**
  - `12px` (`text-xs`): Exclusivamente para texto de apoio, legendas e rótulos auxiliares.
  - `14px` (`text-sm`): Botões de ação em sheets/modais, linhas de listas e informações secundárias.
  - `16px` (`text-base`): Títulos de cards e drawers, corpo principal.
- **Contraste Mínimo (WCAG AA):** Todo texto deve garantir legibilidade com contraste mínimo de 4.5:1 em relação ao plano de fundo, em temas claro e escuro.

## 3. Rolagem e Fades Dinâmicos (Scroll-Aware Fade)
- **NUNCA aplicar fade estático no topo de listas:** Quando uma lista abre ou está em `scrollTop === 0`, o topo DEVE ser 100% nítido e opaco (zero fade). O primeiro item nunca pode começar desbotado ou cortado por uma máscara de gradiente.
- **Fade Condicional Direcional:**
  - Fade no topo: SÓ PODE APARECER quando a lista realmente for rolada para baixo (`scrollTop > 4`).
  - Fade na base: SÓ PODE APARECER se houver conteúdo além do limite visível.
  - Sem overflow: Se a lista couber inteira sem rolagem, NENHUM fade deve ser aplicado (`maskImage: none`).
- **Componente Oficial:** Usar sempre `<ScrollAreaFade>` (`@/components/ui/scroll-area-fade`) para contêineres roláveis em sheets e telas.

## 4. Acessibilidade em Modais, Diálogos e Ações Críticas
- **Piso de Tipografia em Modais (Mínimo 14px / text-sm):** Em diálogos, modais de confirmação e formulários interativos, rótulos de campos (`<label>`), instruções operacionais (ex: "Digite remover para confirmar") e descrições de impacto NUNCA devem usar `text-xs` (12px) nem fontes diminutas. Devem utilizar no mínimo `text-sm` (14px) com alto contraste (`text-foreground`) para garantir legibilidade imediata e acessibilidade visual (WCAG 1.4.3 / 1.4.4).
- **Botões Destrutivos Sólidos e de Alto Contraste (WCAG AA):** Ações destrutivas primárias (ex: "Remover", "Descartar") devem utilizar preenchimento sólido com `bg-destructive` e texto de alto contraste (`text-destructive-foreground` / branco, razão de contraste ≥ 4.5:1). É proibido utilizar variantes translúcidas pálidas (como `bg-destructive/10` com texto avermelhado desbotado) em ações críticas. Quando desabilitado, o botão deve manter estado perceptível (`disabled:opacity-50`) e sem perder legibilidade.
- **Sem Ícones Decorativos Desnecessários:** Diálogos e modais de confirmação devem priorizar clareza tipográfica, legibilidade direta e foco na decisão do usuário. Evitar containers quadrados ou caixas de ícones decorativas no topo (como caixas com lixeira) que poluam a hierarquia visual.

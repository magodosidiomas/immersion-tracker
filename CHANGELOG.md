# 📜 CHANGELOG — Histórico de Versões do Imerso

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.
O formato é baseado no padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [2.1.3] - 2026-10-10

### 🚀 Novidades & Experiência de Uso
- **Timer em Tempo Real na Aba do Navegador (`document.title`):**
  - O título da aba agora acompanha dinamicamente a contagem do cronômetro quando ativo (`▶ 14:20 · Imerso` para < 1h e `▶ 1:15:30 · Imerso` para >= 1h).
  - Exibição de estado pausado claro (`⏸ 14:20 · Imerso`).
  - Restauração automática para o título minimalista `Imerso` quando inativo, finalizado ou desmontado.
- **Correção de Ordenação do Histórico:**
  - Garantia de ordenação estritamente cronológica decrescente (`startedAt`) nos agrupamentos diários de sessões.

---

## [2.1.2] - 2026-10-09

### 🐛 Correções & Mobile UX
- **Eliminação do Scroll Fantasma e Efeito Elástico no Mobile:**
  - Bloqueio de `overscroll-behavior-y: none` e fixação de altura 100% no `html` e `body`.
  - Contenção do contêiner mobile com `h-dvh` e `overflow-hidden`, isolando as rolagens internas no `ScrollAreaFade`.
  - Inclusão de `interactive-widget=resizes-content` na meta tag viewport para evitar saltos visuais ao abrir o teclado.
  - Rolagem inercial nativa suave (`-webkit-overflow-scrolling: touch`) e `overscroll-contain` em todas as listas internas.

---

## [2.1.1] - 2026-10-08

### 💄 Refinos Visuais & Local de Versão
- **Ocultação do Donut em 0 Minutos:**
  - O gráfico Donut interativo e o cabeçalho "Por atividade" agora só aparecem quando há tempo de estudo registrado (`totalDurationSeconds > 0`).
  - Quando zerado, a tela apresenta apenas o Empty State limpo, eliminando o anel cinza vazio de 220px e o ruído visual desnecessário.
- **Versão Movida para o Menu de Configurações:**
  - O indicador de versão (`Imerso v2.1.1`) foi transferido do switch/gerenciador de idiomas para o rodapé do Drawer de Configurações (Settings), local padrão e intuitivo para informações do sistema.

---

## [2.1.0] - 2026-10-08

### 🚀 Novidades & Melhorias de UI
- **Empty States Padronizados e com Alto Contraste:**
  - Reformulação visual dos estados vazios no Histórico e nas Estatísticas com fundo limpo (sem caixas cinzas pesadas) e botões de ação dedicados.
  - Botão principal destacado em roxo sólido (`Iniciar timer`) e botão secundário com contorno suave (`Adicionar sessão`).
  - Hierarquia tipográfica consistente com contrastes em conformidade WCAG e sem AI-slop.
- **Dark Mode Padrão (Dark-First):**
  - O aplicativo agora inicializa no tema escuro por padrão, proporcionando a atmosfera visual imersiva ideal desde o primeiro acesso.
- **Layout Responsivo Desktop/Mobile:**
  - Otimização para experiência 100% tela cheia no mobile e container em formato de moldura de smartphone no desktop.
- **Rastreamento de Versão na Interface:**
  - Identificador discreto de versão (`v2.1.0`) exibido no painel de idiomas e no gerenciador de perfis.

### 🐛 Correções & Estabilidade
- **Correção de Idiomas no Primeiro Acesso (Onboarding Limpo):**
  - Usuários novatos agora iniciam com 0 idiomas na lista, sendo direcionados imediatamente para a tela de escolha inicial do catálogo ("Qual idioma você está aprendendo?").
  - Remoção dos 8 idiomas pré-carregados que poluíam a experiência de quem estuda apenas um idioma.
  - Saneamento automático no `storage.ts` para associar sessões existentes ao idioma atual e prevenir erros de idiomas órfãos.

---

## [2.0.0] - 2026-10-08

### 🚀 Reescrita Completa da Arquitetura
- **Tecnologias Modernas:**
  - Migração para React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Shadcn UI e Vite.
- **Sistema de Múltiplos Idiomas:**
  - Suporte a múltiplos perfis de idiomas com isolamento total de sessões, metas, níveis e histórico.
  - Catálogo global com 20+ idiomas e bandeiras vetoriais otimizadas via `circle-flags`.
- **Timer Circular & Registro Manual:**
  - Cronômetro circular com animação fluida de progresso.
  - Numpad manual numérico para registro retroativo de estudos.
- **Gamificação & Níveis de Proficiência:**
  - Metas diárias/semanais e cálculo dinâmico de horas para avanço de níveis (A1 ao C2) com base nas estimativas do CEFR.
- **Estatísticas Detalhadas:**
  - Gráficos de distribuição por tipo de prática (Escuta, Leitura, Vocabulário, etc.) e estilo (Imersão vs Estudo Tradicional).

---

## [1.0.0] - 2026-09-15

### 🚀 Lançamento Inicial
- Versão fundacional do Imerso (PWA com cronômetro simples e armazenamento local no navegador).

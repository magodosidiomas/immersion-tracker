# Imerso

App de registro e gamificação de estudo de idiomas por imersão.

> **Evolução do Projeto (Case Study):**
> O Imerso nasceu originalmente como um protótipo em Vanilla JS ([immersion-tracker](https://github.com/magodosidiomas/immersion-tracker)). Esta versão (v2) é um rebuild completo feito com foco em **redução radical de fricção**, eliminando o gerenciamento manual e pesado de bibliotecas de mídia para priorizar o que realmente impulsiona a aquisição de um idioma: **volume de horas de imersão compreensível**.

---

## 🎯 Proposta de Valor

1. **Mínimo de Fricção:** Iniciar uma sessão de estudo precisa de apenas um toque. Nenhuma prática ou mídia precisa ser selecionada antes ou durante o estudo.
2. **Medição Precisa:** Cálculo de tempo baseado em *timestamps*, imune a fechamento de app ou bloqueio de tela.
3. **Gamificação Tangível:** Sistema de **Níveis (1 a 10+)** com réguas de progresso que transformam o esforço invisível de horas em marcos palpáveis.
4. **Local-First & Privacidade:** 100% executado no navegador do usuário via `localStorage`. Sem servidores externos, sem rastreamento, sem custos de nuvem e funcionando offline.

---

## 🛠️ Tecnologias

- **React 19**
- **TypeScript** (tipagem estrita de sessões, práticas e idiomas)
- **Vite** (build ultrarrápido)
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Radix UI / Vaul** (componentes acessíveis e bottom sheets mobile-first)
- **Lucide Icons**
- **Sonner** (notificações toast)

---

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---

## 📄 Especificação do Produto

Para ver todas as decisões de produto, modelos de dados e fluxos de UX, consulte o [`SPEC.md`](./SPEC.md).

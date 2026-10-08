# 🧠 KNOWLEDGE.md — Base de Conhecimento Técnico do Imerso

Guia prático e descomplicado sobre como o Imerso funciona por baixo dos panos, como usar o terminal e como colocar atualizações no ar.

---

## 1. O Modelo Mental (Como o App Funciona)

O ciclo de vida do projeto segue 3 etapas simples:

```
[1. Código Fonte] ──────(Build)──────> [2. Pasta dist] ──────(Deploy)──────> [3. Cloudflare Nuvem]
React + TypeScript                     HTML + CSS + JS Puro                 Servidores Globais
(Você escreve aqui)                    (Computador gera)                    (https://imerso.pages.dev)
```

1. **Código Fonte (`src/`):** Onde você programa. Escrito em React e TypeScript. Navegadores comuns não entendem essa linguagem diretamente.
2. **Pasta de Distribuição (`dist/`):** O resultado do processamento. O computador traduz, minifica e gera os arquivos finais ultra leves.
3. **Nuvem (Cloudflare Pages):** Hospeda os arquivos da pasta `dist` em servidores espalhados pelo mundo todo (com CDN em várias capitais do Brasil e HTTPS automático).

---

## 2. O Domínio `.dev` no Final

* **URL Oficial:** `https://imerso.pages.dev`
* **Por que termina em `.dev`?** É o domínio padrão gratuito que a Cloudflare fornece para todo projeto do Cloudflare Pages (`<nome-do-projeto>.pages.dev`).
* **Como usar domínio próprio no futuro?** Se você comprar um domínio (ex: `imerso.app` ou `imerso.com.br`), basta adicioná-lo na aba **Custom Domains** da Cloudflare com 2 cliques, sem pagar nada pela hospedagem.

---

## 3. Guia Rápido do Terminal (Command Prompt / PowerShell)

O terminal é apenas uma forma de conversar com seu computador por texto em vez de usar cliques do mouse.

* **Diretório Atual (Caminho):** O texto antes da linha onde você digita mostra em qual pasta você está (ex: `C:\Users\vitor\Desktop\Imerso>`). Comandos executados afetam apenas essa pasta.
* **Autenticação:** Quando um comando como o `wrangler` precisa de permissão, ele abre o navegador para você clicar em autorizar. Uma vez autorizado, sua máquina guarda a chave de acesso localmente.

---

## 4. Dicionário de Comandos Essenciais

### 💻 Desenvolvimento Local (Testar no seu PC)
| Comando | O que faz |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de testes (abre em `http://localhost:5173`). Qualquer edição no código atualiza a tela na hora. |
| `npm run lint` | Executa o linter (`oxlint`) para verificar se há erros de código ou sintaxe. |

### 🔨 Preparação para Produção
| Comando | O que faz |
| :--- | :--- |
| `npm run build` | Compila o TypeScript e o Vite. Limpa e recria a pasta `dist` com os arquivos finais otimizados. |

### 📦 Controle de Versão (Git & GitHub)
| Comando | O que faz |
| :--- | :--- |
| `git status` | Mostra quais arquivos foram criados ou alterados desde o último salvamento. |
| `git add .` | Prepara todos os arquivos modificados para serem salvos. |
| `git commit -m "mensagem"` | Cria um ponto de restauração oficial com uma descrição do que mudou. |
| `git push origin dev` | Envia os commits do seu computador para o repositório remoto no GitHub. |

### 🚀 Publicação na Web (Cloudflare Pages)
| Comando | O que faz |
| :--- | :--- |
| `npx wrangler pages deploy dist --project-name imerso` | Envia o conteúdo da pasta `dist` direto para a Cloudflare. O site no ar se atualiza em ~10 segundos. |

---

## 5. Como Publicar Novas Atualizações (Passo a Passo)

Sempre que terminar de fazer melhorias ou correções no código do Imerso:

```bash
# 1. Teste o build de produção localmente
npm run build

# 2. Publique na Cloudflare Pages
npx wrangler pages deploy dist --project-name imerso

# 3. Salve o histórico no GitHub
git add .
git commit -m "feat: descrição da melhoria"
git push origin dev
```

Pronto! Seu site e o repositório no GitHub ficam 100% atualizados e sincronizados.

---

## 6. Controle de Versões (Como o Imerso Acompanha Versões)

O Imerso adota o padrão de **Versionamento Semântico (SemVer)** no formato `MAJOR.MINOR.PATCH` (ex: `2.1.0`):

* **MAJOR (2.x.x):** Grandes saltos arquiteturais (ex: reescrita completa React 19).
* **MINOR (x.1.x):** Novas funcionalidades, melhorias visuais e upgrades de telas.
* **PATCH (x.x.1):** Correções pontuais de bugs e hotfixes rápidos.

### 📌 Onde a versão fica registrada
1. **`package.json`**: `"version": "2.1.0"` (padrão oficial do ecossistema Node/NPM).
2. **`src/version.ts`**: `APP_VERSION = '2.1.0'` (lido pelo React e exibido discretamente no menu de idiomas).
3. **`CHANGELOG.md`**: Histórico detalhado de todas as novidades, melhorias e correções organizadas por data.
4. **Git Tags**: Marcações oficiais no histórico do repositório (`git tag v2.1.0`).

### 🏷️ Como lançar uma nova versão
Ao fechar um pacote de melhorias:
```bash
# 1. Atualize o package.json e src/version.ts com a nova versão
# 2. Registre as novidades no CHANGELOG.md
# 3. Compile e envie para a Cloudflare
npm run build
npx wrangler pages deploy dist --project-name imerso

# 4. Crie o commit e a tag de versão no Git
git add .
git commit -m "chore(release): v2.1.0 - UI upgrades e correção de idiomas"
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin dev --tags
```
Com isso, você tem rastreabilidade total do que mudou em cada versão, tanto no código quanto no site em produção!


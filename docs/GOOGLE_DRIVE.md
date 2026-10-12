# ☁️ Sincronização com o Google Drive — Arquitetura, Segurança & Operação

Este documento descreve detalhadamente o funcionamento, arquitetura técnica, segurança, conformidade com a LGPD/GDPR e o guia operacional da sincronização em nuvem do **Imerso** via Google Drive.

---

## 1. Visão Geral & Modelo Mental

O Imerso adota uma arquitetura **100% Client-Side e Offline-First**. 

Tradicionalmente, sincronização entre múltiplos dispositivos exigiria um backend dedicado (ex: servidor Node.js/Python, banco de dados PostgreSQL/Supabase, infraestrutura de autenticação e custos fixos mensais de hospedagem).

Com a integração do Google Drive:
- **Custo de Infraestrutura $0:** Não há servidores proprietários, bancos de dados ou custos de manutenção.
- **Privacidade Absoluta (Zero-Knowledge):** Seus dados de estudo e seus hábitos nunca passam por servidores de terceiros ou pelo criador do aplicativo. Os dados viajam exclusivamente entre o navegador do usuário e os servidores criptografados da própria conta Google dele.
- **Funcionamento Offline-First:** Toda leitura e escrita acontece instantaneamente no `localStorage` do dispositivo. A sincronização com o Drive ocorre de forma assíncrona em segundo plano, garantindo que o app continue 100% rápido e utilizável mesmo sem internet ou em modo avião.

---

## 2. Segurança, Escopo e LGPD / GDPR

### 2.1. O Escopo Estrito `drive.appdata`
O Imerso solicita uma única permissão de escopo ao usuário:
```
https://www.googleapis.com/auth/drive.appdata
```

> [!IMPORTANT]
> **O que esse escopo faz e o que ele NÃO faz:**
> - **O que ele faz:** Cria e acessa uma pasta oculta especial chamada `appDataFolder` dentro da conta do Google Drive do próprio usuário. Nenhum outro aplicativo tem acesso a essa pasta, e os arquivos nela não poluem a visualização comum do Google Drive.
> - **O que ele NÃO faz:** O Imerso **NÃO tem acesso a nenhum outro arquivo**. Ele não pode ver, listar, ler nem editar fotos, documentos, planilhas ou pastas pessoais do usuário.

### 2.2. Precisa de Termo de Consentimento ou Termos de Uso?
- **Tela de Consentimento Nativa do Google (OAuth):** Ao clicar em "Conectar Google Drive", o próprio Google exibe um modal padrão informando claramente: *"O app Imerso deseja ver e gerenciar sua própria pasta de dados de configuração no Google Drive"*. O usuário confirma diretamente com o Google.
- **Modal Interno de Privacidade & LGPD:** O Imerso inclui um diálogo transparente de privacidade (`PrivacyPolicyDialog.tsx`) acessível na tela de Configurações, detalhando que o app não possui rastreadores, não coleta telemetria, não veicula anúncios e que o usuário pode revogar o acesso ou excluir seus dados a qualquer momento com 1 clique.

---

## 3. Arquitetura Técnica & Ciclo de Sincronização

### 3.1. Bibliotecas Utilizadas (Zero Overhead)
Em vez de importar bibliotecas pesadas de Node ou SDKs legados de centenas de kilobytes, a integração utiliza:
1. **Google Identity Services (`gsi/client`):** Script leve e moderno do Google carregado sob demanda (`https://accounts.google.com/gsi/client`) para autenticação por token OAuth 2.0 via popup.
2. **Fetch Nativo HTTP para Google Drive REST API v3:** Chamadas REST leves para:
   - `GET /drive/v3/files?spaces=appDataFolder` (buscar arquivo de backup existente).
   - `GET /drive/v3/files/{id}?alt=media` (baixar conteúdo do backup).
   - `POST /upload/drive/v3/files?uploadType=multipart` (criar arquivo inicial na pasta oculta).
   - `PATCH /upload/drive/v3/files/{id}?uploadType=media` (atualizar arquivo existente).

### 3.2. Formato do Arquivo de Dados no Drive
O arquivo é salvo na pasta `appDataFolder` com o nome `imerso-data-v2.json` e a seguinte estrutura canônica:

```json
{
  "version": 2,
  "lastSyncedAt": 1791813680000,
  "clientDeviceId": "imerso-device-a1b2c3d4",
  "data": {
    "languages": [
      {
        "id": "en",
        "name": "Inglês",
        "nativeName": "English",
        "order": 0,
        "isDefault": true,
        "createdAt": 1790000000000,
        "updatedAt": 1791813680000
      }
    ],
    "sessions": [
      {
        "id": "sess-uuid-1",
        "languageId": "en",
        "startedAt": 1791810000000,
        "endedAt": 1791813600000,
        "duration": 3600,
        "activity": "Escuta",
        "style": "Imersão",
        "notes": ""
      }
    ]
  }
}
```

### 3.3. Algoritmo de Merge Bidirecional (Sem Perda de Dados)
Quando a sincronização é executada entre dois dispositivos (ex: Celular e Computador):
1. **União por ID de Sessão (`sessions`):**
   - As sessões locais e as sessões da nuvem são indexadas por seus IDs únicos (`session.id`).
   - Se uma sessão existe no celular mas ainda não no computador, ela é preservada.
   - O resultado final é a união matemática dos conjuntos, garantindo que nenhuma sessão registrada offline seja apagada acidentalmente.
2. **Merge de Idiomas (`languages`):**
   - Idiomas são combinados por ID (`lang.id`).
   - Se houver divergência de atributos, vence o registro com o maior `updatedAt`.
3. **Persistência Simultânea:**
   - O resultado fundido é salvo no `localStorage` local e imediatamente enviado de volta ao Google Drive atualizado.

### 3.4. Momentos em que a Sincronização Ocorre
- **Manual:** Ao tocar no botão "Sincronizar agora" na página de Configurações.
- **Ao Conectar:** Logo após o usuário autenticar a conta pela primeira vez.
- **Auto-Sync Silencioso:** Sempre que uma sessão de estudo for finalizada com sucesso ou excluída no histórico (caso a conta esteja conectada e com token ativo).

---

## 4. Guia de Configuração no Google Cloud Console

Para que a autenticação funcione no ambiente local e no domínio de produção da Cloudflare Pages:

### Passo 1: Criar/Acessar o Projeto
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto ou selecione o projeto existente (ex: `Imerso`).

### Passo 2: Ativar a Google Drive API
1. No menu lateral, acesse **APIs e Serviços** > **APIs e serviços ativados**.
2. Clique em **+ Ativar APIs e serviços**.
3. Pesquise por `Google Drive API` e clique em **Ativar**.

### Passo 3: Configurar a Tela de Consentimento OAuth
1. Acesse **APIs e Serviços** > **Tela de consentimento OAuth**.
2. Escolha **Tipo de Usuário:** `Externo` (External) e clique em Criar.
3. Preencha as informações básicas:
   - **Nome do app:** `Imerso`
   - **E-mail de suporte:** seu e-mail pessoal ou de suporte.
   - **E-mail do desenvolvedor:** seu e-mail.
4. Na aba **Escopos**, clique em **Adicionar ou remover escopos** e busque por:
   - `https://www.googleapis.com/auth/drive.appdata` (Ver, criar e excluir arquivos de configuração próprios).
5. Na aba **Usuários de teste** (enquanto o app estiver em modo de teste):
   - Adicione sua própria conta Google (`seu-email@gmail.com`) e quaisquer contas que você vá usar para testar antes de publicar para o público geral.

> [!TIP]
> **Modo Teste vs Modo Produção:**
> - Enquanto o app estiver com status **"Em teste"** (Testing), apenas os e-mails cadastrados na lista de usuários de teste conseguem fazer login.
> - Ao clicar em **"Publicar aplicativo"** (Publish App), qualquer pessoa no mundo com conta Google poderá sincronizar seus dados no Imerso.

### Passo 4: Criar as Credenciais OAuth 2.0 (Web)
1. Acesse **APIs e Serviços** > **Credenciais**.
2. Clique em **Criar credenciais** > **ID do cliente OAuth**.
3. Selecione o Tipo de Aplicativo: **Aplicativo da Web**.
4. Em **Origens JavaScript autorizadas (Authorized JavaScript Origins)**, adicione:
   - `http://localhost:5173` *(para testes no ambiente de desenvolvimento local)*
   - `https://imerso.pages.dev` *(seu domínio oficial na Cloudflare Pages)*
   - *(Opcional)* Se você possuir domínio próprio (ex: `https://imerso.app`), adicione-o aqui também.
5. Em **URIs de redirecionamento autorizados**, deixe **vazio** (pois a autenticação utiliza o popup moderno via token in-page).
6. Copie o **ID do cliente** gerado (terminado em `.apps.googleusercontent.com`).

---

## 5. Configuração de Variáveis de Ambiente & Deploy

### 5.1. Ambiente Local (`.env`)
No arquivo `.env` na raiz do projeto:
```env
VITE_GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
```

### 5.2. Cloudflare Pages (Produção)
1. Acesse o painel da [Cloudflare](https://dash.cloudflare.com/) > **Workers & Pages** > **imerso**.
2. Vá em **Settings** > **Environment variables**.
3. Adicione a variável:
   - **Variable name:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** O mesmo ID do cliente gerado no Google Cloud Console.
4. Salve. As próximas compilações e deploys injetarão automaticamente o ID no bundle compilado do Vite.

### 5.3. Headers de Segurança & Content Security Policy (`public/_headers`)
O Imerso inclui um arquivo `public/_headers` otimizado para a Cloudflare Pages com as diretivas necessárias:
```http
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https: blob:; connect-src 'self' https://accounts.google.com https://apis.google.com https://www.googleapis.com; frame-src https://accounts.google.com; object-src 'none'; base-uri 'self';
```

---

## 6. Roteiro de Testes / Checklist de QA

Antes de liberar a funcionalidade em produção:

- [ ] **Fluxo de Conexão Inicial:**
  1. Abrir o app no navegador.
  2. Acessar **Configurações** > card do **Google Drive**.
  3. Clicar em **Conectar Google Drive**.
  4. O popup do Google deve abrir sem erros de CSP ou CORS.
  5. Após selecionar a conta, o card deve exibir seu e-mail e o status "Conectado".
- [ ] **Sincronização Bidirecional:**
  1. No computador: registrar uma sessão teste de 1 minuto em um idioma qualquer.
  2. Abrir o app no celular (ou em uma janela anônima logada no mesmo Drive).
  3. Verificar se a sessão e o histórico aparecem corretamente após sincronizar.
- [ ] **Desconexão Segura:**
  1. Clicar no botão **Desconectar**.
  2. Verificar se o token é limpo do `localStorage` e os dados locais permanecem intactos.
- [ ] **Exportação Manual JSON de Contingência:**
  1. Clicar em **Exportar backup (.json)** e validar que o arquivo baixa perfeitamente contendo todas as sessões e idiomas.

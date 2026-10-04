# Spec · Timer, resumo, registro manual, prática, histórico, idiomas e metas

App de registro de estudo de idiomas por imersão. Este documento reúne as decisões tomadas até aqui.

**Legenda:** ✅ decidido · 🟡 proposto por mim e não contestado · ❓ em aberto

## 1. Objetivos de produto

1. Tornar o progresso de estudo mais palpável e gamificado.
2. Iniciar uma sessão precisa ter o mínimo de fricção.

Estilo atual: wireframe cru, escuro, bordas finas, sem cor. Componentes reais (Base UI), estilos depois.

## 2. Estrutura do app

- ✅ O app é organizado por **idioma, como um perfil**. Tudo o que o usuário faz pertence ao idioma selecionado, inclusive histórico, metas e níveis.
- ✅ Trocar de idioma troca de perfil. Telas de ação (resumo, registro manual, edição) usam o idioma atual, sem seletor.
- ✅ O seletor de idioma fica **travado enquanto há sessão em andamento**. 🟡 Tocar nele mostra o toast "Encerre a sessão para trocar de idioma".
- ✅ **Bottom nav** com quatro abas: **Timer**, **Metas**, **Estatísticas** e **Histórico**.
- ✅ A nav **some enquanto há sessão em andamento** (rodando ou pausada) e volta ao encerrar.
- ✅ A home continua sendo o timer limpo, sem número, nível ou sequência.
- ✅ O seletor de idioma aparece no topo de cada aba, abrindo a mesma sheet de troca.
- Telas de ação (resumo, registro manual, edição, adicionar e gerenciar idiomas) ficam **sem nav**.

## 3. Timer (aba inicial)

| Estado | Timer | Controles |
|---|---|---|
| Ocioso | `00:00:00`, apagado | **Iniciar** (botão grande, largura total), mais o botão `+` de registro manual e a nav |
| Rodando | aceso | **Pausar** e **Encerrar**, lado a lado, mesmo tamanho. Sem nav |
| Pausado | aceso | **Retomar** e **Encerrar**, lado a lado, mesmo tamanho. Sem nav |

- ✅ Variação A: botões grandes, lado a lado depois do Iniciar, sem hierarquia entre eles.
- ✅ Formato `hh:mm:ss`.
- 🟡 Toques nos primeiros ~500 ms após qualquer ação são ignorados.
- 🟡 O tempo é calculado por **timestamp**, não por intervalo. Fechar o app ou bloquear a tela não altera a contagem.
- ✅ **Nenhuma prática é escolhida antes ou durante a sessão.** A escolha acontece só depois do Encerrar.

### Encerrar

- ✅ Encerrar não pede confirmação e abre o resumo.
- 🟡 A sessão é **salva no momento do Encerrar**. O resumo edita o registro existente.

## 4. Resumo da sessão (depois do Encerrar)

Ordem da tela, de cima para baixo:

1. **X** no canto superior esquerdo (descartar, ver abaixo).
2. **Tempo da sessão**, campo único `hh:mm:ss` no topo, para o teclado não cobri-lo.
3. **Prática**, uma linha que abre a sheet (seção 6).
4. **Barra de ação** com **Pronto** (seção 4.1).

- ✅ O campo é preenchido com o valor exato medido.
- ✅ O usuário pode **aumentar o tempo além do medido**, sem aviso.
- ✅ Início e fim não aparecem nesta tela.
- 🟡 Validação do campo: minutos e segundos acima de 59 são normalizados ao sair do campo; teto de 24 h por sessão; campo vazio vale 0.

### 4.1 Campo de tempo e teclado

- ✅ **Campo único**, no lugar de três caixas (hh, mm, ss). Teclado numérico **do sistema**, sem teclado próprio.
- ✅ Ao focar, o número é selecionado inteiro, e o primeiro dígito substitui tudo.
- ✅ Os dígitos entram **da direita para a esquerda**, como no relógio da Samsung: digitar 4, 7, 0, 0 mostra `00:47:00`. O apagar desloca para a direita.
- ✅ **Barra de ação compacta**: botão sólido de largura total, **56 px** (antes 96 px), mesma altura com o teclado aberto ou fechado.
- ✅ Com o teclado aberto, a barra **sobe e fica colada em cima dele**. Um toque valida e salva, sem fechar o teclado.
- ✅ A barra tem **só a ação principal**, sem Cancelar. O X no topo continua sendo a saída, longe do polegar.
- 🟡 Com erro no tempo, o teclado permanece aberto e o foco volta ao campo. Com erro só na prática ou na data, o foco não vai a lugar nenhum, porque ambos abrem sheet ou calendário.
- ❓ A posição da barra depende de medir a altura do teclado e se comporta diferente no iOS e no Android. Precisa ser testada no aparelho.

### Erros inline

Aparecem ao tocar em **Pronto** / **Salvar sessão** / **Salvar alterações**. O botão nunca fica desabilitado (única exceção: o diálogo de remover idioma, seção 8). Cada erro aparece embaixo do seu campo, que ganha borda destacada. Os erros podem aparecer juntos e somem quando o campo é corrigido.

| Condição | Mensagem |
|---|---|
| Tempo em `00:00:00` | Informe um tempo maior que 00:00:00. |
| Dia passaria de 24 h (registro manual e edição) | O dia passaria de 24 h. Máximo para esta sessão: 5h10. |
| Dia já com 24 h | Este dia já tem 24 h registradas. |
| Nenhuma prática escolhida | Escolha uma prática para salvar. |
| Escuta e leitura, Escuta ou Leitura sem estilo | Escolha o estilo da prática. |

### Teto de 24 h por dia

- ✅ A soma das sessões de um dia **não passa de 24 h**, para não criar casos de borda. Vale para o registro manual e a edição.
- 🟡 A soma considera as sessões do dia **de todos os idiomas**, porque a pessoa só tem 24 h.
- 🟡 O Encerrar não é bloqueado pelo teto, porque a sessão já foi salva.
- ❓ Sobreposição de horários continua fora do escopo; o teto cobre o pior caso.

### Descartar

- ✅ O **X** descarta a sessão e volta ao timer.
- 🟡 Se o tempo medido for **até 10 s**, descarta direto. Acima disso, abre uma confirmação: "Descartar esta sessão?" · "Os 47 min não serão registrados." · **Cancelar** / **Descartar** (foco inicial em Cancelar). O limite de 10 s é um valor de teste.
- Toast: "Sessão descartada".

## 5. Prática

### Regras

- ✅ **Cada sessão tem uma única prática.**
- ✅ **Nada vem pré-selecionado**, e o app não lembra a última escolha. Se a pessoa não escolhe, o erro inline aparece.
- ✅ O **tempo total inclui todas as práticas**, com os dados separados por prática.
- ✅ A estrutura parte das **habilidades que todo mundo conhece**, com nomes em substantivo (não verbos).
- ✅ "Estudo" foi eliminado como categoria. Termos como "input" e "output" foram descartados por serem difíceis para o usuário.

### Lista de práticas (nesta ordem)

1. Escuta e leitura
2. Escuta
3. Leitura
4. Fala
5. Escrita
6. Pronúncia
7. Gramática
8. Vocabulário (por enquanto, só Anki)

- ✅ Sem subcategorias: os detalhes antigos (sozinho, com IA, professor, criar ou revisar cards) não são registrados.
- ✅ "Assistir" não é uma prática: com legenda é Escuta e leitura, sem legenda é Escuta.

### Estilo (só para Escuta e leitura, Escuta e Leitura)

- ✅ Duas opções: **Imersão** e **Imersão interativa**. A diferença é a **quantidade** de pausas para consultar palavras, não existência ou ausência.
- ✅ Subheaders:
  - **Imersão:** Poucas ou nenhuma pausa para consultar palavras.
  - **Imersão interativa:** Pausas frequentes para consultar palavras.
- ✅ A escolha é subjetiva: o app não define um número de pausas.
- 🟡 "Horas de imersão" é um número calculado (soma de Escuta e leitura, Escuta e Leitura), sem exigir que a pessoa escolha "imersão" como prática.

## 6. A sheet de prática

- ✅ A seleção usa uma **bottom sheet**, não um dropdown nem chips. Sem controle segmentado (não escala).
- ✅ **Tela 1:** lista única de práticas (seleção por linha, sem seções). Escolher Fala, Escrita, Pronúncia, Gramática ou Vocabulário fecha a sheet.
- ✅ **Tela 2** (só para as três práticas de imersão): a sheet **troca de conteúdo**, sem navegar. Título "Como foi a prática?", botão `‹` no topo com o nome da prática para voltar, e as duas opções com subheader. Escolher o estilo fecha a sheet.
- ✅ Tocar fora fecha a sheet sem mudar mais nada.
- A linha de prática na tela mostra "Selecionar prática" (cinza) vazia e "Escuta e leitura · Imersão" depois de escolhida.

### Escalabilidade

- 🟡 Uma **prática** é `{nome, facetas opcionais}`. Uma **faceta** é `{nome, opções}`. O estilo é uma faceta que hoje só as três práticas de imersão têm.
- 🟡 A sessão guarda `prática` + `facetas`. Uma prática customizada no futuro é só uma prática sem facetas, e uma faceta nova se anexa a qualquer prática, sem mudar o histórico.
- 🟡 Se houver mais facetas, a tela 2 da sheet vira uma sequência de passos, ou cada faceta vira uma linha separada na tela.

## 7. Modelo de dados

- ✅ Cada sessão guarda **`startedAt` + `duration`**. O fim é **derivado**.
- ✅ Sessão que cruza a meia-noite **conta inteira no dia do `startedAt`**.
- ✅ Início e fim ficam registrados, mas só aparecem no histórico.
- 🟡 `source`: `timer` ou `manual`, usado só para marcar o histórico.
- 🟡 Campos da sessão: `language`, `startedAt`, `duration`, `practice`, `style` (opcional), `source`.
- ✅ Cada idioma tem um **identificador estável**; o nome exibido vem de uma lista fixa.

## 8. Idiomas

### Escolha

- ✅ O idioma vem de uma **lista fixa e pesquisável**, sem texto livre. Isso evita duplicatas ("Coreano", "coreano", "Korean").
- ✅ Os idiomas mais comuns aparecem **pré-selecionados no topo** (Inglês, Espanhol, Japonês, Coreano, Francês, Alemão, Italiano, Mandarim); o restante em ordem alfabética, com a busca cobrindo todos.
- 🟡 Cada linha mostra o nome no idioma do app e o **nome nativo em cinza** (한국어, 日本語). Bandeiras ficam para o futuro.
- 🟡 Se o idioma não está na lista, a saída é "Sugerir um idioma", sem aceitar texto livre.
- 🟡 Sem limite de idiomas; o nome não é editável.

### Primeiro uso e abertura

- ✅ **Sem nenhum idioma**, a tela inicial vira uma tela única, "Qual idioma você está aprendendo?", com busca e a lista. Escolher um leva direto ao timer, sem botão de continuar.
- ✅ O mesmo vale se a pessoa remover o último idioma.
- 🟡 Ao abrir o app, vai para o **último idioma usado**. Se ele tiver sido removido, abre o primeiro da lista.

### Troca

- ✅ **Bottom sheet**, aberta pelo seletor "Coreano ⌄" do topo, no mesmo padrão da sheet de prática. Lista os idiomas do usuário com o atual marcado e, fixos embaixo, **Adicionar idioma** e **Gerenciar idiomas**.
- ✅ **Regra de botões no rodapé da sheet:** Múltiplos botões no rodapé devem ter **obrigatoriamente a mesma altura** (mínimo de 44 px / `h-11`) e tamanho de texto consistente (`text-sm` / 14 px), sem botões diminuídos.
- ✅ **Regra do piso de 12 px:** Nunca usar tamanho de fonte inferior a 12 px (`text-xs`) no app inteiro.
- ✅ **Regra de rolagem e fades:** Máscaras de gradiente devem ser dinâmicas (`ScrollAreaFade`). O topo NUNCA tem fade quando `scrollTop === 0` (o primeiro item começa 100% nítido e opaco).
- ✅ O **indicador de seleção fica à direita**, deixando a esquerda livre para uma bandeira no futuro.
- ✅ A sheet rola com altura máxima de 92%.

### Adicionar

- ✅ **Página inteira**, com X no topo, busca e lista.
- ✅ Adicionar **pela sheet** troca direto para o idioma novo e volta ao timer, com o toast "Japonês adicionado".
- ✅ Adicionar **pelo Gerenciar idiomas** só inclui na lista, sem trocar.

### Gerenciar idiomas

- ✅ **Página inteira** (seta `‹` para voltar), com uma lista só. Cada linha tem **ícone de arrastar** à esquerda, o **nome com o total de horas embaixo** ("Sem sessões" quando não há) e **lixeira** à direita. Tocar na linha não abre nada.
- ✅ A ordem é a de inclusão, com **reordenação manual por arrastar**. Não há ordenação por uso recente.
- ✅ Não mostra "atual" nesta tela.

### Remover

- ✅ Existe **uma só ação**: remover o idioma e **apagar o histórico dele**. A ação reversível ("Remover da lista", guardando o histórico) foi eliminada, junto com a tela individual do idioma.
- ✅ Diálogo central: "Remover Coreano?" · "Isso apaga 132 h e 214 sessões. Não dá para desfazer." · "Digite **remover** para confirmar" · **Cancelar** / **Remover**.
- ✅ O botão **Remover** fica desabilitado até o texto bater (a palavra é a mesma em qualquer idioma, para ser universal). É a única exceção à regra de botão nunca desabilitado.
- ✅ Depois de remover, o toast diz "Coreano removido". Se era o idioma atual, passa ao primeiro da lista; se era o último, volta à tela de primeiro uso.

### Padrões de superfície

| Ação | Padrão |
|---|---|
| Trocar de idioma | Bottom sheet |
| Adicionar idioma | Página inteira |
| Gerenciar idiomas | Página inteira |
| Confirmação de remover | Diálogo central |

## 9. Registro manual

- ✅ Existe, para quem estudou fora do app ou esqueceu de iniciar.
- ✅ **Botão de entrada:** só o ícone `+`, sem borda e em cinza, no canto superior direito do timer, em frente ao seletor de idioma. O rótulo "Registrar sessão" fica como texto de acessibilidade e dica. Mínimo de 44 px. 🟡 Some enquanto há sessão em andamento.
- ✅ A tela é igual ao resumo do Encerrar, com mais um item: o **seletor de data** (abaixo do tempo). Padrão **Hoje**. Tocar abre o calendário nativo do aparelho.
- 🟡 Datas futuras bloqueadas. O texto mostra **Hoje**, **Ontem** ou `dd/mm/aaaa`.
- ✅ Idioma: o do perfil atual.
- ✅ O **X** no canto superior esquerdo só fecha a tela (nada foi salvo). Botão final: **Salvar sessão**.

### `startedAt` de uma sessão manual

- ✅ **Data passada:** 12:00 daquele dia.
- ✅ **Hoje, duração maior que o tempo desde a meia-noite:** 00:00 de hoje.
- ✅ **Hoje, caso normal:** agora menos a duração.

## 10. Copy

| Elemento | Texto |
|---|---|
| Botões do timer | Iniciar · Pausar · Retomar · Encerrar |
| Confirmar resumo | Pronto |
| Confirmar registro manual | Salvar sessão |
| Confirmar edição | Salvar alterações |
| Entrada do registro manual | Registrar sessão (acessibilidade e dica) |
| Campo de tempo | Tempo da sessão |
| Linha de prática | Prática · Selecionar prática |
| Toast ao encerrar | Sessão salva · 47 min · Escuta e leitura · Imersão |
| Toast no registro manual | Sessão registrada · 1h30 · Fala · ontem |
| Toast ao descartar | Sessão descartada |
| Toast ao editar | Sessão atualizada |
| Toast ao excluir sessão | Sessão excluída |
| Toast de idioma | Japonês adicionado · Coreano removido |
| Dica com sessão em andamento | Encerre a sessão para trocar de idioma |

Regras: verbo no imperativo nos botões, passado nos toasts, sentence case, sem rótulos genéricos como "OK", rótulos de prática em substantivo.

## 11. Histórico

Tela só para **conferir e corrigir** sessões, e uma das abas da bottom nav (seção 2). O progresso fica na aba Metas.

### Escopo e navegação

- ✅ Vai **até o começo de tudo**, sem limite de tempo. 🟡 Carrega aos poucos (por mês).
- ✅ Mostra só as sessões do **idioma atual**.
- ✅ Navegação por **rolagem contínua**, com o **mês fixo no topo** ("Outubro 2026") e um **botão de calendário** no topo à direita que abre o seletor nativo do aparelho e salta para o dia escolhido (ou o mais próximo anterior).

### Estrutura da lista

- ✅ Agrupada **por dia**, do mais recente ao mais antigo. Cada dia é um **container com fundo ligeiramente mais claro** e cantos arredondados, com espaço entre os blocos.
- ✅ O **título do dia fica fora do bloco**, acima dele, pequeno e cinza: Hoje, Ontem ou "qui, 1 out". O mês aparece só no cabeçalho fixo.
- ✅ O **título do dia não leva número**. O total do dia sai do título para não criar duas famílias de números.
- ✅ O **total do dia** é a **última linha do bloco**, na mesma coluna das durações, abaixo de um traço fino, em cinza. Só aparece em dias com **2 ou mais sessões**.
- ✅ Dentro do bloco, uma coluna só de números: as durações, alinhadas à direita e em cinza.
- 🟡 Agrupar por semana ficou de fora: seria um terceiro nível e as semanas cruzam meses.

### Linha de sessão

- ✅ Mostra **prática** à esquerda e **duração** à direita, e o **estilo** (Imersão ou Imersão interativa) embaixo da prática, em cinza, quando existe.
- ✅ **Não mostra** horário nem marca de registro manual.
- ✅ Quando não há estilo, a prática fica **centralizada na vertical** na linha.
- ✅ Tamanhos: nada abaixo de **12 px**. 12 px só em apoio, 13 a 14 px em informação secundária, 16 px no que importa (prática, duração). Linha com no mínimo 48 px de altura.
- ✅ A UI será refinada depois; a estrutura está fechada.

### Editar uma sessão

- ✅ Tocar numa sessão abre a **tela do registro manual, preenchida** (tempo, data e prática editáveis).
- ✅ Título "Editar sessão". O **X só fecha**, sem salvar e sem confirmação. Botão final: **Salvar alterações**, com os mesmos erros inline e o teto de 24 h.
- 🟡 Se a data muda, o `startedAt` segue as regras do registro manual (seção 9). Se não muda, a sessão **mantém o horário original**.
- ✅ **Excluir sessão**: botão em texto simples, na cor de aviso, no fim da tela, longe do botão principal.
- ✅ A exclusão sempre pede confirmação: "Excluir esta sessão?" · "Os 47 min de Escuta e leitura não serão mais contados." · **Cancelar** / **Excluir** (foco inicial em Cancelar). Depois volta ao histórico com o toast "Sessão excluída".
- ✅ Sem **Desfazer** nesta versão. Excluir remove a sessão de todos os contadores e metas.

## 12. Metas e níveis

Aba **Metas** da bottom nav. Progresso e metas são a **mesma tela**.

- ✅ Vocabulário: **Metas** (no lugar de marcos) e **Nível 1, 2, 3...** para cada degrau.
- ✅ O seletor de idioma permanece no **topo de todas as 3 abas principais** (Timer, Metas, Histórico), garantindo clareza imediata de qual perfil está ativo.
- ✅ O contador que dirige as metas é o **total geral de horas** do idioma (todas as práticas).
- ✅ O número isolado de **imersão foi removido** da tela de metas (fica para uma futura tela dedicada de estatísticas).
- ✅ O registro manual conta **igual** a uma sessão cronometrada.
- ✅ O herói da tela é o **total acumulado em grande** (ex: `14h 32m`), sem rótulo redundante "Total em [Idioma]".

### Card integrado do Nível Atual

Logo abaixo do total geral, um card integrado destaca o progresso no nível ativo:
- ✅ **Topo do card**: **Nível X** à esquerda e o progresso **relativo à duração do nível** à direita (ex: no Nível 5 de 10h a 20h, a amplitude é de 10h, exibindo `4h 30m / 10 h`), em fonte numérica tabular. Elimina a repetição do total geral acumulado e garante que o tempo feito mais o faltante fechem exatamente a meta do nível.
- ✅ **Barra de progresso contínua com divisões internas**:
  - Trilha única sólida com linhas verticais sutis (estilo régua/gauge) cortadas na cor de fundo do card a cada marco interno.
  - Para níveis de até ~15 h de amplitude: **1 subdivisão por hora**.
  - Para níveis longos (amplitudes de 50 h ou 100 h): dividida em **10 blocos proporcionais**.
  - O preenchimento da barra é fluido e contínuo, correndo sob os traços da régua.
  - Substitui o antigo texto numérico "Submeta 1 de 10" por uma leitura visual direta e moderna.
- ✅ **Rodapé do card**: texto secundário limpo indicando o que falta para subir de nível: `"Faltam 5h 30m para o Nível 6"` (eliminando a frase antiga `"52 min de 1h - faltam 8 min"`).
- ✅ **Nível máximo concluído**: exibe mensagem de conclusão com total acumulado.

### Níveis

- ✅ Cada nível é uma faixa de horas. Os dez primeiros, da escala existente:

| Nível | Faixa |
|---|---|
| 1 | 0 h – 1 h |
| 2 | 1 h – 3 h |
| 3 | 3 h – 5 h |
| 4 | 5 h – 10 h |
| 5 | 10 h – 20 h |
| 6 | 20 h – 35 h |
| 7 | 35 h – 50 h |
| 8 | 50 h – 75 h |
| 9 | 75 h – 100 h |
| 10 | 100 h – 150 h |

- ❓ **Níveis de 150 h a 1000 h.** O protótipo usa espaço reservado: 150–200, 200–300, 300–400, 400–500, 500–600, 600–750, 750–1000 h. Falta a escala real.
- A lista de níveis aparece abaixo do herói: concluídos com check, o atual com anel, os próximos com cadeado e esmaecidos.

### Depois de 1000 h

- ❓ O que acontece depois do nível máximo. **Recomendação:** sem níveis novos; o total continua em grande, com "Nível máximo · próxima marca: 1100 h", e uma marca de comemoração a cada 100 h. No protótipo, hoje só aparece "Você concluiu todos os níveis".

## 13. Estatísticas

Aba **Estatísticas** da bottom nav. Análise qualitativa da distribuição de tempo de estudo do perfil ativo.

### Escopo e Filtros

- ✅ O seletor de idioma permanece no topo, no mesmo padrão de todas as abas.
- ✅ **Filtro de período:** `Tudo` (padrão), `Este mês` e `Esta semana`. Recalcula as métricas para o recorte selecionado.
- ✅ **Herói numérico:** total de horas estudadas no período selecionado (ex: `10h 47m`), sem texto redundante.

### Os 3 Macro-Pilares de Estudo

Para eliminar a sobrecarga cognitiva e o "ping-pong" de comparar 8 cores numa legenda distante, as 8 práticas são consolidadas em **3 Macro-Pilares** conceituais:

1. **Imersão** (`#ededed` / tom claro):
   - Escuta e leitura
   - Escuta
   - Leitura
2. **Produção** (`#8b8b85` / tom médio):
   - Fala
   - Escrita
3. **Fundamentos** (`#50504d` / tom escuro):
   - Pronúncia
   - Gramática
   - Vocabulário

### Visualização

- ✅ **Barra Macro no topo:** Trilha horizontal única dividida em 3 fatias proporcionais correspondentes aos 3 pilares. Permite leitura instantânea da proporção macro da rotina de estudo.
- ✅ **Cards de Pilares:** Abaixo da barra, cada pilar ativo é apresentado em seu próprio bloco:
  - Cabeçalho com indicador circular de tom, nome do pilar e total de horas + % do estudo geral (ex: `Imersão · 6h 52m · 64%`).
  - Lista simples das práticas componentes do pilar com tempo e % do estudo geral.
- 🟡 **Ideia guardada (Rosca / Donut interativo):** Gráfico circular central com toque nas fatias e card de inspeção, mantido como exploração visual para futuras iterações gráficas mais chamativas.

## 14. Timer esquecido ("ainda está aí?")

- ✅ **Tempo limite:** após **3 horas ininterruptas** de sessão rodando, o app exibe um diálogo central "Ainda está estudando?".
- ✅ **O timer continua rodando em segundo plano** enquanto o diálogo está aberto (sem pausar a medição por timestamp).
- ✅ **Ações do diálogo:**
  - **Continuar:** fecha o diálogo e posterga a próxima verificação para mais 3 horas.
  - **Encerrar:** interrompe o timer no momento do clique e abre diretamente a tela de Resumo da sessão, sem confirmações adicionais.
- ✅ O tempo decorrido até o encerramento é contado integralmente, com a possibilidade usual de ajuste fino no resumo.

## 15. Em aberto

- ❓ Escala de níveis de 150 h a 1000 h e o comportamento depois de 1000 h (seção 12).
- ❓ Altura e posição da barra de ação com o teclado em iOS e Android (seção 4.1).
- ❓ Sessões sobrepostas ao editar tempo ou registrar manualmente (o teto de 24 h cobre o pior caso).
- ❓ Horário de verão e fuso em `startedAt` de sessões antigas.
- ❓ Sessões com duas coisas: por ora, a pessoa escolhe a principal ou encerra e inicia outra.
- ❓ Mapa dos itens de gamificação além das metas: heatmap, equivalências, meta semanal, sequência.
- ❓ Filtros por prática no histórico.
- ❓ Se um dia haverá página de configurações global (tema, notificações, exportar dados, conta). Hoje o Gerenciar idiomas vive no seletor de idioma.
- ❓ Política de dados: apagar um idioma é definitivo e não há exportação.

## 16. Ideias levantadas e não decididas

Heatmap de dias, equivalências tangíveis ("≈ 90 episódios"), meta semanal no lugar de sequência diária rígida, agrupar o histórico por semana (com meta semanal), "Recentes" na sheet de prática (atalhos das combinações mais usadas, sem marcar nada), bandeiras nos idiomas, "Desfazer" ao excluir uma sessão, marcas de comemoração a cada 100 h depois do nível máximo.

## 17. Protótipos

- **Protótipo atual** (timer, resumo, registro manual, sheet de prática, histórico novo, edição e exclusão, idiomas, campo único de tempo, bottom nav e metas): https://claude.ai/artifact/StLqWTFad6177co4U1vSXD
- Histórico, primeira rodada (3 opções de hierarquia): https://claude.ai/artifact/SgCJMkCdebCHqNACnqzkhG
- Histórico, segunda rodada (container com total no pé; a opção 1 foi a escolhida): https://claude.ai/artifact/SUdQbRGKNYFd1kxiecL38G
- Fluxo anterior (timer, resumo, registro manual, sheet de prática): https://claude.ai/artifact/XrpZnF85M6XJR7y1Bvsw4w
- Variações dos controles do timer: https://claude.ai/artifact/KSf5yhL8LL4xs3sJzuCYNK
- Opções de seleção de prática (exploração): https://claude.ai/artifact/1YGn5zvfaqwAuB6q2EhZnp
- Histórico, variações antigas: https://claude.ai/artifact/LPFGJTC1yPQ3xLSb4vNLB7 e https://claude.ai/artifact/CmcxwjyrEsE5AGNX2zzNvz

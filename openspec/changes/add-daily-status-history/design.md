## Context

A aplicação atual gerencia a cronometragem e persiste as sessões finalizadas no `localStorage` sob a chave `status_timer_sessions`. Esta evolução adiciona uma barra de navegação no topo com alternância entre a tela de cronometragem ("Cronômetro") e a tela de histórico ("Histórico"), além de recursos para consultar, copiar e editar registros diários salvos.

## Goals / Non-Goals

**Goals:**
- Implementar uma barra de navegação no topo (navbar) com abas estilizadas no padrão IDE.IA para alternar entre as visualizações `#view-timer` e `#view-history`.
- Garantir que a alternância para a aba de histórico não interrompa nem interfira na contagem ativa do cronômetro (`RUNNING` ou `PAUSED`).
- Desenvolver a interface do Histórico com agrupamento por dia e navegação temporal ("Dia Anterior", seletor de data `input[type="date"]`, "Próximo Dia", e atalho "Hoje").
- Renderizar cards individuais de status contendo metadados (squad, minutagem, timestamp) e o texto completo do comando `/status`.
- Disponibilizar ações individuais por card:
  - **Copiar**: transfere o comando daquele card para o clipboard com feedback visual ("Copiado!").
  - **Editar**: ativa modo de edição in-place (textarea livre), permitindo corrigir o comando e atualizar o registro existente no `localStorage` (pelo `id`) sem criar novos itens ou duplicatas.
- Exibir estado vazio informativo caso a data selecionada não contenha registros.

**Non-Goals:**
- Sincronização em nuvem ou banco de dados externo (persistência estritamente local em `localStorage`).
- Exclusão em massa ou paginação de múltiplos anos (a navegação diária atende o fluxo de trabalho ágil).

## Decisions

### 1. Roteamento Client-side Baseado em Abas
- **Decisão**: Gerenciar as telas através da alternância de classes CSS (`active` / display toggle) mantendo os dois containers no DOM (`#view-timer` e `#view-history`).
- **Justificativa**: Evita recarregamento de página e garante que o estado em memória do cronômetro (`timerState`, `startTime`, `accumulatedTimeMs`) permaneça 100% ativo e preciso enquanto o usuário navega pelo histórico.

### 2. Agrupamento e Filtragem Temporal
- **Decisão**: Extrair a data local no formato `YYYY-MM-DD` a partir do campo `createdAt` de cada registro.
  - A tela de histórico exibirá por padrão o dia atual (`new Date()`).
  - O usuário pode avançar/retroceder dias pelos botões laterais ou escolher qualquer data no date picker.
- **Justificativa**: Proporciona visualização focada no dia de trabalho ou em datas passadas para reuniões diárias (dailies).

### 3. Mecanismo de Edição In-Place
- **Decisão**: Cada card de histórico terá dois estados de visualização:
  - *Modo Leitura*: Exibe o bloco de comando estilizado, badges de metadados e botões "Copiar" e "Editar".
  - *Modo Edição*: Substitui o bloco por um `textarea` com o texto atual e botões "Salvar" e "Cancelar".
  - Ao salvar, localiza o item no array do `localStorage` pelo identificador único `id`, atualiza `item.generatedCommand`, grava de volta via `localStorage.setItem` e re-renderiza a listagem.
- **Justificativa**: Permite correções pontuais rápidas (ex.: consertar um número de issue ou descrição de atividade) sem complexidade de reabrir o formulário modal completo.

## Risks / Trade-offs

- **[Dados legados ou formato inconsistente em localStorage]** → *Mitigação*: Leitura protegida por `try/catch`, validação defensiva dos campos ao renderizar cada card e fallback para valores padrão caso algum atributo opcional esteja ausente.
- **[Conflito de cópia no clipboard entre múltiplos botões]** → *Mitigação*: Cada botão de cópia gerencia seu próprio estado visual de feedback ("Copiado!") de forma isolada e dispara toast global.

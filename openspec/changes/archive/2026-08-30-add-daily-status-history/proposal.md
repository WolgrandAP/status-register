## Why

Atualmente, o aplicativo grava as sessões de trabalho finalizadas no `localStorage`, mas não disponibiliza uma interface visual para os desenvolvedores consultarem seus registros passados, copiarem mensagens antigas para dailies retroativas ou corrigirem eventuais erros de digitação nas mensagens geradas.

Esta alteração adiciona um sistema de navegação por abas fixo no topo ("Cronômetro" e "Histórico") e uma tela de Histórico Diário de Status, permitindo visualizar os status agrupados por data, navegar entre dias anteriores, copiar comandos específicos com um clique e editar diretamente o texto de status já gravados com atualização imediata no `localStorage`.

## What Changes

- **Navegação Fixa por Abas no Topo**:
  - Aba 1: "Cronômetro" (ou "Novo Status") — mantém o fluxo e funcionamento atual de cronometragem sem nenhuma alteração.
  - Aba 2: "Histórico" — exibe a visualização de sessões gravadas.
- **Tela de Histórico Diário**:
  - Agrupamento dos registros por dia (exibição de data e total de horas/minutos dedicados do dia).
  - Seletor de data e controles de paginação/navegação por dia ("Dia Anterior", "Hoje", "Próximo Dia").
  - Renderização de cada cartão de status com visualização clara do comando gerado, squad, horário e minutagem.
  - Ação **"Copiar"** individual por item (cópia rápida do comando específico para o clipboard com feedback visual).
  - Ação **"Editar"** individual por item: abre a mensagem final em modo de edição de texto livre, permitindo retificar o comando gerado e sobrescrever a gravação no `localStorage` sem duplicar o registro.
- **Preservação Integral do Cronômetro**: A contagem e os três estados do cronômetro (`IDLE`, `RUNNING`, `PAUSED`) não são interrompidos ao alternar de aba.
- **Consistência Visual**: Aplicação estrita dos tokens de design e tipografia do **IDE.IA** (`frontend-design-ideia`).

## Capabilities

### New Capabilities
- `status-history`: Interface e controlador client-side para navegação em abas, visualização de histórico de status agrupado por data, navegação entre dias, cópia de comandos gravados e edição in-place com persistência no `localStorage`.

### Modified Capabilities
*(Nenhuma modificação nos requisitos comportamentais da capacidade `status-timer`)*

## Impact

- **Interface & Estrutura (`index.html`)**: Adição da barra de navegação no topo e do painel de histórico (`#history-view`), preservando a view de cronômetro (`#timer-view`).
- **Estilos (`styles.css`)**: Inclusão de estilos para abas de navegação, cabeçalhos de data, cards de histórico, badges, estados de edição e botões.
- **Lógica (`app.js`)**: Inclusão do roteamento client-side simples de abas, renderização reativa do histórico a partir do `localStorage`, controle de edição de registros existentes e filtro por dia.
- **Armazenamento**: Leitura e atualização de itens no array `status_timer_sessions` do `localStorage`.

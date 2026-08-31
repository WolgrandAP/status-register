## Why

O registro manual de status e tempo dedicado em squads de desenvolvimento costuma ser suscetível a imprecisões e atrito operacional, especialmente ao formatar comandos de atualização de status padronizados (comando `/status ...`) e estimar a minutagem gasta em tarefas.

Esta alteração introduz uma aplicação web estática ("Status Register / Timer") sem backend e sem etapa de build (HTML/CSS/JS puro) para mensurar o tempo de trabalho em tempo real através de um cronômetro com três estados (Iniciar, Pausar/Retomar e Parar), coletar metadados obrigatórios e opcionais de trabalho de acordo com os padrões das squads, gerar automaticamente o comando `/status` formatado (com omissão de campos opcionais vazios) e persistir os registros de sessão localmente no navegador (`localStorage`).

## What Changes

- Criação de uma interface web estática (compatível com GitHub Pages) baseada no design system e identidade visual do **IDE.IA** (`frontend-design-ideia`).
- Cronômetro em tempo real com três estados de operação:
  1. **Iniciar / Continuar**: Inicia ou retoma a contagem de tempo progressiva (`HH:MM:SS`).
  2. **Pausar**: Interrompe temporariamente a contagem sem abrir o formulário nem permitir gerar status antecipadamente, mantendo o tempo acumulado para posterior retomada.
  3. **Parar**: Finaliza a sessão atual de trabalho, zera o cronômetro para novas contagens e abre o modal/formulário de registro com o tempo decorrido convertido em minutos.
- Modal/formulário de fechamento com pré-preenchimento automático dos minutos decorridos (arredondados) e campos estruturados:
  - **Campos Obrigatórios**:
    - `squad`: seleção com os valores fixos: `TDF`, `LIBEROS`, `Gov/AE`, `Qualidade`, `IA`, `Dados`, `DFe`, `Sistemas Lab`, `Manutenção`, `Syndex`, `DPI2-IFPB`.
    - `issue`: texto livre.
    - `modulo`: texto livre.
    - `percentual`: seleção com os valores fixos: `Menor que 25`, `Menor que 50`, `Menor que 75`, `Menor que 100`, `Concluída`.
    - `categoria`: seleção com os valores fixos: `Desenvolvimento de Produto`, `Evolução de Produto`, `Estudo`, `Administrativa`, `Gestão`, `Reunião de planning/retrospective/review`, `Outro`.
    - `minutos_dedicados`: numérico editável pré-calculado com base na duração cronometrada da sessão finalizada.
    - `atividades`: textarea com descrição das tarefas executadas.
  - **Campos Opcionais** (incluídos na mensagem somente quando preenchidos):
    - `due_date`: campo de data.
    - `impedimento`: texto livre.
    - `data_daily`: campo de data.
- Geração automática e dinâmica do comando formatado:
  `/status squad: {squad} issue: {issue} modulo: {modulo} percentual: {percentual} categoria: {categoria} minutos_dedicados: {minutos_dedicados} atividades: {atividades}` (anexando `due_date: {due_date}`, `impedimento: {impedimento}`, `data_daily: {data_daily}` quando informados).
- Botão "Copiar" com cópia rápida para o clipboard e feedback visual imediato.
- Persistência estruturada do histórico de sessões no `localStorage`.

## Capabilities

### New Capabilities
- `status-timer`: Interface web e motor cliente para cronometragem com três estados (Iniciar, Pausar, Parar), coleta de dados de status, geração dinâmica do comando `/status`, cópia para clipboard e persistência local no `localStorage`.

### Modified Capabilities
*(Nenhuma capacidade existente modificada)*

## Impact

- **Arquivos & Estrutura**: Adição de `index.html`, `styles.css`, `app.js` e diretórios de apoio (`tokens/`, `fonts/`, `assets/` do IDE.IA).
- **Hospedagem & Deploy**: Execução direta client-side e deploy no GitHub Pages sem etapas de compilação ou dependências externas.
- **Persistência**: Gravação local no navegador através de `localStorage` sob a chave `status_timer_sessions`.

## Purpose

Fornecer uma interface e motor cliente de cronometragem de tarefas com controle de três estados (Iniciar, Pausar e Parar), geração dinâmica de mensagens padronizadas de status de trabalho para squads ágeis e persistência local de registros de produtividade no navegador.

## ADDED Requirements

### Requirement: Controle do cronômetro em três estados (Iniciar, Pausar e Retomar)
A aplicação SHALL disponibilizar um cronômetro na interface principal exibindo a contagem progressiva no formato `HH:MM:SS` com suporte aos estados de execução, pausa e retomada.

#### Scenario: Início da contagem a partir do estado inativo
- **WHEN** o usuário clica no botão "Iniciar" estando o cronômetro em 00:00:00
- **THEN** o cronômetro inicia a contagem de tempo progressiva em segundos, atualizando o display `HH:MM:SS` a cada segundo e exibindo as ações de "Pausar" e "Parar".

#### Scenario: Pausa da contagem sem abertura de formulário
- **WHEN** o usuário clica no botão "Pausar" durante uma contagem ativa
- **THEN** o cronômetro interrompe temporariamente a contagem de tempo, mantém o tempo acumulado no display, NÃO abre o formulário/modal de status e passa a exibir a ação de "Continuar" (retomar) juntamente com "Parar".

#### Scenario: Retomada da contagem após pausa
- **WHEN** o usuário clica no botão "Continuar" com o cronômetro pausado
- **THEN** a contagem de tempo é retomada a partir do tempo acumulado previamente sem perda de precisão.

---

### Requirement: Ação de Parar e abertura do formulário de fechamento
A aplicação SHALL finalizar a sessão de trabalho, zerar o cronômetro e abrir o formulário/modal de registro de status somente quando a ação "Parar" for acionada.

#### Scenario: Acionamento de Parar para encerramento
- **WHEN** o usuário clica em "Parar" (seja durante execução ativa ou enquanto pausado)
- **THEN** a contagem da sessão é finalizada, o cronômetro principal é zerado para `00:00:00` (pronto para nova sessão) e o modal/formulário de registro de status é imediatamente aberto com o campo `minutos_dedicados` pré-preenchido com os minutos calculados da sessão finalizada (arredondado para o minuto mais próximo, mínimo de 1 minuto se decorrido > 0).

---

### Requirement: Coleta e validação de campos obrigatórios e opcionais
O formulário SHALL coletar e validar campos obrigatórios com opções padronizadas e campos opcionais.

#### Scenario: Campos obrigatórios válidos
- **WHEN** o usuário preenche `squad` (selecionado dentre `TDF`, `LIBEROS`, `Gov/AE`, `Qualidade`, `IA`, `Dados`, `DFe`, `Sistemas Lab`, `Manutenção`, `Syndex`, `DPI2-IFPB`), `issue`, `modulo`, `percentual` (selecionado dentre `Menor que 25`, `Menor que 50`, `Menor que 75`, `Menor que 100`, `Concluída`), `categoria` (selecionado dentre `Desenvolvimento de Produto`, `Evolução de Produto`, `Estudo`, `Administrativa`, `Gestão`, `Reunião de planning/retrospective/review`, `Outro`), `minutos_dedicados` e `atividades`
- **THEN** o formulário é considerado válido e permite a geração do comando.

#### Scenario: Validação de pendências obrigatórias
- **WHEN** o usuário tenta gerar o status com qualquer campo obrigatório não preenchido ou vazio
- **THEN** a aplicação impede o envio e sinaliza visualmente os campos obrigatórios pendentes.

#### Scenario: Preenchimento de campos opcionais
- **WHEN** o usuário preenche um ou mais campos opcionais (`due_date`, `impedimento`, `data_daily`)
- **THEN** os valores informados são validados quanto ao tipo e incorporados ao estado da sessão.

---

### Requirement: Geração dinâmica do comando formatado de status
A aplicação SHALL gerar o texto exato do comando `/status` interpolando os campos obrigatórios e incluindo os campos opcionais somente quando preenchidos no formato `campo: valor`.

#### Scenario: Geração básica apenas com campos obrigatórios
- **WHEN** o usuário submete o formulário com dados obrigatórios válidos e campos opcionais em branco
- **THEN** a aplicação gera o comando no formato:
  `/status squad: {squad} issue: {issue} modulo: {modulo} percentual: {percentual} categoria: {categoria} minutos_dedicados: {minutos_dedicados} atividades: {atividades}`.

#### Scenario: Geração com campos opcionais preenchidos
- **WHEN** o usuário submete o formulário preenchendo também `due_date: "2026-09-05"`, `impedimento: "Aguardando liberação de token"` e `data_daily: "2026-08-30"`
- **THEN** a aplicação inclui as tags opcionais na mensagem gerada:
  `/status squad: {squad} issue: {issue} modulo: {modulo} percentual: {percentual} categoria: {categoria} minutos_dedicados: {minutos_dedicados} atividades: {atividades} due_date: 2026-09-05 impedimento: Aguardando liberação de token data_daily: 2026-08-30`.

#### Scenario: Omissão de campos opcionais vazios
- **WHEN** algum campo opcional (`due_date`, `impedimento` ou `data_daily`) estiver em branco
- **THEN** a chave e o valor correspondentes são completamente omitidos do comando `/status`.

---

### Requirement: Cópia do comando para a área de transferência
A aplicação SHALL fornecer uma ação de cópia com um clique para transferir o comando formatado para o clipboard do usuário e exibir confirmação visual.

#### Scenario: Cópia bem-sucedida do comando
- **WHEN** o usuário clica no botão "Copiar"
- **THEN** a aplicação copia o comando gerado para o clipboard do sistema e exibe um indicador visual de confirmação (ex.: alteração temporária do botão para "Copiado!").

---

### Requirement: Persistência local do histórico de sessões
A aplicação SHALL salvar cada sessão de status confirmada no `localStorage` do navegador contendo todos os metadados registrados (obrigatórios e opcionais preenchidos) e timestamp da operação.

#### Scenario: Armazenamento da sessão finalizada
- **WHEN** o usuário confirma o registro de status com sucesso
- **THEN** a aplicação adiciona um objeto de sessão na lista persistida sob a chave `status_timer_sessions` no `localStorage`, contendo id único, data/hora ISO, tempo em segundos, minutos dedicados, todos os campos preenchidos e o comando gerado.

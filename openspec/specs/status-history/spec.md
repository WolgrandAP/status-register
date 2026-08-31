## Purpose

Permitir a navegação entre a tela de cronometragem e a tela de histórico diário de status, visualização dos registros salvos no navegador por data, cópia rápida de mensagens passadas e edição de comandos gerados com persistência no armazenamento local.

## Requirements

### Requirement: Navegação superior por abas
A aplicação SHALL disponibilizar uma barra de navegação no topo contendo as abas "Cronômetro" e "Histórico", permitindo a alternância visual entre as duas telas sem recarregar a página.

#### Scenario: Alternância entre abas
- **WHEN** o usuário clica na aba "Histórico"
- **THEN** a tela de cronômetro é ocultada, a tela de histórico é exibida e a aba selecionada é destacada visualmente.

#### Scenario: Preservação do cronômetro durante a navegação
- **WHEN** o usuário alterna para a aba "Histórico" enquanto o cronômetro está em execução ou pausado
- **THEN** a contagem de tempo do cronômetro permanece inalterada e continua rodando em segundo plano sem perda de tempo ou reset.

---

### Requirement: Visualização do histórico de status agrupado por data
A aplicação SHALL carregar os registros salvos sob a chave `status_timer_sessions` no `localStorage` e exibi-los agrupados pelo dia correspondente.

#### Scenario: Exibição dos itens de status do dia
- **WHEN** existem registros no `localStorage` para a data selecionada
- **THEN** a tela exibe a listagem dos cards de status daquele dia, apresentando a mensagem final gerada, metadados (squad, minutagem, horário) e as ações de "Copiar" e "Editar".

#### Scenario: Estado vazio para data sem registros
- **WHEN** não há nenhum registro para o dia selecionado
- **THEN** a aplicação exibe uma mensagem informativa amigável indicando a ausência de status no dia selecionado com orientação para registrar um novo status.

---

### Requirement: Navegação e seleção entre datas no histórico
A aplicação SHALL permitir navegar para dias anteriores e futuros através de controles de navegação e seletor de data.

#### Scenario: Navegação de data por botões anterior e próximo
- **WHEN** o usuário clica em "Dia Anterior" ou "Próximo Dia"
- **THEN** a data ativa é atualizada e a listagem exibe automaticamente os registros correspondentes ao novo dia selecionado.

#### Scenario: Seleção direta via seletor de data
- **WHEN** o usuário escolhe uma data específica no input de data do histórico
- **THEN** a listagem é filtrada para exibir os registros daquela data.

---

### Requirement: Cópia individual de comando a partir do histórico
A aplicação SHALL disponibilizar um botão "Copiar" em cada registro do histórico para transferir a mensagem específica para a área de transferência.

#### Scenario: Cópia de item do histórico
- **WHEN** o usuário clica em "Copiar" em um item da lista de histórico
- **THEN** o texto do comando `/status` daquele item é copiado para o clipboard e o botão exibe feedback visual imediato de sucesso ("Copiado!").

---

### Requirement: Edição e atualização de status gravados no localStorage
A aplicação SHALL permitir que o usuário edite o texto livre da mensagem de status gerada e atualize o registro existente no `localStorage` sem criar duplicatas.

#### Scenario: Ativação do modo de edição
- **WHEN** o usuário clica em "Editar" em um item de histórico
- **THEN** o modal de status é aberto com todos os campos pré-preenchidos com os dados originais do registro e o título alterado para "Editar Status de Trabalho".

#### Scenario: Salvamento de edição com sucesso
- **WHEN** o usuário altera os dados e confirma no modal de edição
- **THEN** a aplicação atualiza o registro correspondente (identificado por seu `id`) no array `status_timer_sessions` do `localStorage` e renderiza o card atualizado sem alterar a quantidade total de registros.

#### Scenario: Cancelamento da edição
- **WHEN** o usuário fecha o modal de edição sem confirmar
- **THEN** o modo de edição é encerrado e o texto original do status é preservado sem nenhuma alteração no `localStorage`.

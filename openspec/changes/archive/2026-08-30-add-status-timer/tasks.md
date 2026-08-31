## 1. Setup e Design System (IDE.IA)

- [x] 1.1 Copiar tokens de design, arquivos de fontes (Urbanist/Olney) e ícones SVG da skill `frontend-design-ideia` para a estrutura do projeto (`tokens/`, `fonts/`, `assets/`) e verificar carregamento estático.
- [x] 1.2 Configurar `styles.css` aplicando os tokens do IDE.IA (cores `--green-400`, `--green-600`, `--green-700`, `--navy-900`, tipografia Urbanist/Olney, botões de três estados com cantos retos no light mode, sem sombras artificiais, cards, modal e inputs).

## 2. Estrutura da Interface (HTML)

- [x] 2.1 Criar `index.html` com display de cronômetro (`HH:MM:SS`), container de botões de controle para os 3 estados ("Iniciar", "Pausar", "Continuar", "Parar") e modal de status contendo:
  - Campos obrigatórios: `squad` (select com opções: TDF, LIBEROS, Gov/AE, Qualidade, IA, Dados, DFe, Sistemas Lab, Manutenção, Syndex, DPI2-IFPB), `issue` (text), `modulo` (text), `percentual` (select com opções: Menor que 25, Menor que 50, Menor que 75, Menor que 100, Concluída), `categoria` (select com opções: Desenvolvimento de Produto, Evolução de Produto, Estudo, Administrativa, Gestão, Reunião de planning/retrospective/review, Outro), `minutos_dedicados` (number) e `atividades` (textarea).
  - Campos opcionais: `due_date` (date), `impedimento` (text) e `data_daily` (date).
  - Área de exibição do comando gerado e botão "Copiar".

## 3. Lógica do Cronômetro de Três Estados (JavaScript)

- [x] 3.1 Implementar em `app.js` a máquina de estados do cronômetro (`IDLE`, `RUNNING`, `PAUSED`, `STOPPED`) com cálculo via `Date.now()`, exibindo formato `HH:MM:SS`.
- [x] 3.2 Implementar as transições de estado:
  - "Iniciar" inicia a contagem a partir de 00:00:00.
  - "Pausar" suspende o incremento de tempo sem abrir formulário e altera a interface para exibir "Continuar" e "Parar".
  - "Continuar" retoma a contagem a partir do tempo acumulado.
  - "Parar" encerra a sessão, zera o cronômetro para 00:00:00 e abre o modal pré-preenchendo `minutos_dedicados = Math.max(1, Math.round(segundos / 60))`.

## 4. Formulário de Status, Geração Dinâmica de Comando e Clipboard

- [x] 4.1 Implementar validação do formulário garantindo o preenchimento de todos os 7 campos obrigatórios e permitindo campos opcionais em branco.
- [x] 4.2 Implementar a geração dinâmica do comando `/status` interpolando campos obrigatórios e incluindo `due_date: {valor}`, `impedimento: {valor}`, `data_daily: {valor}` exclusivamente quando preenchidos (e omitindo-os quando vazios).
- [x] 4.3 Implementar a cópia para a área de transferência via `navigator.clipboard` com fallback e feedback visual de confirmação ("Copiado!").

## 5. Persistência Local e Validação Ponta a Ponta

- [x] 5.1 Implementar a gravação estruturada das sessões confirmadas no `localStorage` sob a chave `status_timer_sessions`.
- [x] 5.2 Validar o fluxo ponta a ponta no navegador (Iniciar -> Pausar [sem modal] -> Continuar -> Parar [zera timer e abre modal] -> preencher formulário -> gerar comando -> copiar -> verificar `localStorage`) e validar responsividade e ausência de erros no console.

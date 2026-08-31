## Context

A aplicação é uma solução estática client-side (HTML/CSS/JS) voltada para o registro e cronometragem ágil de atividades de engenharia em diferentes squads organizacionais. O design e interface devem adotar com rigor a identidade visual do **IDE.IA** (`frontend-design-ideia`), garantindo estética premium e refinada (paleta de dois verdes, tipografia Urbanist/Olney, sem sombras genéricas, sem emojis, modo light estruturado ou dark técnico).

O deploy será realizado no GitHub Pages sem nenhum processo de compilação ou dependência de pacotes Node.js em tempo de execução.

## Goals / Non-Goals

**Goals:**
- Prover um cronômetro com máquina de estados explícita de 3 fases:
  1. **Iniciar / Continuar**: Começa ou retoma a contagem de tempo progressiva.
  2. **Pausar**: Interrompe temporariamente a contagem, mantendo o tempo congelado no display sem disparar formulários ou status.
  3. **Parar**: Encerra a contagem, zera o cronômetro para `00:00:00` e dispara o modal/formulário com o tempo decorrido convertido em minutos.
- Estruturar a lista exata de opções fixas e campos:
  - **Obrigatórios**:
    - `squad`: `TDF`, `LIBEROS`, `Gov/AE`, `Qualidade`, `IA`, `Dados`, `DFe`, `Sistemas Lab`, `Manutenção`, `Syndex`, `DPI2-IFPB`.
    - `issue`: texto livre.
    - `modulo`: texto livre.
    - `percentual`: `Menor que 25`, `Menor que 50`, `Menor que 75`, `Menor que 100`, `Concluída`.
    - `categoria`: `Desenvolvimento de Produto`, `Evolução de Produto`, `Estudo`, `Administrativa`, `Gestão`, `Reunião de planning/retrospective/review`, `Outro`.
    - `minutos_dedicados`: numérico editável pré-calculado com base na duração do cronômetro da sessão finalizada.
    - `atividades`: texto livre descritivo.
  - **Opcionais** (incluídos na mensagem somente se preenchidos):
    - `due_date`: date picker.
    - `impedimento`: texto livre.
    - `data_daily`: date picker.
- Geração da mensagem de status com omissão limpa de chaves opcionais quando não preenchidas.
- Persistir cada sessão finalizada em `localStorage` sob a chave `status_timer_sessions`.
- Utilizar os tokens de design, tipografia e ícones SVG oficiais do IDE.IA em um layout autossuficiente e responsivo.

**Non-Goals:**
- Implementação de painel/dashboard de visualização do histórico na versão 1.0 (somente persistência em storage).
- Autenticação de usuários, contas ou sincronização em nuvem.
- Múltiplos cronômetros concorrentes na mesma sessão.

## Decisions

### 1. Arquitetura Estática Autossuficiente
- **Decisão**: Estruturar o projeto com `index.html`, `styles.css`, `app.js` e diretórios de suporte de design (`tokens/`, `fonts/`, `assets/` extraídos do skill `frontend-design-ideia`).
- **Justificativa**: Permite execução direta tanto localmente quanto via GitHub Pages com zero overhead de build.

### 2. Identidade Visual e Estilo (IDE.IA)
- **Decisão**: Seguir o padrão de tokens CSS do IDE.IA:
  - Cores: `--green-400` (#38d39f) para elementos de destaque e contrastes, `--green-600`/`--green-700` (#1f7d54/#1a6343) para botões primários e interações, `--navy-900` (#09131e) ou `--surface-page` (#ffffff).
  - Tipografia: Carregar as fontes oficiais **Urbanist** e **Olney** via `@font-face` com substitutos adequados.
  - Layout & Formas: Cantos retos no modo light, sem sombras difusas, ícones SVG monocromáticos em `currentColor`, rótulos em caixa alta espaçados (`letter-spacing`).
- **Justificativa**: Garante consistência visual institucional e sofisticação imediata conforme a diretriz da skill `frontend-design-ideia`.

### 3. Máquina de Estados do Cronômetro
- **Decisão**: O controlador de cronômetro operará sob os seguintes estados:
  - `IDLE`: Cronômetro zerado (`00:00:00`). Botão visível: "Iniciar".
  - `RUNNING`: Cronômetro incrementando a cada segundo via `Date.now()`. Botões visíveis: "Pausar" e "Parar".
  - `PAUSED`: Contagem pausada, display congelado no tempo acumulado. Formulário permanece fechado. Botões visíveis: "Continuar" e "Parar".
  - `STOPPED`: Ao clicar em "Parar", o tempo acumulado é capturado, o display principal é zerado para `00:00:00`, e o modal de status é aberto para preenchimento.
- **Justificativa**: Separa claramente pausas operacionais transitórias (ex.: café, interrupção rápida) da finalização de bloco de trabalho, atendendo diretamente ao fluxo de três estados.

### 4. Montagem Dinâmica do Comando `/status`
- **Decisão**: Construir a mensagem dinamicamente a partir de um array de pares chave/valor, filtrando valores vazios nos campos opcionais:
  ```javascript
  function buildStatusCommand(data) {
    const parts = [
      '/status',
      `squad: ${data.squad}`,
      `issue: ${data.issue}`,
      `modulo: ${data.modulo}`,
      `percentual: ${data.percentual}`,
      `categoria: ${data.categoria}`,
      `minutos_dedicados: ${data.minutos_dedicados}`,
      `atividades: ${data.atividades}`
    ];
    if (data.due_date) parts.push(`due_date: ${data.due_date}`);
    if (data.impedimento) parts.push(`impedimento: ${data.impedimento}`);
    if (data.data_daily) parts.push(`data_daily: ${data.data_daily}`);
    return parts.join(' ');
  }
  ```

### 5. Estrutura de Dados e Persistência Local
- **Decisão**: Armazenar os registros no `localStorage` sob o identificador `status_timer_sessions`:
  ```json
  [
    {
      "id": "ses_1725050000000",
      "createdAt": "2026-08-30T22:00:00.000Z",
      "squad": "IA",
      "issue": "AI-404",
      "modulo": "Pipeline RAG",
      "percentual": "Menor que 50",
      "categoria": "Desenvolvimento de Produto",
      "minutos_dedicados": 50,
      "atividades": "Ajuste na extração de embeddings",
      "due_date": "2026-09-02",
      "impedimento": "",
      "data_daily": "2026-08-30",
      "totalSeconds": 3000,
      "generatedCommand": "/status squad: IA issue: AI-404 modulo: Pipeline RAG percentual: Menor que 50 categoria: Desenvolvimento de Produto minutos_dedicados: 50 atividades: Ajuste na extração de embeddings due_date: 2026-09-02 data_daily: 2026-08-30"
    }
  ]
  ```

## Risks / Trade-offs

- **[Clique acidental no botão Parar]** → *Mitigação*: Permitir cancelamento no modal com recuperação do estado ou confirmação visual para evitar perda involuntária de tempo cronometrado.
- **[Throttling em abas inativas]** → *Mitigação*: Cálculo de tempo decorrido via diferença entre timestamps `Date.now()`.

# Status Register

Aplicativo web para registrar status de trabalho diário, com cronômetro integrado e geração automática de mensagens no formato do comando `/status` usado no Discord.

Projeto criado como exercício prático de **Spec-Driven Development (SDD)** usando a ferramenta **OpenSpec**.

---

## O que o app faz

- Inicia, pausa e para um cronômetro enquanto você trabalha em uma tarefa
- Ao parar o cronômetro, abre um formulário para registrar os detalhes do trabalho (squad, issue, módulo, percentual, categoria, atividades, entre outros)
- Gera automaticamente uma mensagem formatada, pronta para colar no chat do Discord
- Copia a mensagem para a área de transferência com um clique
- Mantém um histórico de todos os status registrados, organizado por dia, com opção de copiar ou editar qualquer registro anterior
- Roda 100% no navegador — sem backend, sem cadastro, com os dados salvos localmente via `localStorage`

---

## Por que este projeto existe

Este é um projeto de treino com dois objetivos:

1. **Resolver um problema real do dia a dia**: preencher manualmente o comando `/status` do Discord toda vez que termino um bloco de trabalho é repetitivo e propenso a erro. Um cronômetro que já calcula o tempo e gera a mensagem elimina esse atrito.
2. **Praticar Spec-Driven Development (SDD)**: em vez de simplesmente pedir para uma IA "criar um app de cronômetro", o desenvolvimento seguiu um processo estruturado de definição de requisitos antes da escrita de qualquer código.

---

## O que é Spec-Driven Development (SDD)

SDD é uma forma de desenvolver software em que a **especificação vem antes do código**. Em vez de descrever o que se quer em uma conversa solta com um assistente de IA (que é não-determinístico e pode interpretar de formas diferentes a cada vez), o fluxo é:

```
Especificação (o quê e por quê)
        ↓
Design técnico (como)
        ↓
Lista de tarefas (checklist de implementação)
        ↓
Código
```

As vantagens desse processo, especialmente ao trabalhar com assistentes de IA:

- **Alinhamento antes da implementação**: humano e IA concordam sobre o que será construído antes que uma linha de código seja escrita, evitando retrabalho
- **Rastreabilidade**: cada funcionalidade tem um documento explicando por que foi criada e como funciona, útil para revisitar o projeto meses depois
- **Mudanças controladas**: alterações em funcionalidades existentes são documentadas como "diffs" da especificação (specs delta), preservando o histórico de decisões
- **Menos ambiguidade**: reduz a chance de a IA "alucinar" requisitos ou tomar decisões técnicas não combinadas

---

## O que é o OpenSpec

[OpenSpec](https://github.com/Fission-AI/OpenSpec) é a ferramenta de código aberto usada neste projeto para aplicar o SDD na prática. Ela adiciona uma camada leve de especificação ao repositório, com foco em funcionar bem junto a assistentes de IA agenticos (como o Google Antigravity, usado aqui).

### Como funciona

Cada nova funcionalidade ou correção vira uma **mudança** (change), organizada em sua própria pasta dentro de `openspec/changes/`:

```
openspec/changes/<nome-da-mudanca>/
├── proposal.md   → o quê e por quê dessa mudança
├── specs/        → requisitos detalhados (specs delta)
├── design.md     → abordagem técnica escolhida
└── tasks.md      → checklist de implementação
```

O fluxo de trabalho usa comandos dentro do chat do assistente de IA:

| Comando | O que faz |
|---|---|
| `/opsx-propose <nome>` | Cria a proposta de mudança (proposal, specs, design, tasks) a partir de uma descrição em linguagem natural |
| `/opsx-apply` | Implementa o código seguindo o `tasks.md` da proposta |
| `/opsx-archive` | Mescla as specs delta da mudança no spec principal do projeto (`openspec/specs/`) e arquiva a mudança |

### Specs delta

Em vez de reescrever a especificação inteira do projeto a cada mudança, o OpenSpec trabalha com **deltas**: cada proposta descreve apenas o que está sendo adicionado, modificado ou removido (seções `ADDED Requirements`, `MODIFIED Requirements`, `REMOVED Requirements`). Isso mantém o processo leve mesmo conforme o projeto cresce, e é especialmente útil para projetos que já têm código existente (brownfield), como este ficou depois da primeira funcionalidade implementada.

---

## Stack técnica

- **HTML, CSS e JavaScript puro** — sem frameworks, sem build step
- **localStorage** — persistência de dados no navegador, sem backend
- **GitHub Pages** — hospedagem estática gratuita

A escolha por uma stack minimalista foi intencional: o objetivo do projeto era praticar o processo de SDD, então quanto menos complexidade técnica acessória (bundlers, frameworks, configuração), mais claro fica o ciclo spec → design → tasks → código.

---

## Ferramentas usadas no desenvolvimento

- **[Google Antigravity](https://antigravity.google/)** — IDE agent-first usado para interagir com a IA durante todo o processo de especificação e implementação
- **Gemini 3** — modelo de IA que atua como agente dentro do Antigravity
- **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — framework de SDD que estrutura o fluxo de propostas, specs, design e tasks

---

## Estrutura do projeto

```
status-register/
├── openspec/
│   ├── config.yaml
│   ├── specs/              # spec principal consolidada (após archives)
│   └── changes/            # mudanças em andamento ou arquivadas
├── .agents/
│   └── skills/             # skills usadas pelo agente de IA (ex: estética visual)
├── index.html
├── style.css
├── app.js
└── README.md
```

---

## Como rodar localmente

Por ser um projeto sem build step, basta abrir o `index.html` diretamente no navegador:

```bash
git clone https://github.com/SEU_USUARIO/status-register.git
cd status-register
```

Depois, abra o arquivo `index.html` no navegador, ou sirva localmente:

```bash
npx serve .
```

---

## Como contribuir com novas funcionalidades (seguindo o mesmo processo)

1. Instale o OpenSpec (se ainda não tiver):
   ```bash
   npm install -g @fission-ai/openspec@latest
   ```
2. No chat do assistente de IA configurado no projeto, descreva a nova funcionalidade:
   ```
   /opsx-propose nome-da-mudanca
   [descrição do que você quer]
   ```
3. Revise os arquivos gerados em `openspec/changes/nome-da-mudanca/` antes de prosseguir
4. Implemente com `/opsx-apply`
5. Teste localmente
6. Faça commit e push
7. Finalize com `/opsx-archive`

---

## Histórico de mudanças (specs)

| Mudança | Descrição | Status |
|---|---|---|
| `add-status-timer` | Cronômetro com iniciar/pausar/parar e geração de mensagem de status | Arquivada |
| `add-daily-status-history` | Navbar com aba de histórico, agrupamento por dia, copiar e editar registros | Em andamento |

---

## Licença

Projeto pessoal de estudo, sem licença formal definida.
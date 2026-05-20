# Preparacao para chat proprio - MVP Jus 9

Status: orientacao de continuidade para abrir chat especifico de MVP.
Projeto: Ecossistema Jus 9 Tecnologia Juridica.
Repositorio principal: `%USERPROFILE%\Documents\GitHub\mvp-jus9-tecnologia-juridica`.

## Regra de escopo

Este chat proprio deve tratar somente dos MVPs da Jus 9 Tecnologia Juridica.

Assuntos que devem ser encaminhados para outros chats prioritarios:

- Investimentos, investidores, busca de parcerias, orcamento de viagem, dashboards financeiros e apresentacao para apoiadores: usar o chat proprio de investimentos.
- Login, autenticacao, Google OAuth, identidade, acesso, sessoes, perfis, permissoes e seguranca de acesso: usar o chat proprio de login.
- `creta.org.br`, CRETA, `aeonprimevo.com.br`, Aeon Primevo, SCTec, Introducao CSS e dominios/projetos externos: alertar o Fundador e tratar em chat/projeto proprio.

## Primeira leitura recomendada

Antes de alterar arquivos, a IA deve:

1. Rodar `git status --short --branch`.
2. Ler este arquivo.
3. Ler `PROJETO_MVPS_FALTANTES_JUS9.md`.
4. Ler `MVPs_FALTANTES/PROJETO_MVPS_FALTANTES.md`.
5. Ler `README.md`, se a tarefa tocar navegacao ou apresentacao publica.
6. Ler `LEMBRANDO_BACKEND_PROXIMOS_PASSOS.md`, se a tarefa tocar backend.
7. Conferir `ORIENTACOES/ESCOPO_PROJETO_ECOSSISTEMA_JUS9.md`.

## Pendencias vistas antes da abertura do chat

Snapshot operacional em 2026-05-20:

- Branch: `main...origin/main [ahead 3]`.
- Pendencias locais existentes:
  - `M MVPs_FALTANTES/PROJETO_MVPS_FALTANTES.md`
  - `M PROJETO_MVPS_FALTANTES_JUS9.md`
  - arquivo ainda nao rastreado: `ORIENTACOES/ESCOPO_PROJETO_ECOSSISTEMA_JUS9.md`

Nao reverter estas pendencias sem autorizacao do Fundador.

## Prioridade tecnica do chat MVP

Ordem sugerida:

1. Inventariar paginas e fluxos ja existentes do MVP.
2. Escolher um MVP principal para estabilizar primeiro: Agenda Jus 9.
3. Revisar navegacao entre `index.html`, `acessar-mvp.html`, `agenda.html`, `app-agenda.html`, `app-painel.html`, `app-perfis.html` e `login.html`, sem transformar login demo em login real.
4. Corrigir visual, responsividade e textos quebrados por codificacao somente no escopo do MVP.
5. Separar claramente o que e demonstrativo do que exige backend real.
6. Criar checklist de validacao antes de deploy: links, mobile, desktop, texto, cache, manifest, service worker e rotas.

## Regra de seguranca

Nao publicar segredos, tokens, senhas, QR codes, documentos pessoais, WhatsApp bruto, conteudo de cofre ou dados reais de usuarios.

Login demonstrativo nao e login real. Qualquer autenticacao real deve ser encaminhada ao chat/repo de login:

`%USERPROFILE%\Documents\GitHub\auth-identidade-acesso-jus9-tecnologia-juridica`

## Prompt curto para abrir o chat proprio

Charlie Fox, este e o chat proprio do MVP do Ecossistema Jus 9 Tecnologia Juridica.

Use como raiz:
`%USERPROFILE%\Documents\GitHub\mvp-jus9-tecnologia-juridica`

Antes de alterar arquivos, rode `git status --short --branch`, leia `ORIENTACOES/PREPARACAO_CHAT_PROPRIO_MVP_JUS9.md` e respeite as excecoes: investimentos/investidores e login/acesso tem chats proprios prioritarios; CRETA, Aeon Primevo e dominios externos ficam fora deste chat.

Prioridade inicial: estabilizar o MVP Agenda Jus 9 com fluxo navegavel, visual responsivo, links corretos, linguagem segura e separacao clara entre demonstracao e backend real.

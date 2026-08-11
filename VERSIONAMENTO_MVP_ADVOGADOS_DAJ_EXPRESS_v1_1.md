# Versionamento - MVP Advogados / DAJ Express v1.1

CLASSIFICAÇÃO: PÚBLICO / MVP / ADVOGADOS  
AUTORIZAÇÃO: equipe / revisão humana  
PUBLICAÇÃO: publicar somente versão demonstrativa, sem dados reais  
REVISÃO: humana obrigatória para qualquer uso jurídico real

Data: 2026-08-11  
Repositório: `mvp-jus9-tecnologia-juridica`

## Objetivo

Dar mais segurança e utilidade à triagem do DAJ Express sem transformar o MVP estático em ambiente de produção.

## Alterações

- adicionada prioridade operacional Normal, Alta ou Urgente;
- adicionada data limite opcional;
- prioridade urgente exige risco/prazo informado ou data limite antes da geração;
- rascunhos `JURIDICO_SIGILOSO` e `COFRE_NAO_AUTOMATICO` não são persistidos no `localStorage`;
- rascunhos `PUBLICO` e `INTERNO` continuam locais, com aviso explícito de que não devem conter dados reais;
- cópia do DAJ ganhou fallback e mensagem de erro orientando o download;
- salvamento automático do cofre continua bloqueado;
- cache do PWA foi promovido para `jus9-mvp-pwa-v5`, evitando servir o JavaScript anterior;
- o DAJ baixado passa a registrar prioridade e data limite.

## Verificação

- `node --check assets/js/daj-express.js`
- `git diff --check`
- teste local em `http://127.0.0.1:8098/daj-express.html`;
- teste de geração com prioridade e data limite;
- teste de cópia sem erros de console;
- teste de bloqueio de salvamento para `COFRE_NAO_AUTOMATICO`.

## Limites preservados

O MVP continua demonstrativo. Não há autenticação real, cofre produtivo, parecer jurídico automático, publicação automática ou autorização para uso de dados reais.

© Jus 9 Tecnologia Jurídica — software livre, autoria preservada.

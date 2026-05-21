# Versionamento - Agenda MVP integrada ao backend local v1.1

Data: 2026-05-21

## Escopo

Ligar a Agenda visual do MVP ao primeiro contrato local do backend geral da Jus 9, sem ativar Google OAuth real e sem usar dados reais.

## Alteracoes

- `agenda.html` agora tenta validar eventos demonstrativos em `POST http://127.0.0.1:3000/api/agenda/events`.
- O evento continua salvo primeiro no navegador por `localStorage`.
- Os fallbacks atuais foram preservados:
  - salvar local;
  - abrir Google Calendar;
  - baixar ICS.
- A tela exibe feedback claro:
  - `Evento validado no backend local`;
  - `Backend local indisponivel; usando fallback do navegador`.
- `app-agenda.html` registra que Google Calendar esta em modo contrato, sem envio real.

## Contrato enviado

O payload enviado usa somente dados demonstrativos:

```json
{
  "timezone": "America/Sao_Paulo",
  "classification": "INTERNO / DEMO",
  "source": "mvp-agenda",
  "actor": "Fundador",
  "relatedId": "DAJ-DEMO-001",
  "description": "Sem dados reais nesta fase."
}
```

## Garantias

- Login demo nao foi transformado em login real.
- Nenhum token, senha ou segredo foi adicionado ao frontend.
- Nenhum dado real de cliente, processo, WhatsApp, cofre ou documento pessoal e necessario.
- Se o backend local estiver desligado, a Agenda segue funcionando offline.

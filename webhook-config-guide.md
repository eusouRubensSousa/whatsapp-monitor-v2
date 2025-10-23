# Configuração do Webhook na Evolution API

## 🎯 Problema Identificado

O webhook está configurado para:
`https://webhook.automacao.automacaolille.com.br/webhook/c48bbfb6-b5d5-44fd-be18-5307fb7b082d`

Mas deveria apontar para o seu sistema local ou servidor de produção.

## 🔧 Soluções

### Opção 1: Usar ngrok para expor o localhost
1. Instale o ngrok: https://ngrok.com/
2. Execute: `ngrok http 3000`
3. Use a URL do ngrok no webhook da Evolution API

### Opção 2: Configurar webhook para seu servidor de produção
Se você tem um servidor online, configure o webhook para:
`https://seu-dominio.com/api/webhook/evolution`

### Opção 3: Usar o webhook atual (se for seu)
Se `https://webhook.automacao.automacaolille.com.br` é seu servidor, então o problema pode ser:
1. O servidor não está recebendo as mensagens
2. O evento MESSAGES_UPSERT não está ativo
3. O token não está correto

## 📋 Checklist

- [ ] URL do webhook está correta
- [ ] Token está correto: `F218A80A2E55-45D4-ACDB-BA9E3E915601`
- [ ] Evento MESSAGES_UPSERT está ativo
- [ ] Instância está correta: `lille consulting`
- [ ] Grupo existe no sistema
- [ ] RLS está configurado corretamente

## 🎯 Próximo Passo

Configure o webhook para apontar para o sistema correto!

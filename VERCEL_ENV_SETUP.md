# Configuração de Variáveis de Ambiente no Vercel

Para corrigir o erro de deployment, você precisa configurar as seguintes variáveis de ambiente no painel do Vercel:

## Variáveis Obrigatórias

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Valor: `https://wbsikzebfehhrlsdqdjo.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE1NjA2MSwiZXhwIjoyMDc2NzMyMDYxfQ.example-service-role-key`

## Variáveis Opcionais

4. **EVOLUTION_API_URL**
   - Valor: `https://your-evolution-api-url.com`

5. **EVOLUTION_API_TOKEN**
   - Valor: `F218A80A2E55-45D4-ACDB-BA9E3E915601`

6. **NEXTAUTH_URL**
   - Valor: `https://whatsapp-monitor-oi9k.vercel.app`

7. **NEXTAUTH_SECRET**
   - Valor: `your_nextauth_secret_here` (substitua por uma chave secreta real)

## Como Configurar

1. Acesse o painel do Vercel
2. Vá para o projeto `whatsapp-monitor-oi9k`
3. Clique em "Settings"
4. Vá para "Environment Variables"
5. Adicione cada variável com seu respectivo valor
6. Faça um novo deployment

## Correções Implementadas

- ✅ Middleware corrigido com tratamento de erros
- ✅ Dependências atualizadas para versões compatíveis (Next.js 15 + React 18)
- ✅ Configuração do Supabase melhorada
- ✅ Next.js config otimizado para produção

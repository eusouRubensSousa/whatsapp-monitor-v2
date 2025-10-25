# 🚀 Variáveis de Ambiente para Vercel

Copie e cole estas variáveis no painel da Vercel (Settings → Environment Variables)

---

## ✅ VARIÁVEIS OBRIGATÓRIAS (Já disponíveis)

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://wbsikzebfehhrlsdqdjo.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4
```

---

## ⚠️ VARIÁVEL OBRIGATÓRIA (Você precisa obter)

### 3. SUPABASE_SERVICE_ROLE_KEY
**IMPORTANTE**: Esta chave é SECRETA e só pode ser obtida no painel do Supabase.

**Como obter:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `wbsikzebfehhrlsdqdjo`
3. Vá em **Settings** → **API**
4. Procure por **"service_role" key** (não é a "anon" key!)
5. Clique em "Reveal" e copie a chave
6. Cole na Vercel

**Formato esperado:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE1NjA2MSwiZXhwIjoyMDc2NzMyMDYxfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔧 VARIÁVEIS OPCIONAIS (Evolution API)

### 4. EVOLUTION_API_URL
```
https://webhook.automacao.automacaolille.com.br
```

### 5. EVOLUTION_API_TOKEN
```
F218A80A2E55-45D4-ACDB-BA9E3E915601
```

---

## 📋 COMO CONFIGURAR NA VERCEL

### Passo a Passo:

1. **Acesse seu projeto na Vercel**
   - Vá para: https://vercel.com/dashboard
   - Selecione o projeto `whatsapp-monitor-v2`

2. **Entre nas configurações**
   - Clique em **"Settings"** no topo
   - No menu lateral, clique em **"Environment Variables"**

3. **Adicione cada variável**
   - Clique em **"Add New"**
   - Cole o **nome** da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - Cole o **valor** da variável
   - Selecione os ambientes: **Production**, **Preview**, **Development** (todos)
   - Clique em **"Save"**

4. **Repita para todas as 5 variáveis**
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY ← (obtenha no Supabase)
   - EVOLUTION_API_URL
   - EVOLUTION_API_TOKEN

5. **Faça novo deploy**
   - Vá em **"Deployments"**
   - Clique nos **"..."** no último deploy
   - Clique em **"Redeploy"**

---

## ✅ CHECKLIST RÁPIDO

- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY obtida do Supabase e configurada
- [ ] EVOLUTION_API_URL configurada
- [ ] EVOLUTION_API_TOKEN configurada
- [ ] Redeploy feito na Vercel
- [ ] Build passou sem erros

---

## 🔗 LINKS ÚTEIS

- **Painel Supabase**: https://supabase.com/dashboard/project/wbsikzebfehhrlsdqdjo
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Supabase API Keys**: https://supabase.com/docs/guides/api#api-url-and-keys

---

## 🆘 PROBLEMAS COMUNS

### ❌ Build falha com erro de Supabase
**Solução**: Verifique se as 3 variáveis do Supabase estão corretas

### ❌ Webhook não funciona
**Solução**: Verifique se EVOLUTION_API_TOKEN está correta

### ❌ Service Role Key inválida
**Solução**: A chave deve começar com `eyJ` e ser DIFERENTE da ANON_KEY

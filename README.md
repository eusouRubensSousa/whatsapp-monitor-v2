# WhatsApp Monitor System

Sistema completo de monitoramento de grupos do WhatsApp usando Evolution API, Supabase e Next.js.

## 🚀 Funcionalidades

- **Dashboard em tempo real** com métricas de interação
- **Monitoramento de grupos** (próprios e de clientes)
- **Gestão de funcionários** com métricas de performance
- **Mensagens em tempo real** com filtros avançados
- **Analytics detalhados** com gráficos e relatórios
- **Webhook da Evolution API** para recebimento automático de mensagens

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth + Realtime)
- **API Externa**: Evolution API (WhatsApp)
- **Visualização**: Recharts
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Instância da Evolution API configurada
- Token da Evolution API

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd whatsapp-monitor
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (copie do arquivo `env.local.example`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wbsikzebfehhrlsdqdjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# Evolution API Configuration
EVOLUTION_API_URL=https://webhook.automacao.automacaolille.com.br
EVOLUTION_API_TOKEN=F218A80A2E55-45D4-ACDB-BA9E3E915601

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aqui
```

**Nota**: As credenciais do Supabase e Evolution API já estão configuradas com os valores reais. Você só precisa criar o arquivo `.env.local` com essas configurações.

### 4. Configure o Supabase

Execute os seguintes comandos SQL no Supabase SQL Editor:

```sql
-- Criar tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de grupos do WhatsApp
CREATE TABLE whatsapp_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id TEXT UNIQUE NOT NULL,
  group_name TEXT NOT NULL,
  type TEXT DEFAULT 'client_groups' CHECK (type IN ('my_groups', 'client_groups')),
  owner_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0
);

-- Criar tabela de mensagens
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document')),
  is_from_employee BOOLEAN DEFAULT FALSE,
  employee_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de funcionários
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de interações
CREATE TABLE interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  client_id TEXT,
  response_time INTEGER NOT NULL, -- em minutos
  message_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (permitir acesso a usuários autenticados)
CREATE POLICY "Users can view all data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can view all groups" ON whatsapp_groups FOR SELECT USING (true);
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can view all employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Users can view all interactions" ON interactions FOR SELECT USING (true);

-- Habilitar Realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 5. Configure a Evolution API

1. Acesse sua instância da Evolution API
2. Configure o webhook para apontar para: `https://seu-dominio.vercel.app/api/webhook/evolution`
3. Use o token fornecido: `F218A80A2E55-45D4-ACDB-BA9E3E915601`

### 6. Execute o projeto

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🚀 Deploy na Vercel

### 1. Conecte o repositório

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente na Vercel

### 2. Configure as variáveis de ambiente na Vercel

Adicione todas as variáveis do arquivo `.env.local` nas configurações do projeto na Vercel.

### 3. Deploy automático

O deploy será feito automaticamente a cada push para a branch principal.

## 📱 Como usar

### 1. Primeiro acesso

1. Acesse a aplicação
2. Faça login com suas credenciais do Supabase
3. Configure os grupos do WhatsApp
4. Adicione funcionários da equipe

### 2. Configuração de grupos

1. Acesse a página "Grupos"
2. Adicione grupos manualmente ou importe da Evolution API
3. Classifique como "Meus grupos" ou "Grupos de clientes"

### 3. Monitoramento

1. **Dashboard**: Visualize métricas gerais
2. **Mensagens**: Acompanhe mensagens em tempo real
3. **Funcionários**: Gerencie a equipe e performance
4. **Relatórios**: Analise dados históricos

## 🔧 Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── groups/page.tsx
│   │   ├── employees/page.tsx
│   │   └── messages/page.tsx
│   ├── api/
│   │   ├── webhook/evolution/route.ts
│   │   ├── groups/route.ts
│   │   ├── messages/route.ts
│   │   └── analytics/route.ts
│   └── layout.tsx
├── components/
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase.ts
│   ├── evolution-api.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## 🐛 Solução de Problemas

### Webhook não está funcionando

1. Verifique se a URL do webhook está correta
2. Confirme se o token da Evolution API está válido
3. Verifique os logs da Vercel para erros

### Dados não aparecem

1. Verifique se as tabelas do Supabase foram criadas
2. Confirme se as políticas RLS estão configuradas
3. Teste a conexão com o Supabase

### Erro de autenticação

1. Verifique as chaves do Supabase
2. Confirme se o usuário foi criado no Supabase Auth
3. Teste o login manualmente

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o suporte.

## 📄 Licença

Este projeto está sob a licença MIT.
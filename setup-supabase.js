const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wbsikzebfehhrlsdqdjo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4'

const supabase = createClient(supabaseUrl, supabaseKey)

// SQL para criar as tabelas
const createTablesSQL = `
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de grupos do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_groups (
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
CREATE TABLE IF NOT EXISTS messages (
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
CREATE TABLE IF NOT EXISTS employees (
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
CREATE TABLE IF NOT EXISTS interactions (
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
CREATE POLICY IF NOT EXISTS "Users can view all data" ON users FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can view all groups" ON whatsapp_groups FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can view all employees" ON employees FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can view all interactions" ON interactions FOR SELECT USING (true);

-- Habilitar Realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
`

async function setupSupabase() {
  try {
    console.log('🚀 Configurando tabelas do Supabase...')
    
    // Como não podemos executar SQL diretamente com a chave anônima,
    // vamos tentar inserir dados simples para verificar se as tabelas existem
    console.log('📊 Verificando se as tabelas existem...')
    
    // Tentar inserir um usuário de teste
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User'
      })
      .select()

    if (userError) {
      console.log('❌ Tabelas não existem. Você precisa executar o SQL no Supabase Dashboard.')
      console.log('')
      console.log('📋 Instruções:')
      console.log('1. Acesse: https://supabase.com/dashboard')
      console.log('2. Vá para o projeto: wbsikzebfehhrlsdqdjo')
      console.log('3. Clique em "SQL Editor"')
      console.log('4. Cole o SQL abaixo e execute:')
      console.log('')
      console.log('=' * 50)
      console.log(createTablesSQL)
      console.log('=' * 50)
      console.log('')
      console.log('5. Depois execute: node insert-test-data.js')
      return
    } else {
      console.log('✅ Tabelas já existem!')
      // Remover o usuário de teste
      await supabase.from('users').delete().eq('email', 'test@example.com')
    }

  } catch (error) {
    console.log('❌ Erro:', error.message)
  }
}

setupSupabase()

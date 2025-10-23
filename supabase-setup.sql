-- WhatsApp Monitor System - Supabase Setup
-- Execute este script no SQL Editor do Supabase

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

-- Políticas de RLS para usuários autenticados
CREATE POLICY IF NOT EXISTS "Users can view all data" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can view all groups" ON whatsapp_groups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can view all messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can view all employees" ON employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can view all interactions" ON interactions FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para inserção (apenas para service role)
CREATE POLICY IF NOT EXISTS "Service role can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Service role can insert groups" ON whatsapp_groups FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Service role can insert employees" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Service role can insert interactions" ON interactions FOR INSERT WITH CHECK (true);

-- Políticas para atualização
CREATE POLICY IF NOT EXISTS "Users can update groups" ON whatsapp_groups FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can update employees" ON employees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Service role can update groups" ON whatsapp_groups FOR UPDATE WITH CHECK (true);

-- Habilitar Realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_is_from_employee ON messages(is_from_employee);
CREATE INDEX IF NOT EXISTS idx_whatsapp_groups_type ON whatsapp_groups(type);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- Inserir dados de exemplo (opcional)
INSERT INTO users (email, role, name) VALUES 
('admin@empresa.com', 'admin', 'Administrador'),
('funcionario1@empresa.com', 'employee', 'João Silva'),
('funcionario2@empresa.com', 'employee', 'Maria Santos')
ON CONFLICT (email) DO NOTHING;

INSERT INTO employees (user_id, name, department, status, phone, email) VALUES 
('user1', 'João Silva', 'Vendas', 'active', '+55 11 99999-9999', 'joao@empresa.com'),
('user2', 'Maria Santos', 'Suporte', 'active', '+55 11 88888-8888', 'maria@empresa.com'),
('user3', 'Pedro Costa', 'Marketing', 'active', '+55 11 77777-7777', 'pedro@empresa.com')
ON CONFLICT (user_id) DO NOTHING;

-- Comentários das tabelas
COMMENT ON TABLE users IS 'Usuários do sistema com diferentes níveis de acesso';
COMMENT ON TABLE whatsapp_groups IS 'Grupos do WhatsApp monitorados pelo sistema';
COMMENT ON TABLE messages IS 'Mensagens recebidas dos grupos do WhatsApp';
COMMENT ON TABLE employees IS 'Funcionários da empresa que atendem os clientes';
COMMENT ON TABLE interactions IS 'Interações entre funcionários e clientes com métricas';


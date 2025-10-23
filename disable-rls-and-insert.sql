-- Desabilitar RLS temporariamente para inserir dados
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE interactions DISABLE ROW LEVEL SECURITY;

-- Inserir dados de teste
INSERT INTO whatsapp_groups (group_id, group_name, type, owner_id, last_message, last_message_time, unread_count) VALUES
('120363123456789012@g.us', 'Grupo Vendas - Lille Consulting', 'my_groups', 'system', 'Preciso de ajuda com automação', NOW(), 3),
('120363123456789013@g.us', 'Suporte Técnico - Clientes', 'client_groups', 'system', 'Sistema funcionando perfeitamente!', NOW() - INTERVAL '1 hour', 0),
('120363123456789014@g.us', 'Clientes VIP - Lille', 'client_groups', 'system', 'Obrigado pelo atendimento excelente!', NOW() - INTERVAL '2 hours', 1),
('120363123456789015@g.us', 'Marketing Digital - Equipe', 'my_groups', 'system', 'Nova campanha de automação lançada', NOW() - INTERVAL '3 hours', 0);

INSERT INTO employees (user_id, name, department, status, phone, email) VALUES
('user1', 'João Silva', 'Vendas', 'active', '+55 11 99999-9999', 'joao@lilleconsulting.com'),
('user2', 'Maria Santos', 'Suporte', 'active', '+55 11 88888-8888', 'maria@lilleconsulting.com'),
('user3', 'Pedro Costa', 'Marketing', 'active', '+55 11 77777-7777', 'pedro@lilleconsulting.com'),
('user4', 'Ana Oliveira', 'Financeiro', 'inactive', '+55 11 66666-6666', 'ana@lilleconsulting.com');

INSERT INTO messages (group_id, sender, content, timestamp, message_type, is_from_employee, employee_id) VALUES
('120363123456789012@g.us', 'Cliente João', 'Preciso de ajuda com automação WhatsApp', NOW(), 'text', false, NULL),
('120363123456789012@g.us', 'João Silva', 'Olá! Como posso ajudá-lo?', NOW() - INTERVAL '5 minutes', 'text', true, 'user1'),
('120363123456789012@g.us', 'Cliente João', 'Quero automatizar o atendimento de clientes', NOW() - INTERVAL '10 minutes', 'text', false, NULL),
('120363123456789013@g.us', 'Cliente Maria', 'O sistema de automação está funcionando perfeitamente!', NOW() - INTERVAL '1 hour', 'text', false, NULL),
('120363123456789014@g.us', 'Cliente VIP', 'Obrigado pelo atendimento excelente da Lille Consulting!', NOW() - INTERVAL '2 hours', 'text', false, NULL),
('120363123456789015@g.us', 'Pedro Costa', 'Nova campanha de automação WhatsApp lançada para todos os clientes', NOW() - INTERVAL '3 hours', 'text', true, 'user3');

INSERT INTO interactions (group_id, employee_id, client_id, response_time, message_count) VALUES
('120363123456789012@g.us', 'user1', 'cliente1', 5, 3),
('120363123456789013@g.us', 'user2', 'cliente2', 15, 1),
('120363123456789014@g.us', 'user1', 'cliente3', 2, 1);

-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Criar políticas de RLS
DROP POLICY IF EXISTS "Users can view all data" ON users;
DROP POLICY IF EXISTS "Users can view all groups" ON whatsapp_groups;
DROP POLICY IF EXISTS "Users can view all messages" ON messages;
DROP POLICY IF EXISTS "Users can view all employees" ON employees;
DROP POLICY IF EXISTS "Users can view all interactions" ON interactions;

CREATE POLICY "Users can view all data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can view all groups" ON whatsapp_groups FOR SELECT USING (true);
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can view all employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Users can view all interactions" ON interactions FOR SELECT USING (true);

-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
DROP POLICY IF EXISTS "Users can view all messages" ON messages;
DROP POLICY IF EXISTS "Allow all operations on groups" ON whatsapp_groups;
DROP POLICY IF EXISTS "Users can view all groups" ON whatsapp_groups;

-- Desabilitar RLS temporariamente
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups DISABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas
CREATE POLICY "Allow all operations on messages" ON messages 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on groups" ON whatsapp_groups 
FOR ALL USING (true) WITH CHECK (true);

-- Reabilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;

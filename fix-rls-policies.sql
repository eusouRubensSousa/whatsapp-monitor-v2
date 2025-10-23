-- Desabilitar RLS temporariamente para permitir inserção via webhook
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Users can view all messages" ON messages;

-- Recriar política mais permissiva
CREATE POLICY "Allow all operations on messages" ON messages 
FOR ALL USING (true) WITH CHECK (true);

-- Reabilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Fazer o mesmo para outras tabelas que podem ser usadas pelo webhook
ALTER TABLE whatsapp_groups DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all groups" ON whatsapp_groups;
CREATE POLICY "Allow all operations on groups" ON whatsapp_groups 
FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;

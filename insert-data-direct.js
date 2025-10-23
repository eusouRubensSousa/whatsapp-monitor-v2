const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wbsikzebfehhrlsdqdjo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertDataDirectly() {
  try {
    console.log('🚀 Inserindo dados diretamente no Supabase...')

    // Primeiro, vamos tentar criar as tabelas via REST API
    console.log('📊 Tentando criar tabelas...')
    
    // Tentar inserir dados em cada tabela
    const testData = {
      groups: [
        {
          group_id: '120363123456789012@g.us',
          group_name: 'Grupo Vendas - Lille Consulting',
          type: 'my_groups',
          owner_id: 'system',
          last_message: 'Preciso de ajuda com automação',
          last_message_time: new Date().toISOString(),
          unread_count: 3
        }
      ],
      employees: [
        {
          user_id: 'user1',
          name: 'João Silva',
          department: 'Vendas',
          status: 'active',
          phone: '+55 11 99999-9999',
          email: 'joao@lilleconsulting.com'
        }
      ],
      messages: [
        {
          group_id: '120363123456789012@g.us',
          sender: 'Cliente João',
          content: 'Preciso de ajuda com automação WhatsApp',
          timestamp: new Date().toISOString(),
          message_type: 'text',
          is_from_employee: false
        }
      ]
    }

    // Tentar inserir grupos
    console.log('📱 Inserindo grupos...')
    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('whatsapp_groups')
        .insert(testData.groups)
      
      if (groupsError) {
        console.log('⚠️ Erro ao inserir grupos:', groupsError.message)
      } else {
        console.log('✅ Grupos inseridos com sucesso!')
      }
    } catch (err) {
      console.log('⚠️ Erro ao inserir grupos:', err.message)
    }

    // Tentar inserir funcionários
    console.log('👥 Inserindo funcionários...')
    try {
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .insert(testData.employees)
      
      if (employeesError) {
        console.log('⚠️ Erro ao inserir funcionários:', employeesError.message)
      } else {
        console.log('✅ Funcionários inseridos com sucesso!')
      }
    } catch (err) {
      console.log('⚠️ Erro ao inserir funcionários:', err.message)
    }

    // Tentar inserir mensagens
    console.log('💬 Inserindo mensagens...')
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .insert(testData.messages)
      
      if (messagesError) {
        console.log('⚠️ Erro ao inserir mensagens:', messagesError.message)
      } else {
        console.log('✅ Mensagens inseridas com sucesso!')
      }
    } catch (err) {
      console.log('⚠️ Erro ao inserir mensagens:', err.message)
    }

    console.log('')
    console.log('📋 Para resolver o problema:')
    console.log('1. Acesse: https://supabase.com/dashboard')
    console.log('2. Vá para o projeto: wbsikzebfehhrlsdqdjo')
    console.log('3. Clique em "SQL Editor"')
    console.log('4. Execute o arquivo: supabase-tables.sql')
    console.log('5. Depois execute: node insert-test-data.js')

  } catch (error) {
    console.log('❌ Erro geral:', error.message)
  }
}

insertDataDirectly()

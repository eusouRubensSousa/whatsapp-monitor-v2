const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wbsikzebfehhrlsdqdjo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertTestDataSimple() {
  try {
    console.log('🚀 Inserindo dados de teste simples...')

    // 1. Inserir grupos
    console.log('📱 Inserindo grupos...')
    const groups = [
      {
        group_id: '120363123456789012@g.us',
        group_name: 'Grupo Vendas - Lille Consulting',
        type: 'my_groups',
        owner_id: 'system',
        last_message: 'Preciso de ajuda com automação',
        last_message_time: new Date().toISOString(),
        unread_count: 3
      },
      {
        group_id: '120363123456789013@g.us',
        group_name: 'Suporte Técnico - Clientes',
        type: 'client_groups',
        owner_id: 'system',
        last_message: 'Sistema funcionando perfeitamente!',
        last_message_time: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 0
      }
    ]

    const { data: groupsData, error: groupsError } = await supabase
      .from('whatsapp_groups')
      .insert(groups)

    if (groupsError) {
      console.log('⚠️ Erro ao inserir grupos:', groupsError.message)
    } else {
      console.log('✅ Grupos inseridos com sucesso!')
    }

    // 2. Inserir funcionários
    console.log('👥 Inserindo funcionários...')
    const employees = [
      {
        user_id: 'user1',
        name: 'João Silva',
        department: 'Vendas',
        status: 'active',
        phone: '+55 11 99999-9999',
        email: 'joao@lilleconsulting.com'
      },
      {
        user_id: 'user2',
        name: 'Maria Santos',
        department: 'Suporte',
        status: 'active',
        phone: '+55 11 88888-8888',
        email: 'maria@lilleconsulting.com'
      }
    ]

    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .insert(employees)

    if (employeesError) {
      console.log('⚠️ Erro ao inserir funcionários:', employeesError.message)
    } else {
      console.log('✅ Funcionários inseridos com sucesso!')
    }

    // 3. Inserir mensagens
    console.log('💬 Inserindo mensagens...')
    const messages = [
      {
        group_id: '120363123456789012@g.us',
        sender: 'Cliente João',
        content: 'Preciso de ajuda com automação WhatsApp',
        timestamp: new Date().toISOString(),
        message_type: 'text',
        is_from_employee: false
      },
      {
        group_id: '120363123456789012@g.us',
        sender: 'João Silva',
        content: 'Olá! Como posso ajudá-lo?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        message_type: 'text',
        is_from_employee: true,
        employee_id: 'user1'
      }
    ]

    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .insert(messages)

    if (messagesError) {
      console.log('⚠️ Erro ao inserir mensagens:', messagesError.message)
    } else {
      console.log('✅ Mensagens inseridas com sucesso!')
    }

    console.log('')
    console.log('🎉 Dados de teste inseridos!')
    console.log('🔄 Atualize a página do dashboard para ver os dados!')

  } catch (error) {
    console.log('❌ Erro geral:', error.message)
  }
}

insertTestDataSimple()

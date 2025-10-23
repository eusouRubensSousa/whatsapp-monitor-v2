const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wbsikzebfehhrlsdqdjo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertTestData() {
  try {
    console.log('🚀 Inserindo dados de teste no Supabase...')

    // 1. Criar grupos de teste
    console.log('📱 Criando grupos de teste...')
    const groups = [
      {
        group_id: '120363123456789012@g.us',
        group_name: 'Grupo Vendas - Lille Consulting',
        type: 'my_groups',
        owner_id: 'system',
        last_message: 'Preciso de ajuda com o produto X',
        last_message_time: new Date().toISOString(),
        unread_count: 3
      },
      {
        group_id: '120363123456789013@g.us',
        group_name: 'Suporte Técnico - Clientes',
        type: 'client_groups',
        owner_id: 'system',
        last_message: 'O sistema está funcionando perfeitamente',
        last_message_time: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        unread_count: 0
      },
      {
        group_id: '120363123456789014@g.us',
        group_name: 'Clientes VIP - Lille',
        type: 'client_groups',
        owner_id: 'system',
        last_message: 'Obrigado pelo atendimento excelente!',
        last_message_time: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        unread_count: 1
      },
      {
        group_id: '120363123456789015@g.us',
        group_name: 'Marketing Digital - Equipe',
        type: 'my_groups',
        owner_id: 'system',
        last_message: 'Nova campanha de automação lançada',
        last_message_time: new Date(Date.now() - 10800000).toISOString(), // 3 horas atrás
        unread_count: 0
      }
    ]

    const { data: groupsData, error: groupsError } = await supabase
      .from('whatsapp_groups')
      .insert(groups)

    if (groupsError) {
      console.log('⚠️ Erro ao inserir grupos:', groupsError.message)
    } else {
      console.log('✅ Grupos criados com sucesso!')
    }

    // 2. Criar funcionários de teste
    console.log('👥 Criando funcionários de teste...')
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
      },
      {
        user_id: 'user3',
        name: 'Pedro Costa',
        department: 'Marketing',
        status: 'active',
        phone: '+55 11 77777-7777',
        email: 'pedro@lilleconsulting.com'
      },
      {
        user_id: 'user4',
        name: 'Ana Oliveira',
        department: 'Financeiro',
        status: 'inactive',
        phone: '+55 11 66666-6666',
        email: 'ana@lilleconsulting.com'
      }
    ]

    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .insert(employees)

    if (employeesError) {
      console.log('⚠️ Erro ao inserir funcionários:', employeesError.message)
    } else {
      console.log('✅ Funcionários criados com sucesso!')
    }

    // 3. Criar mensagens de teste
    console.log('💬 Criando mensagens de teste...')
    const messages = [
      {
        group_id: '120363123456789012@g.us',
        sender: 'Cliente João',
        content: 'Preciso de ajuda com a automação do WhatsApp',
        timestamp: new Date().toISOString(),
        message_type: 'text',
        is_from_employee: false
      },
      {
        group_id: '120363123456789012@g.us',
        sender: 'João Silva',
        content: 'Olá! Como posso ajudá-lo com a automação?',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
        message_type: 'text',
        is_from_employee: true,
        employee_id: 'user1'
      },
      {
        group_id: '120363123456789012@g.us',
        sender: 'Cliente João',
        content: 'Quero automatizar o atendimento de clientes',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutos atrás
        message_type: 'text',
        is_from_employee: false
      },
      {
        group_id: '120363123456789013@g.us',
        sender: 'Cliente Maria',
        content: 'O sistema de automação está funcionando perfeitamente!',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        message_type: 'text',
        is_from_employee: false
      },
      {
        group_id: '120363123456789014@g.us',
        sender: 'Cliente VIP',
        content: 'Obrigado pelo atendimento excelente da Lille Consulting!',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        message_type: 'text',
        is_from_employee: false
      },
      {
        group_id: '120363123456789015@g.us',
        sender: 'Pedro Costa',
        content: 'Nova campanha de automação WhatsApp lançada para todos os clientes',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 horas atrás
        message_type: 'text',
        is_from_employee: true,
        employee_id: 'user3'
      }
    ]

    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .insert(messages)

    if (messagesError) {
      console.log('⚠️ Erro ao inserir mensagens:', messagesError.message)
    } else {
      console.log('✅ Mensagens criadas com sucesso!')
    }

    // 4. Criar interações de teste
    console.log('📊 Criando interações de teste...')
    const interactions = [
      {
        group_id: '120363123456789012@g.us',
        employee_id: 'user1',
        client_id: 'cliente1',
        response_time: 5, // 5 minutos
        message_count: 3
      },
      {
        group_id: '120363123456789013@g.us',
        employee_id: 'user2',
        client_id: 'cliente2',
        response_time: 15, // 15 minutos
        message_count: 1
      },
      {
        group_id: '120363123456789014@g.us',
        employee_id: 'user1',
        client_id: 'cliente3',
        response_time: 2, // 2 minutos
        message_count: 1
      }
    ]

    const { data: interactionsData, error: interactionsError } = await supabase
      .from('interactions')
      .insert(interactions)

    if (interactionsError) {
      console.log('⚠️ Erro ao inserir interações:', interactionsError.message)
    } else {
      console.log('✅ Interações criadas com sucesso!')
    }

    console.log('')
    console.log('🎉 Dados de teste inseridos com sucesso!')
    console.log('📱 Agora você pode ver dados reais no dashboard!')
    console.log('')
    console.log('📊 Dados inseridos:')
    console.log('  - 4 grupos do WhatsApp')
    console.log('  - 4 funcionários')
    console.log('  - 6 mensagens')
    console.log('  - 3 interações')
    console.log('')
    console.log('🔄 Atualize a página do dashboard para ver os dados!')

  } catch (error) {
    console.log('❌ Erro geral:', error.message)
  }
}

insertTestData()

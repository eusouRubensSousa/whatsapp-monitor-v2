const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wbsikzebfehhrlsdqdjo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE1NjA2MSwiZXhwIjoyMDc2NzMyMDYxfQ.example-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  try {
    console.log('🚀 Criando usuário de teste...')
    
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@whatsapp-monitor.com',
      password: 'admin123',
      email_confirm: true
    })

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message)
      return
    }

    console.log('✅ Usuário criado no Supabase Auth:', authData.user.email)

    // Criar entrada na tabela users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'admin@whatsapp-monitor.com',
        role: 'admin',
        name: 'Administrador'
      })

    if (userError) {
      console.error('❌ Erro ao criar entrada de usuário:', userError.message)
      return
    }

    console.log('✅ Entrada criada na tabela users')
    console.log('')
    console.log('🎉 Usuário criado com sucesso!')
    console.log('📧 Email: admin@whatsapp-monitor.com')
    console.log('🔑 Senha: admin123')
    console.log('')
    console.log('Agora você pode fazer login no sistema!')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

createTestUser()

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wbsikzebfehhrlsdqdjo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2lremViZmVoaHJsc2RxZGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwNjEsImV4cCI6MjA3NjczMjA2MX0.aRCDKtmFbTIJXCTrzbdU_u7iDgCiOYP8hq5ObsNBQo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createUserAndLogin() {
  try {
    console.log('🔧 Criando usuário teste@teste.com...')
    
    // Primeiro, tentar criar o usuário
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'teste@teste.com',
      password: '123456',
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ Usuário já existe! Tentando fazer login...')
      } else {
        console.log('❌ Erro ao criar usuário:', signUpError.message)
        return
      }
    } else {
      console.log('✅ Usuário criado com sucesso!')
    }

    // Tentar fazer login
    console.log('🔐 Tentando fazer login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'teste@teste.com',
      password: '123456',
    })

    if (loginError) {
      console.log('❌ Erro no login:', loginError.message)
    } else {
      console.log('✅ Login realizado com sucesso!')
      console.log('👤 Usuário:', loginData.user.email)
    }

  } catch (error) {
    console.log('❌ Erro geral:', error.message)
  }
}

createUserAndLogin()

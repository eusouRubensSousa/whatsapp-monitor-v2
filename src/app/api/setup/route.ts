import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Criar usuário de teste
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@whatsapp-monitor.com',
      password: 'admin123',
      email_confirm: true
    })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)
      return NextResponse.json({ error: 'Erro ao criar usuário', details: authError.message }, { status: 500 })
    }

    // Criar entrada na tabela users
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'admin@whatsapp-monitor.com',
        role: 'admin',
        name: 'Administrador'
      })

    if (userError) {
      console.error('Erro ao criar entrada de usuário:', userError)
      return NextResponse.json({ error: 'Erro ao criar entrada de usuário', details: userError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Usuário criado com sucesso!',
      user: {
        email: 'admin@whatsapp-monitor.com',
        password: 'admin123'
      }
    })

  } catch (error) {
    console.error('Erro no setup:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

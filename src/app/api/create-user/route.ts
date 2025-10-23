import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Criar usuário
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/login`
      }
    })

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        success: false 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Usuário criado com sucesso!',
      user: data.user,
      success: true 
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      success: false 
    }, { status: 500 })
  }
}

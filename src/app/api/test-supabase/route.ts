import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testando conexão com Supabase...')
    
    // Verificar se o Supabase está configurado
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase não configurado - variáveis de ambiente não definidas'
      }, { status: 500 })
    }
    
    // Testar conexão básica
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Erro na conexão com Supabase:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 })
    }

    console.log('Conexão com Supabase OK')
    return NextResponse.json({ 
      success: true, 
      message: 'Conexão com Supabase funcionando',
      data: data
    })

  } catch (error) {
    console.error('Erro geral no teste do Supabase:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

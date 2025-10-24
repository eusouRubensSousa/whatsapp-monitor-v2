import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testando variáveis de ambiente...')
    
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINIDA' : 'NÃO DEFINIDA',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
    }
    
    console.log('Variáveis de ambiente:', envVars)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Variáveis de ambiente testadas',
      envVars
    })

  } catch (error) {
    console.error('Erro no teste de variáveis:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

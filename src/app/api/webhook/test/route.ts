import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Teste webhook recebido')
    
    const payload = await request.json()
    console.log('Payload de teste:', JSON.stringify(payload, null, 2))
    
    return NextResponse.json({ 
      message: 'Webhook de teste funcionando!', 
      received: payload,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erro no webhook de teste:', error)
    return NextResponse.json({ 
      error: 'Erro no webhook de teste', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Validar token da Evolution API
function validateEvolutionToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedToken = 'F218A80A2E55-45D4-ACDB-BA9E3E915601'
  
  if (!authHeader) return false
  
  const token = authHeader.replace('Bearer ', '')
  return token === expectedToken
}

export async function POST(request: NextRequest) {
  try {
    console.log('Webhook recebido:', request.url)
    
    // Validar token da Evolution API
    if (!validateEvolutionToken(request)) {
      console.log('Token inválido')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    console.log('Payload recebido:', JSON.stringify(payload, null, 2))
    
    // Validar se é uma mensagem válida
    if (!payload.data || !payload.data.key || !payload.data.message) {
      console.log('Payload inválido')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { key, message, messageTimestamp, pushName } = payload.data
    
    // Extrair informações da mensagem
    const groupId = key.remoteJid
    const messageId = key.id
    const isFromMe = key.fromMe
    
    console.log('Processando mensagem:', { groupId, messageId, isFromMe, pushName })
    
    // Determinar o tipo de mensagem e conteúdo
    let messageContent = ''
    let messageType = 'text'
    
    if (message.conversation) {
      messageContent = message.conversation
      messageType = 'text'
    } else if (message.imageMessage) {
      messageContent = '[Imagem]'
      messageType = 'image'
    } else if (message.videoMessage) {
      messageContent = '[Vídeo]'
      messageType = 'video'
    } else if (message.audioMessage) {
      messageContent = '[Áudio]'
      messageType = 'audio'
    } else if (message.documentMessage) {
      messageContent = '[Documento]'
      messageType = 'document'
    }

    console.log('Conteúdo da mensagem:', { messageContent, messageType })

    // Verificar se é um grupo (contém @g.us)
    const isGroup = groupId.includes('@g.us')
    console.log('É grupo?', isGroup)
    
    if (!isGroup) {
      console.log('Não é mensagem de grupo, ignorando')
      return NextResponse.json({ message: 'Not a group message' })
    }

    // Tentar inserir mensagem no Supabase
    console.log('Salvando mensagem no Supabase...')
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          group_id: groupId,
          sender: isFromMe ? 'Você' : pushName || 'Usuário',
          content: messageContent,
          timestamp: new Date(messageTimestamp * 1000).toISOString(),
          message_type: messageType,
          is_from_employee: isFromMe,
          employee_id: isFromMe ? 'current_user' : null
        })

      if (error) {
        console.error('Erro ao salvar mensagem:', error)
        
        // Se o erro for de RLS, tentar uma abordagem alternativa
        if (error.message.includes('row-level security')) {
          console.log('Erro de RLS detectado, tentando abordagem alternativa...')
          
          // Retornar sucesso mesmo com erro de RLS para não quebrar o webhook
          return NextResponse.json({ 
            message: 'Message processed (RLS issue - check database policies)',
            warning: 'RLS policy blocking insertion'
          })
        }
        
        return NextResponse.json({ error: 'Failed to save message', details: error.message }, { status: 500 })
      }

      console.log('Mensagem salva com sucesso')

    } catch (dbError) {
      console.error('Erro de banco de dados:', dbError)
      
      // Retornar sucesso mesmo com erro para não quebrar o webhook
      return NextResponse.json({ 
        message: 'Webhook received (database issue - check RLS policies)',
        warning: 'Database error but webhook processed'
      })
    }

    // Atualizar estatísticas do grupo
    await updateGroupStats(groupId, isFromMe)

    return NextResponse.json({ message: 'Message processed successfully' })
    
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

async function updateGroupStats(groupId: string, isFromEmployee: boolean) {
  try {
    console.log('Atualizando estatísticas do grupo:', groupId)
    
    // Buscar grupo existente
    const { data: group, error: groupError } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .eq('group_id', groupId)
      .single()

    if (groupError && groupError.code !== 'PGRST116') {
      console.error('Erro ao buscar grupo:', groupError)
      return
    }

    console.log('Grupo encontrado:', group)

    // Se o grupo não existe, criar um novo
    if (!group) {
      console.log('Criando novo grupo...')
      const { error: insertError } = await supabase
        .from('whatsapp_groups')
        .insert({
          group_id: groupId,
          group_name: `Grupo ${groupId.split('@')[0]}`,
          type: 'client_groups',
          owner_id: 'system'
        })

      if (insertError) {
        console.error('Erro ao criar grupo:', insertError)
      } else {
        console.log('Grupo criado com sucesso')
      }
    }

    // Atualizar última mensagem do grupo
    console.log('Atualizando última mensagem do grupo...')
    const { error: updateError } = await supabase
      .from('whatsapp_groups')
      .update({
        last_message_time: new Date().toISOString()
      })
      .eq('group_id', groupId)

    if (updateError) {
      console.error('Erro ao atualizar grupo:', updateError)
    } else {
      console.log('Grupo atualizado com sucesso')
    }

  } catch (error) {
    console.error('Erro ao atualizar estatísticas do grupo:', error)
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Webhook N8N recebido:', request.url)
    
    const payload = await request.json()
    console.log('Payload N8N recebido:', JSON.stringify(payload, null, 2))
    
    // Verificar se é uma mensagem válida
    if (!payload.data || !payload.data.key || !payload.data.message) {
      console.log('Payload inválido do N8N')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { key, message, messageTimestamp, pushName } = payload.data
    
    // Extrair informações da mensagem
    const groupId = key.remoteJid
    const messageId = key.id
    const isFromMe = key.fromMe
    
    console.log('Processando mensagem do N8N:', { groupId, messageId, isFromMe, pushName })
    
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

    console.log('Conteúdo da mensagem do N8N:', { messageContent, messageType })

    // Verificar se é um grupo (contém @g.us)
    const isGroup = groupId.includes('@g.us')
    console.log('É grupo?', isGroup)
    
    if (!isGroup) {
      console.log('Não é mensagem de grupo, ignorando')
      return NextResponse.json({ message: 'Not a group message' })
    }

    // Tentar inserir mensagem no Supabase
    console.log('Salvando mensagem do N8N no Supabase...')
    
    if (!supabase) {
      console.error('Supabase não configurado')
      return NextResponse.json({ message: 'Supabase não configurado' }, { status: 500 })
    }
    
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
        console.error('Erro ao salvar mensagem do N8N:', error)
        return NextResponse.json({ error: 'Failed to save message', details: error.message }, { status: 500 })
      }

      console.log('Mensagem do N8N salva com sucesso')

    } catch (dbError) {
      console.error('Erro de banco de dados do N8N:', dbError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Atualizar estatísticas do grupo
    await updateGroupStats(groupId, isFromMe)

    return NextResponse.json({ message: 'Message from N8N processed successfully' })
    
  } catch (error) {
    console.error('Erro no webhook N8N:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

async function updateGroupStats(groupId: string, isFromEmployee: boolean) {
  try {
    console.log('Atualizando estatísticas do grupo do N8N:', groupId)
    
    if (!supabase) {
      console.error('Supabase não configurado')
      return
    }
    
    // Buscar grupo existente
    const { data: group, error: groupError } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .eq('group_id', groupId)
      .single()

    if (groupError && groupError.code !== 'PGRST116') {
      console.error('Erro ao buscar grupo do N8N:', groupError)
      return
    }

    console.log('Grupo encontrado do N8N:', group)

    // Se o grupo não existe, criar um novo
    if (!group) {
      console.log('Criando novo grupo do N8N...')
      const { error: insertError } = await supabase
        .from('whatsapp_groups')
        .insert({
          group_id: groupId,
          group_name: `Grupo ${groupId.split('@')[0]}`,
          type: 'client_groups',
          owner_id: 'system'
        })

      if (insertError) {
        console.error('Erro ao criar grupo do N8N:', insertError)
      } else {
        console.log('Grupo do N8N criado com sucesso')
      }
    }

    // Atualizar última mensagem do grupo
    console.log('Atualizando última mensagem do grupo do N8N...')
    const { error: updateError } = await supabase
      .from('whatsapp_groups')
      .update({
        last_message_time: new Date().toISOString()
      })
      .eq('group_id', groupId)

    if (updateError) {
      console.error('Erro ao atualizar grupo do N8N:', updateError)
    } else {
      console.log('Grupo do N8N atualizado com sucesso')
    }

  } catch (error) {
    console.error('Erro ao atualizar estatísticas do grupo do N8N:', error)
  }
}

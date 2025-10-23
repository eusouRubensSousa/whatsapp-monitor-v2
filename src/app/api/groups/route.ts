import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { evolutionAPI } from '@/lib/evolution-api'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
    }
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    
    // Buscar grupos do Supabase
    let query = supabase
      .from('whatsapp_groups')
      .select('*')
      .order('last_message_time', { ascending: false })

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    const { data: groups, error } = await query

    if (error) {
      console.error('Error fetching groups:', error)
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
    }

    return NextResponse.json({ groups: groups || [] })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
    }
    
    const body = await request.json()
    const { group_id, group_name, type, owner_id } = body

    if (!group_id || !group_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verificar se o grupo já existe
    const { data: existingGroup } = await supabase
      .from('whatsapp_groups')
      .select('id')
      .eq('group_id', group_id)
      .single()

    if (existingGroup) {
      return NextResponse.json({ error: 'Group already exists' }, { status: 409 })
    }

    // Criar novo grupo
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert({
        group_id,
        group_name,
        type: type || 'client_groups',
        owner_id: owner_id || 'system'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating group:', error)
      return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
    }

    return NextResponse.json({ group: data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
    }
    
    const body = await request.json()
    const { id, group_name, type } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing group ID' }, { status: 400 })
    }

    const updateData: any = {}
    if (group_name) updateData.group_name = group_name
    if (type) updateData.type = type

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating group:', error)
      return NextResponse.json({ error: 'Failed to update group' }, { status: 500 })
    }

    return NextResponse.json({ group: data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing group ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('whatsapp_groups')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting group:', error)
      return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Group deleted successfully' })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


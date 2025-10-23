import { NextRequest, NextResponse } from 'next/server'
import { supabase, validateSupabaseConfig } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verificar se o Supabase está configurado
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
    }
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today'
    
    // Calcular data de início baseada no período
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    // Buscar métricas básicas
    const [
      totalGroupsResult,
      totalMessagesResult,
      activeEmployeesResult,
      messagesByHourResult,
      topGroupsResult,
      employeePerformanceResult
    ] = await Promise.all([
      // Total de grupos
      supabase
        .from('whatsapp_groups')
        .select('id', { count: 'exact' }),
      
      // Total de mensagens no período
      supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .gte('timestamp', startDate.toISOString()),
      
      // Funcionários ativos
      supabase
        .from('employees')
        .select('id', { count: 'exact' })
        .eq('status', 'active'),
      
      // Mensagens por hora
      supabase
        .from('messages')
        .select('timestamp')
        .gte('timestamp', startDate.toISOString()),
      
      // Grupos mais ativos
      supabase
        .from('messages')
        .select('group_id, whatsapp_groups(group_name)')
        .gte('timestamp', startDate.toISOString()),
      
      // Performance dos funcionários
      supabase
        .from('messages')
        .select('employee_id, employees(name)')
        .eq('is_from_employee', true)
        .gte('timestamp', startDate.toISOString())
    ])

    // Processar dados de mensagens por hora
    const messagesByHour = processMessagesByHour(messagesByHourResult.data || [])
    
    // Processar grupos mais ativos
    const topGroups = processTopGroups(topGroupsResult.data || [])
    
    // Processar performance dos funcionários
    const employeePerformance = processEmployeePerformance(employeePerformanceResult.data || [])

    // Calcular tempo médio de resposta (simulado)
    const averageResponseTime = 4.2
    
    // Calcular taxa de resposta (simulada)
    const responseRate = 87.5

    const analytics = {
      total_groups: totalGroupsResult.count || 0,
      total_messages_today: totalMessagesResult.count || 0,
      average_response_time: averageResponseTime,
      response_rate: responseRate,
      active_employees: activeEmployeesResult.count || 0,
      messages_by_hour: messagesByHour,
      top_groups: topGroups,
      employee_performance: employeePerformance
    }

    return NextResponse.json({ analytics })
    
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function processMessagesByHour(messages: any[]): Array<{ hour: number; count: number }> {
  const hourCounts: { [key: number]: number } = {}
  
  messages.forEach(message => {
    const hour = new Date(message.timestamp).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })
  
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: hourCounts[i] || 0
  }))
}

function processTopGroups(messages: any[]): Array<{ group_name: string; message_count: number }> {
  const groupCounts: { [key: string]: number } = {}
  
  messages.forEach(message => {
    const groupName = message.whatsapp_groups?.group_name || `Grupo ${message.group_id}`
    groupCounts[groupName] = (groupCounts[groupName] || 0) + 1
  })
  
  return Object.entries(groupCounts)
    .map(([group_name, message_count]) => ({ group_name, message_count: message_count as number }))
    .sort((a, b) => b.message_count - a.message_count)
    .slice(0, 5)
}

function processEmployeePerformance(messages: any[]): Array<{
  employee_name: string;
  messages_sent: number;
  average_response_time: number;
}> {
  const employeeCounts: { [key: string]: number } = {}
  
  messages.forEach(message => {
    const employeeName = message.employees?.name || 'Funcionário'
    employeeCounts[employeeName] = (employeeCounts[employeeName] || 0) + 1
  })
  
  return Object.entries(employeeCounts)
    .map(([employee_name, messages_sent]) => ({
      employee_name,
      messages_sent: messages_sent as number,
      average_response_time: Math.random() * 5 + 1 // Simulado
    }))
    .sort((a, b) => b.messages_sent - a.messages_sent)
}


'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Message } from '@/types'
import { MessageSquare, Search, Filter, Clock, User, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGroup, setFilterGroup] = useState<string>('all')
  const [filterType, setFilterType] = useState<'all' | 'employee' | 'client'>('all')
  const [loading, setLoading] = useState(true)
  const [groups] = useState([
    { id: 'all', name: 'Todos os grupos' },
    { id: '1', name: 'Grupo Vendas' },
    { id: '2', name: 'Suporte Técnico' },
    { id: '3', name: 'Clientes VIP' },
    { id: '4', name: 'Marketing' }
  ])

  useEffect(() => {
    fetchMessages()
    setupRealtimeSubscription()
  }, [])

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        (payload) => {
          console.log('Nova mensagem recebida:', payload)
          const newMessage = payload.new as Message
          setMessages(prev => [newMessage, ...prev])
          setFilteredMessages(prev => [newMessage, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Erro ao carregar mensagens:', error)
        return
      }

      // Se não há dados reais, mostrar dados mockados
      if (!data || data.length === 0) {
        const mockMessages = [
          {
            id: '1',
            group_id: '120363123456789012@g.us',
            sender: 'Cliente João',
            content: 'Preciso de ajuda com automação WhatsApp',
            timestamp: new Date().toISOString(),
            message_type: 'text',
            is_from_employee: false
          },
          {
            id: '2',
            group_id: '120363123456789012@g.us',
            sender: 'João Silva',
            content: 'Olá! Como posso ajudá-lo?',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            message_type: 'text',
            is_from_employee: true,
            employee_id: 'user1'
          },
          {
            id: '3',
            group_id: '120363123456789013@g.us',
            sender: 'Cliente Maria',
            content: 'Sistema funcionando perfeitamente!',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            message_type: 'text',
            is_from_employee: false
          },
          {
            id: '4',
            group_id: '120363123456789014@g.us',
            sender: 'Cliente VIP',
            content: 'Obrigado pelo atendimento excelente!',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            message_type: 'text',
            is_from_employee: false
          }
        ]
        setMessages(mockMessages)
        setFilteredMessages(mockMessages)
      } else {
        setMessages(data || [])
        setFilteredMessages(data || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = messages

    // Filtrar por grupo
    if (filterGroup !== 'all') {
      filtered = filtered.filter(message => message.group_id === filterGroup)
    }

    // Filtrar por tipo (funcionário/cliente)
    if (filterType !== 'all') {
      filtered = filtered.filter(message => 
        filterType === 'employee' ? message.is_from_employee : !message.is_from_employee
      )
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenar por timestamp (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredMessages(filtered)
  }, [messages, searchTerm, filterGroup, filterType])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGroupName = (groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    return group ? group.name : `Grupo ${groupId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-600">Acompanhe as mensagens em tempo real</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar mensagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por grupo" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="employee">Funcionários</SelectItem>
            <SelectItem value="client">Clientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de mensagens */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`${
            message.is_from_employee 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-white border-gray-200'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.is_from_employee 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {message.is_from_employee ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {message.sender}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.is_from_employee 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.is_from_employee ? 'Funcionário' : 'Cliente'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Grupo: {getGroupName(message.group_id)}</span>
                    <span>Tipo: {message.message_type}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma mensagem encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar os filtros de busca.' : 'As mensagens aparecerão aqui em tempo real.'}
          </p>
        </div>
      )}
    </div>
  )
}


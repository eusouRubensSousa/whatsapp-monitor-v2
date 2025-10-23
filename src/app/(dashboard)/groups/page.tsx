'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WhatsAppGroup } from '@/types'
import { MessageSquare, Users, Clock, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function GroupsPage() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<WhatsAppGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'my_groups' | 'client_groups'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
    setupRealtimeSubscription()
  }, [])

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('groups_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'whatsapp_groups' 
        }, 
        (payload) => {
          console.log('Grupo atualizado:', payload)
          // Recarregar grupos quando houver mudanças
          fetchGroups()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('last_message_time', { ascending: false })

      if (error) {
        console.error('Erro ao carregar grupos:', error)
        return
      }

      // Se não há dados reais, mostrar dados mockados
      if (!data || data.length === 0) {
        const mockGroups = [
          {
            id: '1',
            group_id: '120363123456789012@g.us',
            group_name: 'Grupo Vendas - Lille Consulting',
            type: 'my_groups',
            owner_id: 'system',
            created_at: new Date().toISOString(),
            last_message: 'Preciso de ajuda com automação WhatsApp',
            last_message_time: new Date().toISOString(),
            unread_count: 3
          },
          {
            id: '2',
            group_id: '120363123456789013@g.us',
            group_name: 'Suporte Técnico - Clientes',
            type: 'client_groups',
            owner_id: 'system',
            created_at: new Date().toISOString(),
            last_message: 'Sistema funcionando perfeitamente!',
            last_message_time: new Date(Date.now() - 3600000).toISOString(),
            unread_count: 0
          },
          {
            id: '3',
            group_id: '120363123456789014@g.us',
            group_name: 'Clientes VIP - Lille',
            type: 'client_groups',
            owner_id: 'system',
            created_at: new Date().toISOString(),
            last_message: 'Obrigado pelo atendimento excelente!',
            last_message_time: new Date(Date.now() - 7200000).toISOString(),
            unread_count: 1
          }
        ]
        setGroups(mockGroups)
        setFilteredGroups(mockGroups)
      } else {
        setGroups(data || [])
        setFilteredGroups(data || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = groups

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(group => group.type === filterType)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredGroups(filtered)
  }, [groups, searchTerm, filterType])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    return date.toLocaleDateString('pt-BR')
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
        <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
        <p className="text-gray-600">Gerencie e monitore seus grupos do WhatsApp</p>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              <SelectItem value="my_groups">Meus grupos</SelectItem>
              <SelectItem value="client_groups">Grupos de clientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => window.location.href = '/groups/add'}>
          + Adicionar Grupo
        </Button>
      </div>

      {/* Lista de grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.group_name}</CardTitle>
                {group.unread_count && group.unread_count > 0 && (
                  <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {group.unread_count}
                  </div>
                )}
              </div>
              <CardDescription>
                {group.type === 'my_groups' ? 'Meu grupo' : 'Grupo de cliente'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                  <span className="truncate">{group.last_message}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(group.last_message_time || group.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>ID: {group.group_id.split('@')[0]}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver mensagens
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/groups/edit/${group.id}`}
                >
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum grupo encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando grupos do WhatsApp.'}
          </p>
        </div>
      )}
    </div>
  )
}


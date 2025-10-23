'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Group {
  id: string
  group_id: string
  group_name: string
  type: string
  owner_id: string
  last_message?: string
  last_message_time?: string
  unread_count?: number
}

export default function EditGroupPage() {
  const [group, setGroup] = useState<Group | null>(null)
  const [formData, setFormData] = useState({
    group_id: '',
    group_name: '',
    type: 'client_groups',
    owner_id: 'system'
  })
  const [loading, setLoading] = useState(false)
  const [loadingGroup, setLoadingGroup] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      fetchGroup(params.id as string)
    }
  }, [params.id])

  const fetchGroup = async (id: string) => {
    try {
      if (!supabase) {
        toast.error('Supabase não configurado')
        return
      }
      
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Erro ao carregar grupo: ' + error.message)
        router.push('/groups')
        return
      }

      setGroup(data)
      setFormData({
        group_id: data.group_id,
        group_name: data.group_name,
        type: data.type,
        owner_id: data.owner_id
      })
    } catch (error) {
      toast.error('Erro inesperado ao carregar grupo')
      router.push('/groups')
    } finally {
      setLoadingGroup(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabase) {
        toast.error('Supabase não configurado')
        return
      }
      
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .update(formData)
        .eq('id', params.id)

      if (error) {
        toast.error('Erro ao atualizar grupo: ' + error.message)
        return
      }

      toast.success('Grupo atualizado com sucesso!')
      router.push('/groups')
    } catch (error) {
      toast.error('Erro inesperado ao atualizar grupo')
    } finally {
      setLoading(false)
    }
  }

  if (loadingGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Grupo não encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Grupo</h1>
        <p className="text-gray-600">Edite as informações do grupo do WhatsApp</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Grupo</CardTitle>
          <CardDescription>
            Edite as informações do grupo que será monitorado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group_id">ID do Grupo</Label>
              <Input
                id="group_id"
                type="text"
                placeholder="Ex: 120363123456789012@g.us"
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                required
              />
              <p className="text-sm text-gray-500">
                ID único do grupo no WhatsApp (termina com @g.us)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group_name">Nome do Grupo</Label>
              <Input
                id="group_name"
                type="text"
                placeholder="Ex: Grupo Vendas - Clientes VIP"
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo do Grupo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="PROD">PROD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Atualizando...' : 'Atualizar Grupo'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/groups')}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

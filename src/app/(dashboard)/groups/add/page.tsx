'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AddGroupPage() {
  const [formData, setFormData] = useState({
    group_id: '',
    group_name: '',
    type: 'client_groups',
    owner_id: 'system'
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        .insert([formData])

      if (error) {
        toast.error('Erro ao cadastrar grupo: ' + error.message)
        return
      }

      toast.success('Grupo cadastrado com sucesso!')
      router.push('/groups')
    } catch (error) {
      toast.error('Erro inesperado ao cadastrar grupo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Adicionar Grupo</h1>
        <p className="text-gray-600">Cadastre um novo grupo do WhatsApp</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Grupo</CardTitle>
          <CardDescription>
            Preencha as informações do grupo que será monitorado
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
                  <SelectItem value="my_groups">Meus Grupos</SelectItem>
                  <SelectItem value="client_groups">Grupos de Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar Grupo'}
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

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function WebhookTestPage() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTestWebhook = async () => {
    setLoading(true)
    try {
      // Simular payload da Evolution API
      const payload = {
        event: 'messages.upsert',
        instance: 'lille consulting',
        data: {
          key: {
            remoteJid: '120363123456789012@g.us',
            fromMe: false,
            id: 'test_message_' + Date.now()
          },
          message: {
            conversation: testMessage || 'Mensagem de teste do webhook'
          },
          messageTimestamp: Math.floor(Date.now() / 1000),
          pushName: 'Cliente Teste'
        }
      }

      const response = await fetch('/api/webhook/evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer F218A80A2E55-45D4-ACDB-BA9E3E915601'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success('Webhook testado com sucesso!')
      } else {
        const errorText = await response.text()
        toast.error('Erro ao testar webhook: ' + response.statusText + ' - ' + errorText)
      }
    } catch (error) {
      toast.error('Erro ao testar webhook: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  const handleTestSimpleWebhook = async () => {
    setLoading(true)
    try {
      const payload = {
        test: true,
        message: testMessage || 'Mensagem de teste simples',
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/webhook/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Webhook simples funcionando!')
        console.log('Resultado:', result)
      } else {
        toast.error('Erro no webhook simples: ' + response.statusText)
      }
    } catch (error) {
      toast.error('Erro no webhook simples: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  const handleTestSupabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-supabase', {
        method: 'GET'
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Conexão com Supabase OK!')
        console.log('Resultado Supabase:', result)
      } else {
        const errorText = await response.text()
        toast.error('Erro na conexão com Supabase: ' + response.statusText)
        console.error('Erro Supabase:', errorText)
      }
    } catch (error) {
      toast.error('Erro na conexão com Supabase: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teste do Webhook</h1>
        <p className="text-gray-600">Teste a integração com a Evolution API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Webhook</CardTitle>
            <CardDescription>
              Configure o webhook na Evolution API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook_url">URL do Webhook</Label>
              <Input
                id="webhook_url"
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://seu-dominio.vercel.app/api/webhook/evolution"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">URL do Webhook:</h4>
              <code className="text-sm text-blue-700">
                https://webhook.automacao.automacaolille.com.br/webhook/c48bbfb6-b5d5-44fd-be18-5307fb7b082d
              </code>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Token da API:</h4>
              <code className="text-sm text-green-700">
                F218A80A2E55-45D4-ACDB-BA9E3E915601
              </code>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900">Instância:</h4>
              <code className="text-sm text-yellow-700">
                lille consulting
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste do Webhook</CardTitle>
            <CardDescription>
              Teste se o webhook está funcionando
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test_message">Mensagem de Teste</Label>
              <Textarea
                id="test_message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Digite uma mensagem de teste..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleTestWebhook} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testando...' : 'Testar Webhook Evolution'}
              </Button>
              
              <Button 
                onClick={handleTestSimpleWebhook} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Testando...' : 'Testar Webhook Simples'}
              </Button>
              
              <Button 
                onClick={handleTestSupabase} 
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                {loading ? 'Testando...' : 'Testar Conexão Supabase'}
              </Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Como testar:</h4>
              <ol className="text-sm text-gray-700 mt-2 space-y-1">
                <li>1. Configure o webhook na Evolution API</li>
                <li>2. Digite uma mensagem de teste</li>
                <li>3. Clique em "Testar Webhook"</li>
                <li>4. Verifique se a mensagem aparece na página de Mensagens</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
          <CardDescription>
            Verifique o status da integração com a Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Webhook URL</h4>
              <p className="text-sm text-gray-600">Configurado</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full w-full"></div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">API Token</h4>
              <p className="text-sm text-gray-600">Configurado</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full w-full"></div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Conexão</h4>
              <p className="text-sm text-gray-600">Ativa</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

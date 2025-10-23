'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    if (!supabase) {
      setResult('Supabase não configurado')
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setResult(user ? `Usuário logado: ${user.email}` : 'Nenhum usuário logado')
  }

  const handleLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      if (!supabase) {
        setResult('Supabase não configurado')
        return
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult(`Erro: ${error instanceof Error ? error.message : String(error)}`)
      } else {
        setResult(`Login realizado com sucesso! Usuário: ${data.user?.email}`)
        setUser(data.user)
      }
    } catch (error) {
      setResult(`Erro inesperado: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setResult('')
    
    try {
      if (!supabase) {
        setResult('Supabase não configurado')
        return
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setResult(`Erro no registro: ${error instanceof Error ? error.message : String(error)}`)
      } else {
        setResult(`Registro realizado! Verifique seu email: ${data.user?.email}`)
      }
    } catch (error) {
      setResult(`Erro inesperado: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!supabase) {
      setResult('Supabase não configurado')
      return
    }
    
    await supabase.auth.signOut()
    setUser(null)
    setResult('Logout realizado')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">🧪 Teste de Autenticação</CardTitle>
          <CardDescription className="text-center">
            Teste a conexão com o Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleSignUp} className="w-full" disabled={loading}>
              {loading ? 'Processando...' : 'Criar Conta'}
            </Button>
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Fazer Login'}
            </Button>
            {user && (
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Logout
              </Button>
            )}
          </div>

          {result && (
            <div className="p-3 bg-gray-100 rounded text-sm">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

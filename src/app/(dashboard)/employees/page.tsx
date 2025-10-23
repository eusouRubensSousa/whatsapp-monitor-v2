'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Employee } from '@/types'
import { Users, Plus, Clock, MessageSquare, TrendingUp, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    // Simular carregamento de dados
    // Em produção, isso viria de uma API
    setTimeout(() => {
      const mockEmployees: Employee[] = [
        {
          id: '1',
          user_id: 'user1',
          name: 'João Silva',
          department: 'Vendas',
          status: 'active',
          phone: '+55 11 99999-9999',
          email: 'joao@empresa.com',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          user_id: 'user2',
          name: 'Maria Santos',
          department: 'Suporte',
          status: 'active',
          phone: '+55 11 88888-8888',
          email: 'maria@empresa.com',
          created_at: '2024-01-10T09:00:00Z'
        },
        {
          id: '3',
          user_id: 'user3',
          name: 'Pedro Costa',
          department: 'Marketing',
          status: 'active',
          phone: '+55 11 77777-7777',
          email: 'pedro@empresa.com',
          created_at: '2024-01-05T14:00:00Z'
        },
        {
          id: '4',
          user_id: 'user4',
          name: 'Ana Oliveira',
          department: 'Financeiro',
          status: 'inactive',
          phone: '+55 11 66666-6666',
          email: 'ana@empresa.com',
          created_at: '2024-01-01T08:00:00Z'
        }
      ]
      
      setEmployees(mockEmployees)
      setFilteredEmployees(mockEmployees)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = employees

    // Filtrar por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(employee => employee.status === filterStatus)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, filterStatus])

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.department) {
      toast.error('Nome e departamento são obrigatórios')
      return
    }

    // Simular adição de funcionário
    const employee: Employee = {
      id: Date.now().toString(),
      user_id: `user${Date.now()}`,
      name: newEmployee.name,
      department: newEmployee.department,
      status: 'active',
      phone: newEmployee.phone,
      email: newEmployee.email,
      created_at: new Date().toISOString()
    }

    setEmployees([...employees, employee])
    setNewEmployee({ name: '', department: '', phone: '', email: '' })
    setIsAddDialogOpen(false)
    toast.success('Funcionário adicionado com sucesso!')
  }

  const toggleEmployeeStatus = (employeeId: string) => {
    setEmployees(employees.map(employee => 
      employee.id === employeeId 
        ? { ...employee, status: employee.status === 'active' ? 'inactive' : 'active' }
        : employee
    ))
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600">Gerencie sua equipe e acompanhe o desempenho</p>
        </div>
        <Button onClick={() => window.location.href = '/employees/add'}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Funcionário
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de funcionários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{employee.name}</CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <CardDescription>{employee.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {employee.email}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Telefone:</strong> {employee.phone}
                </div>
                
                {/* Métricas simuladas */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>45 msgs</span>
                    </div>
                    <div className="text-xs text-gray-500">hoje</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>3.2m</span>
                    </div>
                    <div className="text-xs text-gray-500">tempo médio</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => toggleEmployeeStatus(employee.id)}
                >
                  {employee.status === 'active' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum funcionário encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando funcionários à sua equipe.'}
          </p>
        </div>
      )}
    </div>
  )
}


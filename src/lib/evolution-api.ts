import { WhatsAppGroup, Message } from '@/types'

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://webhook.automacao.automacaolille.com.br'
const EVOLUTION_API_TOKEN = process.env.EVOLUTION_API_TOKEN || 'F218A80A2E55-45D4-ACDB-BA9E3E915601'

class EvolutionAPI {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = EVOLUTION_API_URL
    this.token = EVOLUTION_API_TOKEN
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.token,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Evolution API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getGroups(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/group/fetchAllGroups')
      return response.data || []
    } catch (error) {
      console.error('Error fetching groups:', error)
      return []
    }
  }

  async getGroupInfo(groupId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/group/findGroupInfos/${groupId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching group info:', error)
      return null
    }
  }

  async getGroupMessages(groupId: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/chat/findMessages/${groupId}?limit=${limit}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching group messages:', error)
      return []
    }
  }

  async sendMessage(groupId: string, message: string): Promise<boolean> {
    try {
      await this.makeRequest('/message/sendText/lille consulting', {
        method: 'POST',
        body: JSON.stringify({
          number: groupId,
          text: message
        })
      })
      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }

  async getInstanceInfo(): Promise<any> {
    try {
      const response = await this.makeRequest('/instance/connectionState/lille consulting')
      return response.data
    } catch (error) {
      console.error('Error fetching instance info:', error)
      return null
    }
  }
}

export const evolutionAPI = new EvolutionAPI()


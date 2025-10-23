export interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  name: string;
  created_at: string;
}

export interface WhatsAppGroup {
  id: string;
  group_id: string;
  group_name: string;
  type: 'my_groups' | 'client_groups';
  owner_id: string;
  created_at: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  group_id: string;
  sender: string;
  content: string;
  timestamp: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document';
  is_from_employee: boolean;
  employee_id?: string;
}

export interface Employee {
  id: string;
  user_id: string;
  name: string;
  department: string;
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Interaction {
  id: string;
  group_id: string;
  employee_id: string;
  client_id?: string;
  response_time: number; // em minutos
  created_at: string;
  message_count: number;
}

export interface Analytics {
  total_groups: number;
  total_messages_today: number;
  average_response_time: number;
  response_rate: number;
  active_employees: number;
  messages_by_hour: Array<{ hour: number; count: number }>;
  top_groups: Array<{ group_name: string; message_count: number }>;
  employee_performance: Array<{
    employee_name: string;
    messages_sent: number;
    average_response_time: number;
  }>;
}

export interface EvolutionWebhookPayload {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message: {
      conversation?: string;
      imageMessage?: any;
      videoMessage?: any;
      audioMessage?: any;
      documentMessage?: any;
    };
    messageTimestamp: number;
    pushName: string;
  };
}


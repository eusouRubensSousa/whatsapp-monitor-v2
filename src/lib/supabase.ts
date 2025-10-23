import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não estão definidas')
}

// Cliente para uso no browser
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso no servidor (com service role key) - apenas se a chave estiver definida
export const supabaseAdmin = serviceRoleKey ? createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

/**
 * Environment variables validation
 * This ensures all required environment variables are set before the app starts
 */

interface EnvVars {
  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string

  // Supabase Service Role (optional for some features)
  SUPABASE_SERVICE_ROLE_KEY?: string

  // Evolution API (optional)
  EVOLUTION_API_URL?: string
  EVOLUTION_API_TOKEN?: string
  NEXT_PUBLIC_EVOLUTION_API_URL?: string
  NEXT_PUBLIC_EVOLUTION_API_TOKEN?: string
}

function getEnvVar(key: keyof EnvVars, required: boolean = false): string | undefined {
  const value = process.env[key]

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export function validateEnv(): EnvVars {
  // Required variables
  const NEXT_PUBLIC_SUPABASE_URL = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', true)!
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', true)!

  // Optional variables
  const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
  const EVOLUTION_API_URL = getEnvVar('EVOLUTION_API_URL')
  const EVOLUTION_API_TOKEN = getEnvVar('EVOLUTION_API_TOKEN')
  const NEXT_PUBLIC_EVOLUTION_API_URL = getEnvVar('NEXT_PUBLIC_EVOLUTION_API_URL')
  const NEXT_PUBLIC_EVOLUTION_API_TOKEN = getEnvVar('NEXT_PUBLIC_EVOLUTION_API_TOKEN')

  return {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY,
    EVOLUTION_API_URL,
    EVOLUTION_API_TOKEN,
    NEXT_PUBLIC_EVOLUTION_API_URL,
    NEXT_PUBLIC_EVOLUTION_API_TOKEN,
  }
}

// Validate on import (only on server-side)
if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Environment validation failed:', error.message)
      console.error('Please check your .env.local file')
    }
  }
}

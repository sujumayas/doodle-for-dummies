// Cliente de Supabase para la aplicación
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar si las variables de entorno están configuradas
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url' || 
    supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('⚠️  Supabase no está configurado. Usando modo de desarrollo sin persistencia.')
}

// Crear cliente solo si las variables están configuradas correctamente
export const supabase = (supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Flag para saber si Supabase está disponible
export const isSupabaseConfigured = !!supabase

// Tipos para las tablas de Supabase
export interface DatabaseTimeSlot {
  id: string
  event_id: string
  date: string
  start_time: string
  end_time: string
  is_booked: boolean
  booked_by_name?: string
  booked_by_email?: string
  booked_at?: string
}

export interface DatabaseScheduleEvent {
  id: string
  title: string
  description?: string
  admin_email: string
  invited_emails: string[]
  is_active: boolean
  created_at: string
}

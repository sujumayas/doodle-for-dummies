// Script de utilidad para probar la conexión con Supabase
// Ejecutar: npx tsx scripts/test-supabase.ts

import { supabase, isSupabaseConfigured } from '../src/lib/supabase'

async function testSupabaseConnection() {
  console.log('🔍 Probando conexión con Supabase...')
  
  if (!isSupabaseConfigured || !supabase) {
    console.warn('⚠️  Supabase no está configurado. Revisa las variables de entorno.')
    return false
  }
  
  try {
    // Probar conexión básica
    const { data, error } = await supabase
      .from('schedule_events')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }
    
    console.log('✅ Conexión exitosa con Supabase')
    console.log(`📊 Eventos en la base de datos: ${data?.length || 0}`)
    return true
    
  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return false
  }
}

async function testCreateEvent() {
  console.log('\n🧪 Probando crear un evento de prueba...')
  
  if (!isSupabaseConfigured) {
    console.warn('⚠️  Saltando prueba de evento (Supabase no configurado)')
    return false
  }
  
  try {
    const { supabaseStore } = await import('../src/lib/unified-store')
    
    const testEvent = await supabaseStore.createEvent({
      title: 'Evento de Prueba',
      description: 'Este es un evento de prueba para validar la configuración',
      adminEmail: 'test@example.com',
      invitedEmails: ['invitado@example.com'],
      timeSlots: [
        {
          date: '2025-06-01',
          startTime: '09:00',
          endTime: '10:00'
        },
        {
          date: '2025-06-01',
          startTime: '10:00',
          endTime: '11:00'
        }
      ]
    })
    
    console.log('✅ Evento de prueba creado:', testEvent.id)
    
    // Limpiar - eliminar el evento de prueba
    await supabaseStore.deleteEvent(testEvent.id)
    console.log('🧹 Evento de prueba eliminado')
    
    return true
    
  } catch (error) {
    console.error('❌ Error creando evento de prueba:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de Supabase\n')
  
  const connectionOk = await testSupabaseConnection()
  
  if (connectionOk) {
    await testCreateEvent()
  }
  
  console.log('\n✅ Pruebas completadas')
}

main().catch(console.error)

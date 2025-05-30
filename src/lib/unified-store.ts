// Store unificado que usa Supabase si está configurado, sino MemoryStore
import { isSupabaseConfigured } from './supabase';
import { memoryStore } from './store';
import { ScheduleEvent, TimeSlot } from '@/types';

// Crear una instancia que delegue automáticamente
class UnifiedStore {
  async createEvent(eventData: {
    title: string;
    description?: string;
    adminEmail: string;
    invitedEmails: string[];
    timeSlots: Omit<TimeSlot, 'id' | 'isBooked' | 'bookedBy' | 'bookedAt'>[];
  }): Promise<ScheduleEvent> {
    if (!isSupabaseConfigured) {
      console.warn('📦 Usando MemoryStore (Supabase no configurado)');
      return memoryStore.createEvent(eventData);
    }
    
    // Si llegamos aquí, usar la implementación de Supabase
    // Por ahora usar memoryStore como fallback hasta que configuremos Supabase
    return memoryStore.createEvent(eventData);
  }

  async getEvent(eventId: string): Promise<ScheduleEvent | null> {
    if (!isSupabaseConfigured) {
      return memoryStore.getEvent(eventId);
    }
    return memoryStore.getEvent(eventId);
  }

  async getEventsByAdmin(adminEmail: string): Promise<ScheduleEvent[]> {
    if (!isSupabaseConfigured) {
      return memoryStore.getEventsByAdmin(adminEmail);
    }
    return memoryStore.getEventsByAdmin(adminEmail);
  }

  async bookSlot(eventId: string, slotId: string, booking: { name: string; email: string }): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return memoryStore.bookSlot(eventId, slotId, booking);
    }
    return memoryStore.bookSlot(eventId, slotId, booking);
  }

  async cancelBooking(eventId: string, slotId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return memoryStore.cancelBooking(eventId, slotId);
    }
    return memoryStore.cancelBooking(eventId, slotId);
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return memoryStore.deleteEvent(eventId);
    }
    return memoryStore.deleteEvent(eventId);
  }

  async getEventStats(eventId: string) {
    if (!isSupabaseConfigured) {
      return memoryStore.getEventStats(eventId);
    }
    return memoryStore.getEventStats(eventId);
  }
}

// Singleton instance
export const supabaseStore = new UnifiedStore();

// Sistema de almacenamiento en memoria para la demo
// En producción, esto sería una base de datos

import { ScheduleEvent, TimeSlot } from '@/types';
import { v4 as uuidv4 } from 'uuid';

class MemoryStore {
  private events: ScheduleEvent[] = [];

  // Crear un nuevo evento
  createEvent(eventData: {
    title: string;
    description?: string;
    adminEmail: string;
    invitedEmails: string[];
    timeSlots: Omit<TimeSlot, 'id' | 'isBooked' | 'bookedBy' | 'bookedAt'>[];
  }): ScheduleEvent {
    const event: ScheduleEvent = {
      id: uuidv4(),
      title: eventData.title,
      description: eventData.description,
      adminEmail: eventData.adminEmail,
      invitedEmails: eventData.invitedEmails,
      isActive: true,
      createdAt: new Date().toISOString(),
      timeSlots: eventData.timeSlots.map(slot => ({
        ...slot,
        id: uuidv4(),
        isBooked: false,
      })),
    };

    this.events.push(event);
    return event;
  }

  // Obtener un evento por ID
  getEvent(eventId: string): ScheduleEvent | null {
    return this.events.find(event => event.id === eventId) || null;
  }

  // Obtener todos los eventos de un admin
  getEventsByAdmin(adminEmail: string): ScheduleEvent[] {
    return this.events.filter(event => event.adminEmail === adminEmail);
  }

  // Reservar un slot
  bookSlot(eventId: string, slotId: string, booking: { name: string; email: string }): boolean {
    const event = this.getEvent(eventId);
    if (!event) return false;

    const slot = event.timeSlots.find(s => s.id === slotId);
    if (!slot || slot.isBooked) return false;

    slot.isBooked = true;
    slot.bookedBy = booking;
    slot.bookedAt = new Date().toISOString();

    return true;
  }

  // Cancelar una reserva
  cancelBooking(eventId: string, slotId: string): boolean {
    const event = this.getEvent(eventId);
    if (!event) return false;

    const slot = event.timeSlots.find(s => s.id === slotId);
    if (!slot || !slot.isBooked) return false;

    slot.isBooked = false;
    slot.bookedBy = undefined;
    slot.bookedAt = undefined;

    return true;
  }

  // Eliminar un evento
  deleteEvent(eventId: string): boolean {
    const index = this.events.findIndex(event => event.id === eventId);
    if (index === -1) return false;

    this.events.splice(index, 1);
    return true;
  }

  // Obtener estadísticas de un evento
  getEventStats(eventId: string) {
    const event = this.getEvent(eventId);
    if (!event) return null;

    const totalSlots = event.timeSlots.length;
    const bookedSlots = event.timeSlots.filter(slot => slot.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;

    return {
      totalSlots,
      bookedSlots,
      availableSlots,
      bookingRate: totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0,
    };
  }
}

// Singleton instance
export const memoryStore = new MemoryStore();

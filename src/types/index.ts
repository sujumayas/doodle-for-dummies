// Tipos para la aplicación de gestión de agenda

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isBooked: boolean;
  bookedBy?: {
    name: string;
    email: string;
  };
  bookedAt?: string; // ISO string
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  timeSlots: TimeSlot[];
  createdAt: string; // ISO string
  adminEmail: string;
  invitedEmails: string[];
  isActive: boolean;
}

export interface BookingRequest {
  slotId: string;
  name: string;
  email: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  adminEmail: string;
  invitedEmails: string[];
  timeSlots: Omit<TimeSlot, 'id' | 'isBooked' | 'bookedBy' | 'bookedAt'>[];
}

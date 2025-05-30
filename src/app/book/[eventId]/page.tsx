'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ScheduleEvent } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function BookingPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<ScheduleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    
    const loadEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
        } else if (response.status === 404) {
          setError('Evento no encontrado');
        } else {
          setError('Error cargando el evento');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setShowBookingForm(true);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !bookingData.name || !bookingData.email) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/book/${selectedSlot}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Horario reservado exitosamente!');
        
        // Actualizar el evento para reflejar la reserva
        if (event) {
          const updatedSlots = event.timeSlots.map(slot => 
            slot.id === selectedSlot 
              ? { 
                  ...slot, 
                  isBooked: true, 
                  bookedBy: bookingData,
                  bookedAt: new Date().toISOString()
                }
              : slot
          );
          setEvent({ ...event, timeSlots: updatedSlots });
        }
        
        setShowBookingForm(false);
        setSelectedSlot(null);
        setBookingData({ name: '', email: '' });
      } else {
        toast.error(data.error || 'Error al reservar el horario');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
          <p className="text-gray-600">Verifica que el enlace sea correcto</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const availableSlots = event.timeSlots.filter(slot => !slot.isBooked);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            {event.description && (
              <p className="text-lg text-gray-600 mb-4">{event.description}</p>
            )}
            <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{availableSlots.length} horarios disponibles</span>
              </div>
            </div>
          </div>
        </div>

        {availableSlots.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Todos los horarios están reservados
            </h3>
            <p className="text-gray-600">
              No hay horarios disponibles en este momento. 
              Contacta al organizador si necesitas más opciones.
            </p>
          </div>
        ) : (
          <>
            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">¿Cómo reservar?</h3>
              <p className="text-blue-800">
                Haz clic en cualquier horario disponible para reservarlo. 
                Solo necesitas ingresar tu nombre y email.
              </p>
            </div>

            {/* Lista de horarios disponibles */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Horarios Disponibles ({availableSlots.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {availableSlots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSlotSelect(slot.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-medium text-gray-900">
                          {format(new Date(slot.date), 'EEEE, dd MMM yyyy', { locale: es })}
                        </div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                      
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Reservar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horarios ya reservados */}
            {event.timeSlots.some(slot => slot.isBooked) && (
              <div className="bg-white rounded-lg shadow-md mt-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Horarios Ya Reservados
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {event.timeSlots
                    .filter(slot => slot.isBooked)
                    .map((slot) => (
                      <div key={slot.id} className="p-6 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-medium text-gray-500">
                              {format(new Date(slot.date), 'EEEE, dd MMM yyyy', { locale: es })}
                            </div>
                            <div className="text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-700 mb-1">
                              Reservado por {slot.bookedBy?.name}
                            </div>
                            {slot.bookedAt && (
                              <div className="text-xs text-gray-500">
                                {format(new Date(slot.bookedAt), 'dd MMM yyyy HH:mm', { locale: es })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal de reserva */}
        {showBookingForm && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Reserva</h3>
                
                {/* Información del horario seleccionado */}
                {(() => {
                  const slot = event.timeSlots.find(s => s.id === selectedSlot);
                  if (!slot) return null;
                  
                  return (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <div className="font-medium text-blue-900">
                        {format(new Date(slot.date), 'EEEE, dd MMM yyyy', { locale: es })}
                      </div>
                      <div className="text-blue-700 flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                  );
                })()}
                
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Tu nombre *
                    </label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Tu email *
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        setSelectedSlot(null);
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !bookingData.name || !bookingData.email}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Reservando...' : 'Confirmar Reserva'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

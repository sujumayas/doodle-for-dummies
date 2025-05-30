'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ScheduleEvent } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Users, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EventPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<ScheduleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const totalSlots = event.timeSlots.length;
  const bookedSlots = event.timeSlots.filter(slot => slot.isBooked).length;
  const availableSlots = totalSlots - bookedSlots;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al panel de admin
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
            {event.description && (
              <p className="text-gray-600 mb-4">{event.description}</p>
            )}
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Creado: {format(new Date(event.createdAt), 'dd MMM yyyy', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{totalSlots} horarios totales</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{bookedSlots} reservados, {availableSlots} disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{event.invitedEmails.length} invitados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalSlots}</div>
            <div className="text-gray-600">Horarios Totales</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{bookedSlots}</div>
            <div className="text-gray-600">Reservados</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{availableSlots}</div>
            <div className="text-gray-600">Disponibles</div>
          </div>
        </div>

        {/* Enlace de reserva */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enlace de Reserva</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={`${window.location.origin}/book/${event.id}`}
              readOnly
              className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
            <button
              onClick={() => {
                const url = `${window.location.origin}/book/${event.id}`;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(url).then(() => {
                    alert('¡Enlace copiado al portapapeles!');
                  }).catch(() => {
                    // Crear un elemento temporal para seleccionar el texto
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Enlace copiado usando método alternativo');
                  });
                } else {
                  alert(`Copia este enlace manualmente:\n${url}`);
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Copiar
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Comparte este enlace con las personas que quieres que reserven horarios
          </p>
        </div>

        {/* Lista de horarios */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Horarios</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {event.timeSlots.map((slot) => (
              <div key={slot.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-medium text-gray-900">
                    {format(new Date(slot.date), 'EEEE, dd MMM yyyy', { locale: es })}
                  </div>
                  <div className="text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {slot.isBooked ? (
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-700">Reservado</div>
                      {slot.bookedBy && (
                        <div className="text-sm text-gray-600">
                          {slot.bookedBy.name} ({slot.bookedBy.email})
                        </div>
                      )}
                      {slot.bookedAt && (
                        <div className="text-xs text-gray-500">
                          {format(new Date(slot.bookedAt), 'dd MMM yyyy HH:mm', { locale: es })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-blue-600">Disponible</div>
                  )}
                  
                  <div className={`w-3 h-3 rounded-full ${
                    slot.isBooked ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de invitados */}
        {event.invitedEmails.length > 0 && (
          <div className="bg-white rounded-lg shadow-md mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Invitados</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {event.invitedEmails.map((email, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {email}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

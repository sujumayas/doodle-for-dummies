'use client';

import { useState } from 'react';
import { Plus, Calendar, Trash2, Users, Clock } from 'lucide-react';
import { ScheduleEvent } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState<string | null>(null);

  // Cargar eventos del admin
  const loadEvents = async (email: string) => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/events?adminEmail=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar evento
  const deleteEvent = async (eventId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Error eliminando evento:', error);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.includes('@')) {
      loadEvents(adminEmail);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona los eventos de agenda y horarios disponibles</p>
        </div>

        {/* Email Input */}
        {!adminEmail && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ingresa tu email</h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="tu-email@ejemplo.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={!adminEmail.includes('@')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Acceder
              </button>
            </form>
          </div>
        )}

        {/* Admin Dashboard */}
        {adminEmail && (
          <>
            {/* Botón crear evento */}
            <div className="mb-8">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Nuevo Evento
              </button>
            </div>

            {/* Lista de eventos */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando eventos...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay eventos</h3>
                <p className="text-gray-600">Crea tu primer evento para empezar a gestionar horarios</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {events.map((event) => {
                  const totalSlots = event.timeSlots.length;
                  const bookedSlots = event.timeSlots.filter(slot => slot.isBooked).length;
                  
                  return (
                    <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                          {event.description && (
                            <p className="text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Eliminar evento"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{totalSlots} horarios disponibles</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{bookedSlots} reservados</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/event/${event.id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors"
                        >
                          Ver Evento
                        </Link>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/book/${event.id}`;
                            // Intentar copiar al clipboard
                            if (navigator.clipboard && window.isSecureContext) {
                              navigator.clipboard.writeText(url).then(() => {
                                alert('¡Enlace copiado al portapapeles!');
                              }).catch(() => {
                                setShowLinkModal(url);
                              });
                            } else {
                              // Fallback: mostrar el modal para copia manual
                              setShowLinkModal(url);
                            }
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                        >
                          Copiar Enlace
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Modal crear evento */}
        {showCreateForm && (
          <CreateEventModal
            adminEmail={adminEmail}
            onClose={() => setShowCreateForm(false)}
            onEventCreated={(newEvent) => {
              setEvents([...events, newEvent]);
              setShowCreateForm(false);
            }}
          />
        )}

        {/* Modal mostrar enlace */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Enlace de Reserva</h3>
                <p className="text-gray-600 mb-4">
                  Comparte este enlace con las personas que quieres que reserven horarios:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg border mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm break-all pr-2">{showLinkModal}</code>
                    <button
                      onClick={() => {
                        // Intentar seleccionar el texto
                        const range = document.createRange();
                        const selection = window.getSelection();
                        const codeElement = document.querySelector('code');
                        if (codeElement) {
                          range.selectNodeContents(codeElement);
                          selection?.removeAllRanges();
                          selection?.addRange(range);
                        }
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Puedes usar Ctrl+C (o Cmd+C en Mac) después de seleccionar el texto para copiarlo.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLinkModal(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(showLinkModal).then(() => {
                          alert('¡Enlace copiado!');
                          setShowLinkModal(null);
                        }).catch(() => {
                          alert('No se pudo copiar automáticamente. Usa Ctrl+C después de seleccionar el texto.');
                        });
                      } else {
                        alert('Selecciona el texto de arriba y usa Ctrl+C para copiarlo.');
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Intentar Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente modal para crear evento
function CreateEventModal({
  adminEmail,
  onClose,
  onEventCreated,
}: {
  adminEmail: string;
  onClose: () => void;
  onEventCreated: (event: ScheduleEvent) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [invitedEmails, setInvitedEmails] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ date: '', startTime: '', endTime: '' }]);
  const [loading, setLoading] = useState(false);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: '', startTime: '', endTime: '' }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: string, value: string) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeSlots(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          adminEmail,
          invitedEmails: invitedEmails.split(',').map(email => email.trim()).filter(Boolean),
          timeSlots: timeSlots.filter(slot => slot.date && slot.startTime && slot.endTime),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onEventCreated(data.event);
      } else {
        alert('Error creando el evento');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creando el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Evento</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del evento *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emails invitados (separados por comas)
              </label>
              <input
                type="text"
                value={invitedEmails}
                onChange={(e) => setInvitedEmails(e.target.value)}
                placeholder="email1@ejemplo.com, email2@ejemplo.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horarios disponibles
              </label>
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex gap-3 mb-3 items-end">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={slot.date}
                      onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {timeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTimeSlot}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Agregar horario
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Evento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

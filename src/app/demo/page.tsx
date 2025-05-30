'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Crear evento de demo
    const createDemoEvent = async () => {
      try {
        const demoData = {
          title: 'Reunión con el Director General - Demo',
          description: 'Reunión para discutir el presupuesto anual y nuevos proyectos. Duración aproximada: 30 minutos.',
          adminEmail: 'secretaria@empresa.com',
          invitedEmails: [
            'juan.perez@empresa.com',
            'maria.lopez@empresa.com',
            'carlos.rodriguez@empresa.com',
            'ana.martinez@empresa.com'
          ],
          timeSlots: [
            {
              date: '2025-05-29',
              startTime: '09:00',
              endTime: '09:30'
            },
            {
              date: '2025-05-29',
              startTime: '10:00',
              endTime: '10:30'
            },
            {
              date: '2025-05-29',
              startTime: '11:00',
              endTime: '11:30'
            },
            {
              date: '2025-05-30',
              startTime: '14:00',
              endTime: '14:30'
            },
            {
              date: '2025-05-30',
              startTime: '15:00',
              endTime: '15:30'
            },
            {
              date: '2025-05-30',
              startTime: '16:00',
              endTime: '16:30'
            }
          ]
        };

        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(demoData),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Simular algunas reservas
          const slotsToBook = [
            { slotIndex: 0, booker: { name: 'Juan Pérez', email: 'juan.perez@empresa.com' } },
            { slotIndex: 2, booker: { name: 'María López', email: 'maria.lopez@empresa.com' } }
          ];

          for (const booking of slotsToBook) {
            const slotId = data.event.timeSlots[booking.slotIndex].id;
            await fetch(`/api/events/${data.event.id}/book/${slotId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(booking.booker),
            });
          }

          // Redirigir a la página del evento demo
          router.push(`/event/${data.event.id}`);
        }
      } catch (error) {
        console.error('Error creando demo:', error);
      }
    };

    createDemoEvent();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Creando Demo...</h2>
        <p className="text-gray-600 mb-6">
          Estamos preparando un evento de ejemplo con datos realistas para que puedas ver cómo funciona la aplicación.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">
          Serás redirigido automáticamente...
        </p>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

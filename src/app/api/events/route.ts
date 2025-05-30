import { NextRequest, NextResponse } from 'next/server';
import { supabaseStore } from '@/lib/unified-store';
import { CreateEventRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateEventRequest = await request.json();
    
    // Validar datos requeridos
    if (!body.title || !body.adminEmail || !body.timeSlots?.length) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (título, email admin, o horarios)' },
        { status: 400 }
      );
    }

    // Crear el evento
    const event = await supabaseStore.createEvent(body);
    
    return NextResponse.json({ 
      success: true, 
      event,
      message: 'Evento creado exitosamente' 
    });
  } catch (error) {
    console.error('Error creando evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminEmail = searchParams.get('adminEmail');
    
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Email del administrador requerido' },
        { status: 400 }
      );
    }

    const events = await supabaseStore.getEventsByAdmin(adminEmail);
    
    return NextResponse.json({ 
      success: true, 
      events 
    });
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

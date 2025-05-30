import { NextRequest, NextResponse } from 'next/server';
import { supabaseStore } from '@/lib/unified-store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  try {
    const { eventId, slotId } = await params;
    const body = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    const success = await supabaseStore.bookSlot(
      eventId,
      slotId,
      { name: body.name, email: body.email }
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo reservar el horario. Puede que ya esté ocupado o no exista.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Horario reservado exitosamente' 
    });
  } catch (error) {
    console.error('Error reservando horario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  try {
    const { eventId, slotId } = await params;
    const success = await supabaseStore.cancelBooking(eventId, slotId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo cancelar la reserva' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reserva cancelada exitosamente' 
    });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

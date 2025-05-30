-- Migración inicial para la aplicación doodle-for-dummies
-- Crea las tablas necesarias para eventos y slots de tiempo

-- Tabla de eventos de programación
CREATE TABLE schedule_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  admin_email TEXT NOT NULL,
  invited_emails TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de slots de tiempo
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES schedule_events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  booked_by_name TEXT,
  booked_by_email TEXT,
  booked_at TIMESTAMP WITH TIME ZONE
);

-- Índices para mejor performance
CREATE INDEX idx_time_slots_event_id ON time_slots(event_id);
CREATE INDEX idx_schedule_events_admin_email ON schedule_events(admin_email);
CREATE INDEX idx_time_slots_date ON time_slots(date);

-- RLS (Row Level Security) policies
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: permitir todas las operaciones por ahora
-- En producción, estas deberían ser más restrictivas
CREATE POLICY "Enable all operations for schedule_events" ON schedule_events
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for time_slots" ON time_slots
  FOR ALL USING (true);

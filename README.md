# Doodle para Principiantes

Una aplicación web simple para gestionar la agenda de tu jefe (o cualquier persona). Permite crear horarios disponibles y compartir enlaces personalizados para que otros puedan reservar citas.

## 🚀 Características

- **Gestión Simple**: Crea y administra horarios disponibles fácilmente
- **Reservas Instantáneas**: Los usuarios reservan en tiempo real sin conflictos
- **Enlaces Personalizados**: Cada evento tiene su propio enlace de reserva
- **Sin Complicaciones**: Interfaz simple y directa, sin funciones innecesarias
- **Responsive**: Funciona en dispositivos móviles y escritorio
- **Base de Datos**: Powered by Supabase para persistencia real

## 📋 Configuración Previa

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a `SQL Editor` y ejecuta el siguiente script:

```sql
-- Ejecutar el contenido de supabase/migrations/001_initial_schema.sql
```

4. Ve a `Settings > API` y copia:
   - Project URL
   - anon/public key

### 2. Variables de Entorno

1. Copia `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Actualiza las variables en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 🛠️ Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <url-del-repo>
cd doodle-for-dummies
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Ejecuta el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🎯 Cómo Usar

### Como Administrador:
1. Ve a `/admin`
2. Ingresa tu email
3. Haz clic en "Crear Nuevo Evento"
4. Completa la información del evento y los horarios disponibles
5. Copia el enlace y compártelo con los invitados

### Como Usuario:
1. Accede al enlace compartido (`/book/[eventId]`)
2. Selecciona un horario disponible
3. Ingresa tu nombre y email
4. ¡Confirma la reserva!

## 🔗 Rutas Principales

- `/` - Página principal
- `/admin` - Panel de administración
- `/event/[eventId]` - Vista detallada del evento (para admins)
- `/book/[eventId]` - Página de reserva (para usuarios)
- `/demo` - Demo con datos de ejemplo

## 📝 API Endpoints

- `POST /api/events` - Crear nuevo evento
- `GET /api/events?adminEmail=...` - Obtener eventos por admin
- `GET /api/events/[eventId]` - Obtener evento específico
- `POST /api/events/[eventId]/book/[slotId]` - Reservar horario
- `DELETE /api/events/[eventId]/book/[slotId]` - Cancelar reserva
- `DELETE /api/events/[eventId]` - Eliminar evento

## 💾 Almacenamiento

Actualmente utiliza almacenamiento en memoria para simplicidad. En producción, deberías integrar:
- Base de datos (PostgreSQL, MongoDB, etc.)
- Sistema de autenticación
- Notificaciones por email
- Persistencia de datos

## 🎨 Personalización

El proyecto está diseñado para ser simple y fácil de personalizar:
- Modifica los colores en `tailwind.config.js`
- Actualiza los tipos en `src/types/index.ts`
- Extiende la funcionalidad en `src/lib/store.ts`

## 🚧 Próximas Mejoras

- [ ] Notificaciones por email
- [ ] Autenticación de usuarios
- [ ] Base de datos persistente
- [ ] Exportar calendario (ICS)
- [ ] Recordatorios automáticos
- [ ] Zona horaria
- [ ] Recurring events

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🚀 Despliegue en Netlify

### Opción 1: Despliegue desde Git

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. El archivo `netlify.toml` ya está configurado
4. Deploy automático al hacer push

### Opción 2: Deploy Manual

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build del proyecto
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

## 🗄️ Estructura de Base de Datos

La aplicación usa Supabase con las siguientes tablas:

- `schedule_events`: Eventos/reuniones
- `time_slots`: Horarios disponibles para cada evento

Ver `supabase/migrations/001_initial_schema.sql` para el schema completo.

---

**Desarrollado con ❤️ para simplificar la gestión de agendas**

#BNg!G&ZS88VrJIk
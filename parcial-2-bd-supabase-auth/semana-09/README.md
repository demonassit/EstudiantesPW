# Semana 9 (19-23 oct) — Programación Web

**Tipo:** Integradora · Práctica oficial 4

**Tema oficial:** cierre de U2·AE2 (CRUD) + Práctica 4 "Desarrollo de páginas dinámicas con BD".

**Objetivo:** migrar/conectar el CRUD de usuarios de BD local al servicio Supabase, y construir la página dinámica (frontend) que lo consume.

**Prerrequisitos:** semana 8.

**Actividad:** recrear el esquema `usuarios` en Supabase (siguiendo el patrón de `schema.sql` del repo semilla); apuntar el backend a Supabase en vez de BD local; construir en el frontend una página de administración de usuarios (listar/crear/editar/eliminar).

**Entregable:** reporte de Práctica 4 + backend conectado a Supabase + página dinámica de usuarios funcionando de punta a punta.

**Material de esta semana (`base/`):**
- `backend-usuarios-supabase/`: desde esta semana el backend tiene 2 modelos y `DB_MOTOR` del `.env` elige cuál usar: `mysql` en local, `supabase` al publicar. `models/motor.js` y `models/usuarios.model.js` ya vienen hechos. Tú renombras tu modelo de la semana 8 a `models/usuarios.model.mysql.js` y escribes `models/usuarios.model.supabase.js` con las mismas funciones. `schema-usuarios-supabase.sql` viene vacío.
- `mini-proyecto-next/`: Copia el contenido de `base/mini-proyecto-next/` encima de tu app (la misma desde la semana 6). `pages/admin/usuarios.js` trae el formulario, la tabla y la fila de edición ya maquetados. Tú escribes `eliminarUsuario` y `guardarEdicion`: las peticiones `DELETE` y `PUT` a tu backend.

---
La rúbrica de esta práctica la tiene tu docente por separado.

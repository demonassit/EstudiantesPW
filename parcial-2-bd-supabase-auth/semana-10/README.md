# Semana 10 (26-30 oct) — Programación Web

**Tipo:** Integradora · **CORTE 2**

**Tema oficial:** inicio de Unidad 3 — Ciberseguridad: introducción, principios, roles.

**Objetivo:** implementar el login usuario/contraseña (sin JWT todavía) sobre el CRUD de usuarios ya migrado a Supabase, como cierre del Corte 2.

**Prerrequisitos:** semana 9.

**Actividad:** endpoint de login que valida usuario/contraseña (hash) contra Supabase y establece una sesión simple (por ejemplo `express-session` o una cookie firmada, sin tokens JWT); proteger la página de administración de usuarios para que solo se vea con sesión activa.

**Entregable (CORTE 2, compartido):** CRUD de usuarios + BD local y Supabase conectadas + login usuario/contraseña sin JWT funcionando, coordinado con el servidor concurrente de Distribuidos y las pruebas de integración de Pruebas de Software.

**Material de esta semana (`base/`):**
- `backend-auth/`: andamiaje vacío del login, el middleware y las rutas.
- `schema-completo-mysql.sql`: todas las tablas del proyecto en tu MySQL local y un administrador semilla (`admin@cecyt9.ipn.mx` / `CambiaEstaClave123`). Córrelo antes de proteger `/api/usuarios`; si no, no tendrás con qué usuario entrar.
- `mini-proyecto-next/`: Copia el contenido de `base/mini-proyecto-next/` encima de tu app (la misma desde la semana 6). Trae `pages/login.js` ya hecha y el menú con «Cerrar sesión». Tú, en tu `pages/admin/usuarios.js`: al cargar, pregunta a `/api/sesion` si hay sesión y, si no, manda a `/login`; y agrega `credentials: 'include'` a todas tus peticiones.

---
La rúbrica de esta práctica la tiene tu docente por separado.

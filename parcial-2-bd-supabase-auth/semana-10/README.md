# Semana 10 (26-30 oct) — Programación Web

**Tipo:** Integradora · **CORTE 2**

**Tema oficial:** inicio de Unidad 3 — Ciberseguridad: introducción, principios, roles.

**Objetivo:** implementar el login usuario/contraseña (sin JWT todavía) sobre el CRUD de usuarios ya migrado a Supabase, como cierre del Corte 2.

**Prerrequisitos:** semana 9.

**Actividad:** endpoint de login que valida usuario/contraseña (hash) contra Supabase y establece una sesión simple (por ejemplo `express-session` o una cookie firmada, sin tokens JWT); proteger la página de administración de usuarios para que solo se vea con sesión activa.

**Entregable (CORTE 2, compartido):** CRUD de usuarios + BD local y Supabase conectadas + login usuario/contraseña sin JWT funcionando, coordinado con el servidor concurrente de Distribuidos y las pruebas de integración de Pruebas de Software.

**Archivos base:** `base/backend-auth/` (middleware/controller/routes de login vacíos) + `base/pagina-login/pages/login.js` (componente vacío).

---
La rúbrica de esta práctica la tiene tu docente por separado.

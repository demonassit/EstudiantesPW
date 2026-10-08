# Semana 14 (23-27 nov) — Programación Web

**Tipo:** Integradora

**Tema oficial:** captcha + dashboard de consultas cruzadas entre tablas.

**Objetivo:** agregar captcha al formulario de login/registro (mitigar fuerza bruta/bots) y construir el dashboard con consultas que cruzan las tablas de cursos, usuarios y bitácora.

**Prerrequisitos:** semana 13.

**Actividad:** integrar un captcha (reCAPTCHA o uno propio simple) en el formulario de login; construir 2-3 vistas de dashboard (ej. "usuarios inscritos por curso", "bitácora de asistencia por usuario") con consultas que combinen tablas.

**Entregable:** login con captcha funcional + dashboard con al menos 2 consultas cruzadas mostradas.

**Material de esta semana (`base/`):**
- `backend-captcha/` y `backend-dashboard/`: andamiaje vacío. En `backend-dashboard/models/`, `dashboard.model.js` ya elige con `DB_MOTOR` (usa tu `motor.js` de la semana 9); tú escribes `dashboard.model.mysql.js` (local, obligatorio) y `dashboard.model.supabase.js` (para publicar).
- `mini-proyecto-next/`: Copia el contenido de `base/mini-proyecto-next/` encima de tu app (la misma desde la semana 6). Trae `pages/login.js` con el captcha ya maquetado y el menú con «Dashboard». `pages/dashboard.js` trae las 2 tablas con sus encabezados; tú escribes `cargar()` (con `fetchConToken` y el 401) y las filas de cada tabla.

---
La rúbrica de esta práctica la tiene tu docente por separado.

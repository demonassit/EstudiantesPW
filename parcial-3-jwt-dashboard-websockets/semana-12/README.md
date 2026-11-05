# Semana 12 (9-13 nov) — Programación Web

**Tipo:** Individual

**Tema oficial:** gestión de riesgos, controles y frameworks de ciberseguridad.

**Objetivo:** hacer un análisis de riesgos del propio sistema CECyT9 — identificar qué riesgos tiene el login actual sin JWT — como paso previo a implementarlo.

**Prerrequisitos:** semana 11.

**Actividad:** taller de análisis de riesgos: listar amenazas (fuerza bruta, secuestro de sesión, XSS) sobre el login actual, y proponer controles (JWT con expiración, captcha, límite de intentos).

**Demo guiada en clase (antes del taller):** [¿Cómo funciona una sesión?](demo-sesiones/GUIA-DEMO-SESIONES.md) (también en .docx): trabajas en `demo-sesiones/base/` (frontend, conexión a MySQL y la base de datos completa, con las tablas `usuarios` y `sessions`); con tu docente programas, paso por paso, la parte de sesiones del backend y vas viendo el `Set-Cookie`, 401 contra 403, la expiración y las opciones de la cookie, y cómo se secuestra o se fija una sesión. Lo que observes lo usas en tu matriz de riesgos.

**Entregable:** matriz de riesgos (amenaza / probabilidad / impacto / control propuesto) del login actual.

---
La rúbrica de esta práctica la tiene tu docente por separado.

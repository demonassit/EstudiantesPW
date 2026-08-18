# Semana 13 (16-20 nov) (*) — Programación Web

**Tipo:** Integradora

**Tema oficial:** implementación de JWT (validaciones, manejo de sesión).

**Objetivo:** reemplazar la sesión simple del Parcial 2 por autenticación JWT (token con expiración, verificación en middleware).

**Prerrequisitos:** semanas 11-12; login usuario/contraseña del Parcial 2.

**Actividad:** emitir un JWT al hacer login exitoso; proteger las rutas del CRUD de usuarios con un middleware que verifique el token; manejar expiración y renovación básica.

**Entregable:** login emite JWT + middleware de verificación protegiendo el CRUD + pruebas manuales de acceso con/sin token válido.

**Archivos base:** `base/backend-jwt/` (middleware/controller/routes de JWT vacíos, extiende el login de la semana 10). El frontend con JWT se agrega hasta tener el backend listo (ver solución docente para el patrón).

---
La rúbrica de esta práctica la tiene tu docente por separado.

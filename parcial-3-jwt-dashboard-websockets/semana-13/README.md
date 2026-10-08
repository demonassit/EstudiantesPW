# Semana 13 (16-20 nov) (*) — Programación Web

**Tipo:** Integradora

**Tema oficial:** implementación de JWT (validaciones, manejo de sesión).

**Objetivo:** reemplazar la sesión simple del Parcial 2 por autenticación JWT (token con expiración, verificación en middleware).

**Prerrequisitos:** semanas 11-12; login usuario/contraseña del Parcial 2.

**Actividad:** emitir un JWT al hacer login exitoso; proteger las rutas del CRUD de usuarios con un middleware que verifique el token; manejar expiración y renovación básica.

**Entregable:** login emite JWT + middleware de verificación protegiendo el CRUD + pruebas manuales de acceso con/sin token válido.

**Material de esta semana (`base/`):**
- `backend-jwt/`: andamiaje vacío del login con JWT, el middleware y las rutas.
- `mini-proyecto-next/`: Copia el contenido de `base/mini-proyecto-next/` encima de tu app (la misma desde la semana 6). Trae `pages/login.js` que ya guarda el token, `lib/fetchConToken.js` y el menú. Tú, en tu `pages/admin/usuarios.js`: cambia tus `fetch` por `fetchConToken` (sin `credentials`) y, si la respuesta es 401, manda a `/login`.

---
La rúbrica de esta práctica la tiene tu docente por separado.

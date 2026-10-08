# Semana 8 (12-16 oct) — Programación Web

**Tipo:** Integradora

**Tema oficial:** U2·AE2 CRUD en base de datos relacional (BD local).

**Objetivo:** construir el CRUD completo de usuarios (Create/Read/Update/Delete) sobre una base de datos relacional local, aplicando ya el MVC aprendido, extendiendo el backend real del proyecto (`ProyectoBackCecyt9`).

**Prerrequisitos:** semanas 6-7.

**Actividad:** diseñar la tabla `usuarios` (id, nombre, correo, contraseña_hash, boleta, rol) en BD local (PostgreSQL/MySQL); implementar los 4 endpoints CRUD en el backend real.

**Entregable:** backend con CRUD de usuarios funcionando contra BD local + peticiones de prueba documentadas (Thunder Client/Postman básico).

**Material de esta semana (`base/`):**
- `backend-usuarios/`: andamiaje vacío para MySQL (`db-local.js` con `mysql2`, modelo, controlador, rutas y `schema-usuarios.sql`) y `.env.example` con las variables de conexión. Instala `npm install mysql2 bcryptjs`.
- Además de los 4 endpoints, **tu backend debe rechazar datos inválidos** con un 400 aunque la petición no venga del front: correo sin formato válido, boleta que no tenga 10 dígitos o contraseña de menos de 8 caracteres. Usa las mismas reglas que `lib/validaciones.js` de tu front.
- `mini-proyecto-next/`: Copia el contenido de `base/mini-proyecto-next/` encima de tu app (la misma desde la semana 6). Trae `pages/admin/usuarios.js` ya hecha (alta y lista, con validaciones). Sirve para probar tu CRUD desde el navegador, además de Postman.

---
La rúbrica de esta práctica la tiene tu docente por separado.

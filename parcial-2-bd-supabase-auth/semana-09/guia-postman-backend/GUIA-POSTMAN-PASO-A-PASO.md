# Semana 9 — Prueba tu backend con Postman, paso a paso

**Programación Web · 19 al 23 de octubre · trabajo individual**

En la semana 8 programaste en tu backend de Express el CRUD de usuarios y lo uniste a las rutas de talleres y
asistencias del proyecto. Con esta guía vas a comprobar con **Postman**, petición por petición, que
**tu backend sí responde y sí guarda en tu base de datos**. No necesitas el front: Postman habla directo con
el backend, igual que lo haría tu página.

**Lo que vas a probar**

| Parte | Peticiones | Qué demuestras |
|---|---|---|
| Prueba de vida | `GET /` | Que tu servidor está encendido y escuchando |
| Talleres | `GET /api/talleres`, `GET /api/talleres/:id`, `POST /api/talleres` | Que lees y guardas talleres |
| Asistencias | `POST /api/asistencias`, `GET /api/talleres/:id/asistencias` | Que registras alumnos en un taller |
| Usuarios (CRUD) | `GET`, `POST`, `PUT` y `DELETE` en `/api/usuarios` | Que las 4 operaciones del CRUD funcionan |
| Errores | Las mismas rutas con datos malos | Que tu backend rechaza lo inválido (400, 404, 409) |

## Lo que vas a aprender

1. Identificar las partes de una petición HTTP: **método**, **URL**, **cuerpo (body)** y **código de estado**.
2. Mandar peticiones `GET`, `POST`, `PUT` y `DELETE` desde Postman sin escribir código.
3. Mandar datos en **JSON** en el cuerpo de una petición.
4. Leer el código de respuesta (200, 201, 204, 400, 404, 409, 500) y saber qué significa cada uno.
5. Guardar tus peticiones en una **colección** con una **variable** para no repetir la dirección del servidor.

## Cómo organizar tu tiempo

| Cuándo | Pasos | Tiempo aproximado |
|---|---|---|
| Clase 1 (1 h, aula) | 0, 1, 2 y 3 | 60 min |
| Clase 2 (2 h, laboratorio) | 4, 5, 6 y 7 | 120 min |

**Cómo usar esta guía**

- Haz las peticiones **en el orden de la guía**: algunas usan datos que creaste en la anterior.
- En cada petición la guía te dice qué escribir y **qué debe responder** tu backend. Anota lo que obtuviste
  en la tabla del [paso 7](#paso-7--reporte-y-entrega).
- Al final de cada paso hay una lista **Comprueba**. No pases al siguiente hasta que todo esté marcado.
- Si algo falla, revisa primero [Problemas comunes](#problemas-comunes).

---

## Paso 0 — Encender tu backend (10 min)

Postman no puede probar un backend apagado. Antes de abrirlo:

1. Verifica que **MySQL esté encendido** (en el laboratorio, el servicio `MySQL80` o tu XAMPP/Workbench).
2. Abre una terminal en la carpeta de **tu backend** (la que trabajaste en la semana 8, donde está tu
   `server.js` y tu `.env`) y arráncalo:

   ```bash
   npm start
   ```

   Debe decir algo como `Servidor escuchando en el puerto 3001`. **Deja esa terminal abierta todo el tiempo**:
   ahí verás los errores si algo falla.

3. Abre en el navegador http://localhost:3001. Debe aparecer un mensaje como:

   ```json
   { "mensaje": "API de Registro de Asistencia - CECyT 9 funcionando correctamente" }
   ```

   Si tu backend usa otro puerto (míralo en tu `.env`, variable `PORT`), usa ese número en toda la guía en
   lugar de `3001`.

**¿Tu backend no arranca?** Primero revisa [Problemas comunes](#problemas-comunes). Si aun así no arranca,
usa el backend de práctica de esta misma semana para aprender Postman y después repite la guía con el tuyo:

```bash
cd semana-09/actividad-autonoma-front/backend-memoria
npm install
npm start
```

Tiene las mismas rutas que el tuyo, pero los datos viven en memoria (vuelven a los de ejemplo cada vez que lo
reinicias). En la guía, donde diga **Con backend-memoria**, verás los datos exactos que te va a responder.

**Comprueba**

- [ ] La terminal de tu backend dice `Servidor escuchando en el puerto ...` y sigue abierta.
- [ ] http://localhost:3001 muestra el mensaje en el navegador.

---

## Paso 1 — Conocer Postman y crear tu colección (15 min)

1. Abre **Postman de escritorio** (la aplicación instalada, no la página web: la versión web no puede
   llegar a `localhost` de tu computadora). Si te pide iniciar sesión puedes crear una cuenta gratis o
   seguir sin cuenta si te da esa opción.

2. Ubica las partes de la pantalla. Las vas a usar en cada petición:

   | Parte | Dónde está | Para qué sirve |
   |---|---|---|
   | **Barra lateral** | Izquierda, sección *Collections* | Guarda tus peticiones organizadas |
   | **Método** | Lista desplegable a la izquierda de la URL (dice `GET`) | Elige `GET`, `POST`, `PUT` o `DELETE` |
   | **URL** | Caja de texto junto al método | La dirección de la ruta de tu backend |
   | **Send** | Botón azul a la derecha de la URL | Manda la petición |
   | Pestañas **Params / Headers / Body** | Debajo de la URL | En **Body** escribes los datos que mandas |
   | **Respuesta** | Mitad de abajo | Lo que contestó tu backend |
   | **Status** | Arriba a la derecha de la respuesta (ej. `200 OK`) | El código de estado de la respuesta |

3. **Crea una colección.** Una colección es una carpeta donde se guardan tus peticiones.
   En la barra lateral, en *Collections*, da clic en **+** (o en *New → Collection*) y nómbrala
   `CECyT9 - Mi backend - <tu nombre>`.

4. **Crea la variable `baseUrl`.** Así no escribes `http://localhost:3001` en cada petición, y si mañana
   cambia el puerto lo corriges en un solo lugar.
   - Da clic en el nombre de tu colección → pestaña **Variables**.
   - En la primera fila escribe: *Variable* = `baseUrl`, *Initial value* y *Current value* = `http://localhost:3001`
     (sin `/` al final).
   - Guarda con **Ctrl+S**.

   Desde ahora, en la URL escribes `{{baseUrl}}` y Postman lo cambia por `http://localhost:3001`. Si lo escribes
   bien, `{{baseUrl}}` se pone de color; si se ve en rojo, la variable está mal escrita o no guardaste.

5. **Crea 3 carpetas** dentro de la colección (clic derecho o `...` sobre la colección → *Add folder*):
   `Talleres`, `Asistencias` y `Usuarios`.

**Comprueba**

- [ ] Tienes la colección con la variable `baseUrl` guardada y las carpetas `Talleres`, `Asistencias` y `Usuarios`.

---

## Paso 2 — Tu primera petición: la prueba de vida (10 min)

1. Sobre tu colección: `...` → **Add request**. Nómbrala `Prueba de vida`.
2. Deja el método en **GET** y en la URL escribe:

   ```
   {{baseUrl}}/
   ```

3. Da clic en **Send**.

**Debe responder**

- Status: **`200 OK`**
- Body:

  ```json
  { "mensaje": "API de Registro de Asistencia - CECyT 9 funcionando correctamente" }
  ```

Fíjate también en el **tiempo** (`Time`, en milisegundos) y el tamaño (`Size`) junto al status: es lo que tardó
tu backend en contestar.

4. Guarda la petición con **Ctrl+S**. Haz esto con **cada** petición de la guía: así al final tienes toda tu
   colección lista para entregarla.

**¿Qué acaba de pasar?** Postman hizo lo mismo que el navegador en el paso 0: mandó una petición `GET` a la
ruta `/`. Tu `server.js` tiene un `app.get('/', ...)` que respondió con `res.json(...)`. El código `200` quiere
decir "todo bien".

**Comprueba**

- [ ] `Prueba de vida` responde `200 OK` con el mensaje.
- [ ] Si apagas tu backend (Ctrl+C en su terminal) y das Send, Postman muestra *Could not send request* /
      `ECONNREFUSED`. Vuélvelo a encender con `npm start` antes de seguir.

---

## Paso 3 — Talleres: leer y crear (25 min)

Crea cada petición **dentro de la carpeta `Talleres`** (`...` sobre la carpeta → *Add request*).

### 3.1 Listar talleres

| | |
|---|---|
| Nombre | `Listar talleres` |
| Método | `GET` |
| URL | `{{baseUrl}}/api/talleres` |

**Debe responder:** `200 OK` y un **arreglo** (empieza con `[`) con los talleres de tu base de datos. Cada
taller trae `id`, `nombre`, `instructor`, `fecha` y `cupo`. Si tu tabla está vacía responde `[]`, que también
es correcto.

> **Con backend-memoria:** 5 talleres, de "Introducción a Python" a "Next.js desde cero".

**Copia el `id` de un taller** (todo lo que va entre comillas, por ejemplo
`a1000000-0000-4000-8000-000000000004`). Lo vas a usar en las siguientes peticiones. Para no perderlo,
guárdalo en otra variable de la colección: pestaña **Variables** → nueva fila `tallerId` con ese valor → Ctrl+S.

### 3.2 Ver un taller

| | |
|---|---|
| Nombre | `Ver un taller` |
| Método | `GET` |
| URL | `{{baseUrl}}/api/talleres/{{tallerId}}` |

**Debe responder:** `200 OK` y **un objeto** (empieza con `{`) con los datos de ese taller y un campo extra,
`asistentes`, con cuántos alumnos tiene registrados.

> **Con backend-memoria** y el taller `...0004`: "Git y GitHub en equipo", `"cupo": 3`, `"asistentes": 2`.

### 3.3 Ver un taller que no existe

Duplica la petición anterior (clic derecho → *Duplicate*), nómbrala `Ver un taller que no existe` y cambia la
URL a:

```
{{baseUrl}}/api/talleres/00000000-0000-0000-0000-000000000000
```

**Debe responder:** `404 Not Found` con `{ "error": "Taller no encontrado" }`.

Esto demuestra que tu controlador **revisa** si el modelo encontró algo antes de contestar. Si te responde `200`
con un body vacío, tu controlador no tiene el `if (!taller) return res.status(404)...`.

### 3.4 Crear un taller

| | |
|---|---|
| Nombre | `Crear taller` |
| Método | `POST` |
| URL | `{{baseUrl}}/api/talleres` |

Ahora sí vas a **mandar datos**. En la pestaña **Body**:

1. Elige **raw**.
2. En la lista desplegable de la derecha (dice `Text`), elige **JSON**. Este paso es el que más se olvida:
   si se queda en `Text`, tu backend no entiende los datos.
3. Escribe:

   ```json
   {
     "nombre": "Taller de Postman",
     "instructor": "Ing. Tu Nombre",
     "fecha": "2026-11-20",
     "cupo": 15
   }
   ```

Da **Send**.

**Debe responder:** `201 Created` y el taller recién creado, ya con su `id` (lo puso tu base de datos).

`201` es distinto de `200`: significa "se **creó** algo nuevo". Lo decide tu controlador con
`res.status(201).json(...)`.

Ahora vuelve a **Listar talleres** y da Send: tu taller nuevo debe aparecer. **Esa es la prueba de que tu
backend está conectado a la base de datos**: lo que mandaste quedó guardado. Si quieres verlo con tus propios
ojos, búscalo en MySQL Workbench con `SELECT * FROM talleres;`.

### 3.5 Crear un taller sin datos obligatorios

Duplica `Crear taller`, nómbrala `Crear taller sin nombre` y cambia el Body a:

```json
{
  "instructor": "Ing. Sin Nombre"
}
```

**Debe responder:** `400 Bad Request` con `{ "error": "nombre y fecha son obligatorios" }`.

`400` quiere decir "el cliente mandó algo mal". Tu backend no debe guardar nada: compruébalo con
**Listar talleres** (no aparece ningún taller nuevo).

**Comprueba**

- [ ] Listar talleres → `200` con un arreglo.
- [ ] Ver un taller → `200` con `asistentes`; uno que no existe → `404`.
- [ ] Crear taller → `201` y aparece en la lista.
- [ ] Crear taller sin nombre → `400` y **no** aparece en la lista.

---

## Paso 4 — Asistencias: registrar alumnos en un taller (20 min)

Crea estas peticiones en la carpeta `Asistencias`.

### 4.1 Registrar una asistencia

| | |
|---|---|
| Nombre | `Registrar asistencia` |
| Método | `POST` |
| URL | `{{baseUrl}}/api/asistencias` |
| Body (raw · JSON) | ver abajo |

Usa el `id` de un taller real (puedes escribir `{{tallerId}}` dentro del JSON, entre comillas):

```json
{
  "taller_id": "{{tallerId}}",
  "nombre_alumno": "Tu Nombre Completo",
  "boleta": "2026090099"
}
```

**Debe responder:** `201 Created` con la asistencia creada: su propio `id`, el `taller_id`, el nombre, la
boleta y la `fecha_registro`.

### 4.2 Ver las asistencias de un taller

| | |
|---|---|
| Nombre | `Asistencias de un taller` |
| Método | `GET` |
| URL | `{{baseUrl}}/api/talleres/{{tallerId}}/asistencias` |

**Debe responder:** `200 OK` y un arreglo donde **aparece tu nombre**.

Vuelve a mandar **Ver un taller** (carpeta Talleres): el número de `asistentes` subió en 1.

> **Con backend-memoria** y el taller `...0004`: antes eran 2 (Ana y Luis); ahora son 3.

### 4.3 Registrar una asistencia incompleta

Duplica `Registrar asistencia`, nómbrala `Registrar asistencia incompleta` y deja solo:

```json
{
  "nombre_alumno": "Tu Nombre Completo"
}
```

**Debe responder:** `400 Bad Request` con `{ "error": "taller_id, nombre_alumno y boleta son obligatorios" }`.

### 4.4 Registrar en un taller que no existe (para observar)

Duplica `Registrar asistencia` y cambia el `taller_id` por `"00000000-0000-0000-0000-000000000000"`.

**Responde:** `500 Internal Server Error`. Tu base de datos rechazó el registro porque la **llave foránea**
(`FOREIGN KEY (taller_id) REFERENCES talleres(id)`) no encontró ese taller. El dato no se guardó, que es lo
correcto, pero `500` significa "falló el servidor" y en realidad el error fue del cliente. Lo anotarás en la
pregunta 3 del reporte.

**Comprueba**

- [ ] Registrar asistencia → `201` y tu nombre aparece en *Asistencias de un taller*.
- [ ] `asistentes` del taller subió en 1.
- [ ] Asistencia incompleta → `400`. Taller inexistente → `500` (observado).

---

## Paso 5 — Usuarios: el CRUD de la semana 8 (40 min)

Esta es la parte que programaste tú en la semana 8. Crea las peticiones en la carpeta `Usuarios`.

### 5.1 Listar usuarios (Read)

| | |
|---|---|
| Nombre | `Listar usuarios` |
| Método | `GET` |
| URL | `{{baseUrl}}/api/usuarios` |

**Debe responder:** `200 OK` y un arreglo de usuarios con `id`, `nombre`, `correo`, `boleta` y `rol`.

**Revisa con cuidado:** ningún usuario debe traer `contrasena_hash` (ni `contrasena`). Si aparece, tu modelo
está haciendo `SELECT *`: cámbialo para que elija solo las columnas públicas. Una contraseña, aunque esté
cifrada, nunca debe salir del backend.

> **Con backend-memoria:** 4 usuarios: Admin Semilla (`id` 1), Ana López, Luis Pérez y María Hernández.

### 5.2 Crear un usuario (Create)

| | |
|---|---|
| Nombre | `Crear usuario` |
| Método | `POST` |
| URL | `{{baseUrl}}/api/usuarios` |
| Body (raw · JSON) | ver abajo |

Usa **tus** datos, pero con una boleta y un correo que **no** existan todavía:

```json
{
  "nombre": "Tu Nombre Completo",
  "correo": "tu.nombre@alumno.ipn.mx",
  "contrasena": "Segura2026",
  "boleta": "2026090099"
}
```

**Debe responder:** `201 Created` con tu usuario y su `id` nuevo, con `"rol": "alumno"` (el rol por defecto),
**sin** la contraseña.

**Guarda el `id`** que te dio en una variable de la colección llamada `usuarioId` (como hiciste con
`tallerId`). Las siguientes peticiones la usan.

En MySQL Workbench, `SELECT * FROM usuarios;` muestra tu usuario con `contrasena_hash` empezando con `$2a$` o
`$2b$`: es el hash de bcrypt. **Nunca** debe verse `Segura2026` tal cual.

### 5.3 Ver un usuario (Read de uno)

| | |
|---|---|
| Nombre | `Ver un usuario` |
| Método | `GET` |
| URL | `{{baseUrl}}/api/usuarios/{{usuarioId}}` |

**Debe responder:** `200 OK` con tu usuario.

Duplica la petición, nómbrala `Ver un usuario que no existe` y usa la URL `{{baseUrl}}/api/usuarios/99999`.
**Debe responder:** `404 Not Found` con `{ "error": "Usuario no encontrado" }`.

### 5.4 Crear un usuario repetido

Duplica **Crear usuario**, nómbrala `Crear usuario repetido` y da **Send** sin cambiar nada del Body (el mismo
correo y la misma boleta que ya guardaste).

**Debe responder:** `409 Conflict` con `{ "error": "Ya existe un usuario con ese correo o boleta" }`.

`409` significa "eso ya existe". Si tu backend responde `500`, el `UNIQUE` de la tabla sí funcionó (no se
guardó repetido), pero tu controlador no está atrapando ese error para convertirlo en `409`.

### 5.5 Validaciones: datos inválidos

Tu backend debe rechazar datos inválidos **aunque no vengan del front**. Postman se salta tu página y sus
validaciones, así que esta es la prueba real. Duplica `Crear usuario` 4 veces y cambia el Body como dice la
tabla (lo demás del Body se queda igual).

| Nombre de la petición | Qué cambias en el Body | Debe responder |
|---|---|---|
| `Usuario con correo inválido` | `"correo": "correo-sin-arroba"` | `400` · `El correo no tiene un formato válido` |
| `Usuario con boleta corta` | `"boleta": "123"` | `400` · `La boleta debe tener 10 dígitos` |
| `Usuario con contraseña corta` | `"contrasena": "corta"` | `400` · `La contraseña debe tener al menos 8 caracteres` |
| `Usuario sin datos` | Body solo con `{ "nombre": "X" }` | `400` · `nombre, correo, contrasena y boleta son obligatorios` |

Después de las 4, manda **Listar usuarios**: no se agregó ninguno.

### 5.6 Actualizar un usuario (Update)

| | |
|---|---|
| Nombre | `Actualizar usuario` |
| Método | `PUT` |
| URL | `{{baseUrl}}/api/usuarios/{{usuarioId}}` |
| Body (raw · JSON) | `{ "rol": "docente" }` |

**Debe responder:** `200 OK` con tu usuario y `"rol": "docente"`.

**Revisa que tu nombre y tu correo sigan iguales.** Solo mandaste el rol, así que solo el rol debe cambiar.
Si tu nombre o correo quedaron en `null`, tu modelo actualiza todas las columnas aunque no vengan en la
petición.

Ahora prueba los casos de error (duplica `Actualizar usuario` para cada uno):

| Nombre de la petición | URL | Body | Debe responder |
|---|---|---|---|
| `Actualizar sin datos` | `.../usuarios/{{usuarioId}}` | `{}` | `400` · `Envía al menos uno de: nombre, correo, rol` |
| `Actualizar con correo repetido` | `.../usuarios/{{usuarioId}}` | el `correo` de **otro** usuario de tu lista | `409` · `Ya existe un usuario con ese correo` |
| `Actualizar usuario que no existe` | `.../usuarios/99999` | `{ "rol": "docente" }` | `404` · `Usuario no encontrado` |

### 5.7 Eliminar un usuario (Delete)

| | |
|---|---|
| Nombre | `Eliminar usuario` |
| Método | `DELETE` |
| URL | `{{baseUrl}}/api/usuarios/{{usuarioId}}` |
| Body | ninguno |

**Debe responder:** `204 No Content` y el body **vacío**. `204` significa "listo, y no hay nada que mostrarte".

Da **Send** otra vez a la misma petición: ahora responde `404` (ya no existe). Y **Ver un usuario** también
responde `404`.

**Comprueba**

- [ ] Listar usuarios → `200` y **sin** `contrasena_hash`.
- [ ] Crear → `201`; repetido → `409`; las 4 validaciones → `400` y no se guardaron.
- [ ] Ver uno → `200`; inexistente → `404`.
- [ ] Actualizar solo el rol → `200` y el nombre/correo **no** cambiaron; sin datos → `400`; correo repetido → `409`; inexistente → `404`.
- [ ] Eliminar → `204`; eliminar otra vez → `404`.

---

## Paso 6 — Repasar y exportar tu colección (10 min)

1. Revisa que tu colección tenga todas las peticiones guardadas y en su carpeta (en total son 24: 1 de
   prueba de vida, 5 de talleres, 4 de asistencias y 14 de usuarios). Si alguna dice *Untitled Request* o
   tiene un punto junto al nombre, no la guardaste: ábrela y presiona Ctrl+S.
2. **Prueba la colección completa en orden**: abre tus peticiones una por una, de arriba abajo, y dale Send.
   Antes, como borraste tu usuario en el 5.7, cambia la boleta y el correo de **Crear usuario** y de
   **Crear usuario repetido** por unos nuevos (los mismos en las dos) y, después de mandar *Crear usuario*,
   actualiza `usuarioId` con el nuevo `id`.
3. **Exporta la colección:** `...` sobre la colección → **Export** → formato **Collection v2.1** → guarda el
   archivo como `coleccion-<tu-boleta>.json`.

**Comprueba**

- [ ] Tienes el archivo `.json` exportado de tu colección.

---

## Paso 7 — Reporte y entrega

Entrega en Teams:

1. El archivo `coleccion-<tu-boleta>.json`.
2. Un documento (Word o PDF) con:

   **a) Tabla de resultados.** Copia esta tabla y llena la columna *Obtuve* con el código que te dio **tu**
   backend. Si alguno no coincide con el esperado, escribe en *Observaciones* qué crees que falta en tu código.

   | # | Petición | Esperado | Obtuve | Observaciones |
   |---|---|---|---|---|
   | 1 | GET `/` | 200 | | |
   | 2 | GET `/api/talleres` | 200 | | |
   | 3 | GET `/api/talleres/:id` | 200 | | |
   | 4 | GET `/api/talleres/:id` inexistente | 404 | | |
   | 5 | POST `/api/talleres` | 201 | | |
   | 6 | POST `/api/talleres` sin nombre | 400 | | |
   | 7 | POST `/api/asistencias` | 201 | | |
   | 8 | GET `/api/talleres/:id/asistencias` | 200 | | |
   | 9 | POST `/api/asistencias` incompleta | 400 | | |
   | 10 | POST `/api/asistencias` taller inexistente | 500 | | |
   | 11 | GET `/api/usuarios` | 200 | | |
   | 12 | POST `/api/usuarios` | 201 | | |
   | 13 | GET `/api/usuarios/:id` | 200 | | |
   | 14 | GET `/api/usuarios/:id` inexistente | 404 | | |
   | 15 | POST `/api/usuarios` repetido | 409 | | |
   | 16 | POST `/api/usuarios` correo inválido | 400 | | |
   | 17 | POST `/api/usuarios` boleta corta | 400 | | |
   | 18 | POST `/api/usuarios` contraseña corta | 400 | | |
   | 19 | POST `/api/usuarios` sin datos | 400 | | |
   | 20 | PUT `/api/usuarios/:id` solo rol | 200 | | |
   | 21 | PUT `/api/usuarios/:id` sin datos | 400 | | |
   | 22 | PUT `/api/usuarios/:id` correo repetido | 409 | | |
   | 23 | PUT `/api/usuarios/:id` inexistente | 404 | | |
   | 24 | DELETE `/api/usuarios/:id` | 204 | | |

   **b) 4 capturas de Postman** donde se vea la URL, el Body y el Status:
   - *Crear taller* con `201`.
   - *Listar talleres* donde aparece tu taller nuevo.
   - *Crear usuario* con `201` (sin la contraseña en la respuesta).
   - *Usuario con boleta corta* con `400`.

   **c) Responde en 2 o 3 líneas cada una:**
   1. ¿Qué diferencia hay entre los códigos `200`, `201` y `204`? ¿En qué petición te salió cada uno?
   2. Tu página del front ya valida la boleta antes de enviar. ¿Por qué el backend la tiene que validar otra vez?
      (Pista: ¿pasó por tu página la petición del 5.5?)
   3. En el 4.4 el backend respondió `500`. ¿Fue culpa del servidor o del cliente? ¿Qué código sería más
      correcto y qué tendrías que agregar en el controlador para devolverlo?
   4. ¿Cómo demostraste con Postman que tu backend **sí está conectado a la base de datos** y no solo
      responde mensajes fijos?

---

## Los códigos de estado que vas a ver

| Código | Nombre | Significa | En esta guía |
|---|---|---|---|
| `200` | OK | Todo bien, aquí están los datos | Listar, ver uno, actualizar |
| `201` | Created | Se creó algo nuevo | POST de taller, asistencia y usuario |
| `204` | No Content | Hecho, sin nada que mostrar | DELETE |
| `400` | Bad Request | Mandaste datos incompletos o inválidos | Validaciones |
| `404` | Not Found | No existe ese registro (o esa ruta) | Taller o usuario inexistente |
| `409` | Conflict | Choca con algo que ya existe | Correo o boleta repetidos |
| `500` | Internal Server Error | Algo falló dentro del servidor | Taller inexistente en asistencias; errores de BD |

Regla rápida: los **2xx** son éxito, los **4xx** son errores del cliente (de quien manda la petición) y los
**5xx** son errores del servidor.

---

## Problemas comunes

| Lo que ves | Por qué pasa | Qué hacer |
|---|---|---|
| *Could not send request* / `ECONNREFUSED` | Tu backend está apagado o en otro puerto | Revisa la terminal del backend; arráncalo con `npm start`; revisa `PORT` en tu `.env` y `baseUrl` |
| La URL se ve con `{{baseUrl}}` en rojo | La variable no existe o no la guardaste | Colección → Variables → revisa el nombre exacto y presiona Ctrl+S |
| Usas Postman en el navegador y nada llega | La versión web no puede entrar a `localhost` | Usa la aplicación de escritorio |
| `400 ... son obligatorios` aunque sí mandaste los datos | El Body está en `Text` en lugar de `JSON` | Body → raw → cambia `Text` por `JSON` |
| Respuesta en HTML con `SyntaxError ... in JSON` | El JSON está mal escrito (coma de más, comillas simples, falta `}`) | Usa comillas dobles en todo y sin coma después del último campo |
| Respuesta en HTML con `Cannot GET /api/...` (404) | La ruta no existe: URL mal escrita o la ruta no está montada | Compara la URL letra por letra con tu `routes/*.js` y revisa que `server.js` tenga el `app.use(...)` de esas rutas |
| `500` con `ER_ACCESS_DENIED_ERROR` o `ECONNREFUSED ...:3306` | Tu backend no pudo entrar a MySQL | Revisa que MySQL esté encendido y los datos `DB_...` de tu `.env` |
| `500` con `ER_BAD_DB_ERROR` o `ER_NO_SUCH_TABLE` | No existe la base de datos o la tabla | Corre tu `schema-usuarios.sql` (y el de talleres) en MySQL |
| `500` al crear un usuario repetido | Falta convertir el error de duplicado en `409` | En el `catch` de `crearUsuario`, si `error.code === 'ER_DUP_ENTRY'` responde `409` |
| La `fecha` sale como `2026-11-20T06:00:00.000Z` | Así convierte MySQL las fechas a texto si no configuraste `dateStrings` | No es un error para esta guía; anótalo en Observaciones |
| El `PUT` dejó el nombre o el correo en `null` | Tu `UPDATE` cambia todas las columnas | Actualiza solo los campos que vienen en `req.body` |

---

## Cómo se evalúa

Tu docente revisa tu colección y tu reporte con estos criterios:

- La colección tiene las 24 peticiones guardadas en sus carpetas y usa `{{baseUrl}}`.
- Tu backend responde los códigos esperados de talleres, asistencias y usuarios (lo que no coincida debe
  estar explicado en *Observaciones*).
- Las 4 capturas muestran URL, Body y Status.
- Las 4 respuestas del reporte tienen sentido.

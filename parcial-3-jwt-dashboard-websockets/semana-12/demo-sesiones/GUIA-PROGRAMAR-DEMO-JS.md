# Guía para programar `demo.js` — Demo de sesiones

**Programación Web · Parcial 3 · semana 12 · trabajo individual**

En clase vimos la demo de sesiones y se explicó el código del servidor (`app.js`). Ahora tú vas a escribir el archivo
que falta: **`public/demo.js`**, el JavaScript de la página. Llama a la API con `fetch` y pinta los resultados.

Esta guía **no trae el código**: trae lo que la página debe hacer, las **preguntas que te tienes que responder antes de
escribir** y la forma de **comprobar** cada parte. Si puedes responder las preguntas, puedes escribir el código. Si no
puedes, regresa a la presentación, a la guía de la demo (`GUIA-DEMO-SESIONES.md`) o a la documentación de MDN
(<https://developer.mozilla.org/es/docs/Web/API/Fetch_API>).

> **Regla de oro:** no escribas una línea que no puedas explicar. Al final tu docente te puede pedir que expliques
> cualquier línea de tu `demo.js`.

---

## 0. Lo que ya tienes y lo que falta

| Archivo | ¿Existe? | Qué es |
|---|---|---|
| `app.js`, `server.js`, `config.js`, `db.js`, `modelos/` | ✅ ya está | El servidor completo. **No lo cambies** (solo `config.js` cuando una prueba lo pida) |
| `bd/demo_sesiones.sql` | ✅ ya está | La base completa: tablas `usuarios` y `sessions` |
| `public/index.html`, `public/estilos.css` | ✅ ya está | La página. **No los cambies:** tu `demo.js` se tiene que adaptar a ellos |
| `pruebas/probar.js` | ✅ ya está | 21 pruebas automáticas del servidor |
| ✏️ **`public/demo.js`** | ❌ lo creas tú | El JavaScript de la página |

```text
 navegador ──> index.html ──> demo.js ──fetch──> /api/...  ──> app.js ──> MySQL (usuarios y sessions)
                                  ▲                                │
                                  └──────── JSON + Set-Cookie ─────┘
```

**Antes de escribir nada, responde:**

1. Abre `index.html`. ¿En qué línea se carga `demo.js`? ¿Está en el `<head>` o al final del `<body>`? ¿Qué cambia eso?
2. Haz una lista de todos los `id` que tiene la página y de los botones que tienen `data-metodo` y `data-url`. Esos son
   los elementos que tu código va a usar.
3. ¿Quién guarda la cookie de sesión y quién la manda en cada petición: tu `demo.js` o el navegador?

---

## 1. Preparación

1. En la carpeta `base/`: `npm install`.
2. Copia `.env.example` como `.env` y pon **tu** contraseña de MySQL en `DB_PASSWORD`.
3. Carga la base: Workbench (*File → Open SQL Script… → `bd/demo_sesiones.sql` → rayo*) o `npm run bd`.
4. Corre `npm start` y abre `http://localhost:4600` con **F12 → Console**. La página se ve, pero **no hace nada** y la
   Console marca que no encuentra `demo.js`. Es correcto: ese es tu punto de partida. Crea el archivo vacío
   `public/demo.js` y recarga: el error desaparece.

Cada vez que cambies `demo.js` basta con recargar la página con **Ctrl+F5** (no hace falta reiniciar el servidor).
Solo reinicia (**Ctrl+C** y `npm start`) cuando cambies `config.js`.

> Mientras programas, puedes ver lo que responde cada ruta GET escribiendo la URL en otra pestaña, por ejemplo
> `http://localhost:4600/api/config`.

---

## 2. Lo que responde la API

El servidor ya está programado. Esto es lo que vas a recibir en cada `fetch`; usa **exactamente** estos nombres de
campos.

| Método y ruta | Protegida con | Cuerpo que recibe | Respuesta correcta | Respuestas de error |
|---|---|---|---|---|
| `GET /api/config` | — | — | `200` · el objeto `config` tal cual | — |
| `POST /api/visita` | — | — | `200` · `{ visitas, sesion }` | — |
| `POST /api/login` | — | `{ usuario, contrasena }` | `200` · `{ usuario: {id, usuario, nombre, rol}, sesionAntes, sesionDespues }` | `401` · `{ error }` |
| `POST /api/logout` | — | — | `200` · `{ mensaje }` y borra la cookie | — |
| `GET /api/sesion` | sesión | — | `200` · `{ usuario, sesion, expiraEnSegundos }` | `401` |
| `GET /api/perfil` | sesión | — | `200` · `{ mensaje: "Hola, <nombre>", rol, visitas }` | `401` |
| `GET /api/admin/reporte` | sesión **y** rol `admin` | — | `200` · `{ reporte }` | `401` sin sesión · `403` con otro rol |
| `GET /api/diagnostico/sesiones` | — (solo para la clase) | — | `200` · `{ almacen, sesiones: [ {sesion, esLaTuya, usuario, visitas, expira} ] }` | — |
| Cualquier otra `/api/...` | — | — | — | `404` · `{ error }` |

- El campo `sesion` (y `sesionAntes`, `sesionDespues`) **no** es el id completo: son sus **primeros 8 caracteres
  seguidos de `…`** (por ejemplo `"TUJWDXIh…"`).
- `expira` (en el diagnóstico) es una fecha en texto ISO, por ejemplo `"2026-11-11T23:16:47.313Z"`.
Reglas generales:

- Todas las respuestas son **JSON**. Los errores llevan la forma `{ "error": "texto" }`.
- El campo `sesion` (y `sesionAntes`, `sesionDespues`) **no** es el id completo: son sus **primeros 8 caracteres
  seguidos de `…`** (por ejemplo `"TUJWDXIh…"`).
- `expira` (en el diagnóstico) es una fecha en texto ISO, por ejemplo `"2026-11-11T23:16:47.313Z"`.

---

## 3. Programar `public/demo.js`

`demo.js` no conoce las cookies: el navegador las manda **solo** porque la página y la API están en el mismo servidor.
Tu trabajo es llamar a la API y pintar.

### 3.1 Lo que `index.html` espera (el contrato del frontend)

| Elemento en `index.html` | Qué debe hacer tu `demo.js` |
|---|---|
| `#estado` | Texto del estado. Clase `estado con-sesion` (verde) o `estado sin-sesion` (rojo) |
| `#cookie-js` | Lo que regresa `document.cookie`, o `(vacío)` |
| `#btn-refrescar` | Al hacer clic: volver a preguntar el estado y la tabla |
| `#form-login`, `#usuario`, `#contrasena` | Al enviar: `POST /api/login` con lo escrito. Al cambiar el usuario, poner su contraseña de ejemplo (`<usuario>12345`) |
| Botones con `data-metodo` y `data-url` | Al hacer clic: llamar a esa ruta con ese método |
| `#bitacora` (una `<ol>`) | Agregar **arriba** cada respuesta: código + método + URL + JSON |
| `#donde` | Dónde se guardan las sesiones (MySQL o memoria), según `almacen` del diagnóstico |
| `#tabla-sesiones` (`<tbody>`) | Una fila por sesión: Sesión (con *(la tuya)*), Usuario, Visitas, Vence (hora local). Si no hay: una fila *(sin sesiones)* |
| `#btn-sesiones` | Al hacer clic: actualizar solo la tabla |
| `#config` | El JSON de `GET /api/config`, con sangría |

Clases de `estilos.css` que ya existen y puedes usar: en la bitácora, `codigo ok` (2xx), `codigo e401`, `codigo e403`
y `codigo error` (otros); en la tabla, la clase `tuya` en la fila de tu sesión.

### 3.2 Etapas

**Etapa 1 — Una función para llamar a la API.** Recibe método, URL y (opcional) un cuerpo; regresa
`{ status, datos }`.

- ¿Qué encabezado necesita el servidor para que `express.json()` lea el cuerpo? ¿Lo mandas siempre o solo cuando hay
  cuerpo?
- `fetch` **no** lanza error con un 401 o 403. ¿Dónde está el código entonces?
- ¿Qué pasa si la respuesta no es JSON (por ejemplo, un error raro)? Haz que en ese caso `datos` sea `null` en lugar de
  tronar.
- ¿Por qué aquí **no** hace falta `credentials: 'include'`? ¿En qué caso sí haría falta? (Piensa en el proyecto con Next.js
  en otro puerto.)

**Comprueba:** en la **Console** escribe `await llamar('GET', '/api/perfil')` (o como hayas llamado a tu función). Debe regresar `{status: 401, datos: {error: …}}` sin error en rojo.

**Etapa 2 — La bitácora.** Una función que reciba método, URL, código y datos, y agregue un `<li>` **al principio** de
`#bitacora` con el código coloreado y el JSON en un `<pre>`.

- ¿Qué método de los elementos inserta un hijo al principio?
- El JSON que viene del servidor puede contener texto escrito por alguien (un nombre, por ejemplo). ¿Lo metes con
  `innerHTML` o con `textContent`? ¿Qué ataque vimos que se aprovecha de `innerHTML` y qué podría robar si la cookie
  no fuera `httpOnly`?
- ¿Cómo eliges la clase de color según el código?

**Comprueba:** pulsa **POST /api/visita** dos veces (después de la etapa 5 los botones ya funcionan; mientras, llama a tu función desde la Console). Aparecen dos `<li>` con el código en verde y el más nuevo **arriba**.

**Etapa 3 — El estado.** Pregunta `GET /api/sesion`. Con 200, muestra nombre, rol, sesión corta y segundos para vencer
en `#estado` (clase verde); con otro código, *"Sin sesión (el servidor responde 401)"* (clase roja). Después escribe
`document.cookie` en `#cookie-js`.

- ¿Por qué con `httpOnly: true` `#cookie-js` sale vacío aunque **sí** estés logueado?

**Comprueba:** sin sesión, el estado sale en rojo. Inicia sesión (por ahora desde la Console con `POST /api/login`), recarga y el estado sale en verde con *"vence en … s"*.

**Etapa 4 — La tabla del servidor.** Pregunta `GET /api/diagnostico/sesiones`, escribe en `#donde` dónde se guardan y
reconstruye `#tabla-sesiones`.

- ¿Cómo vacías el `<tbody>` antes de volver a llenarlo? Si no lo vacías, ¿qué pasa al pulsar dos veces?
- `expira` viene como texto de fecha ISO. ¿Cómo lo conviertes a una hora local legible?
- Otra vez: ¿celdas con `textContent` o con `innerHTML`?

**Comprueba:** la tarjeta **4** muestra *"En MySQL, tabla sessions…"* y tu sesión marcada *(la tuya)*. Pulsa **Actualizar tabla** varias veces: las filas no se duplican.

**Etapa 5 — Los eventos.**

- Formulario: ¿qué tienes que llamar en el evento `submit` para que la página **no** se recargue?
- Botones: en lugar de escribir un `addEventListener` por botón, selecciona **todos** los que tengan `data-url` y
  recórrelos. ¿Cómo lees `data-metodo` y `data-url` desde JavaScript? (Busca `dataset`.)
- Después de **cada** acción (login, botón), anota en la bitácora y refresca estado y tabla. ¿Te conviene una función
  `refrescarTodo` que haga las dos cosas?
- Cambio de usuario en el `<select>`: ¿qué evento usas?

**Comprueba:** el formulario entra sin recargar la página; cada botón deja su línea en la bitácora; al cambiar a *admin* la contraseña cambia sola a `admin12345`.

**Etapa 6 — Al cargar la página.** Pide `GET /api/config` y muéstralo en `#config`; luego refresca todo.

- ¿Por qué no hace falta esperar a `DOMContentLoaded`? (Mira **dónde** está la etiqueta `<script>` en `index.html`.)

**Comprueba `demo.js` completo:** recarga con **Ctrl+F5**, abre F12 → **Console**: no debe haber errores en rojo. Haz las
pruebas P-01 a P-15 desde la página.

---

## 4. Correr el sistema

1. MySQL encendido y base cargada (sección 1, Preparación).
2. `npm start` en `base/`. Debe decir:

   ```text
   Demo de sesiones en http://localhost:4600
   Usuarios en MySQL: 3 (ana / ana12345 · luis / luis12345 · admin / admin12345)
   Las sesiones se guardan en: MySQL (tabla sessions)
   ```

3. Abre `http://localhost:4600` en **Chrome** y abre **F12** (pestañas **Network** y **Application → Cookies**).
4. En Workbench deja lista la consulta `SELECT * FROM demo_sesiones.sessions;`.
5. Para las pruebas automáticas: **Ctrl+C** no es necesario; en **otra** terminal, `npm run probar` (usa su propia base,
   `demo_sesiones_pruebas`, y no toca tus datos).

---

## 5. Pruebas y evidencias

Haz cada prueba **desde la página** (con F12) y, si tienes Postman, **también desde Postman**. Para cada una se indica:

- **Qué metes en la API:** método, URL, encabezados y cuerpo (en Postman: *Body → raw → JSON*).
- **Qué debe obtenerse:** el código y la respuesta. Los ids de sesión (`TUJWDXIh…`) y las fechas **serán distintos**
  en tu equipo; lo que importa es la forma y si cambian o no.
- **Evidencia:** la captura que entregas. Guárdala con el nombre `P-XX.png` en una carpeta `evidencias/`.

> **Postman y las cookies:** Postman guarda la cookie `connect.sid` sola (como un navegador), por dominio. La ves en el
> botón **Cookies** debajo de *Send*. Para simular **otro** navegador (atacante), borra la cookie desde ese botón o
> agrega a mano el encabezado `Cookie: connect.sid=<valor>`.

Antes de empezar: **POST /api/logout** y verifica que la tabla `sessions` esté vacía (o anota cuántas filas tiene).

### P-01 · La API arranca y lee la configuración

| | |
|---|---|
| **Qué metes en la API** | `GET http://localhost:4600/api/config` — sin cuerpo |
| **Qué debe obtenerse** | `200` · `{"almacen":"mysql","maxAgeMs":600000,"rolling":false,"httpOnly":true,"sameSite":"lax","regenerarAlEntrar":true}` |
| **Evidencia** | Terminal con los 3 mensajes de `npm start` + la página con la tarjeta **5 · Configuración actual** |

### P-02 · Sin sesión no hay acceso (401) y no se crea cookie

| | |
|---|---|
| **Qué metes en la API** | `GET /api/perfil` — sin cookie (ventana recién abierta, después de logout) |
| **Qué debe obtenerse** | `401` · `{"error":"401 · No has iniciado sesión (o tu sesión ya venció)"}`. En la respuesta **no** hay `Set-Cookie`, y en **Application → Cookies** no aparece `connect.sid` |
| **Evidencia** | Network → la petición `perfil` → *Headers* (sin `Set-Cookie`) + Application → Cookies vacío |

### P-03 · Credenciales incorrectas (usuario existe y usuario que no existe)

| | |
|---|---|
| **Qué metes en la API** | `POST /api/login` · `Content-Type: application/json` · cuerpo `{"usuario":"ana","contrasena":"mala"}` y después `{"usuario":"pepe","contrasena":"pepe12345"}` |
| **Qué debe obtenerse** | Las **dos**: `401` · `{"error":"Usuario o contraseña incorrectos"}` (el mismo mensaje), sin `Set-Cookie`. La tabla `sessions` no cambia |
| **Evidencia** | Bitácora de la página (o Postman) con las dos respuestas 401 |
| **Responde** | ¿Por qué es mejor que los dos casos digan exactamente lo mismo? |

### P-04 · Login correcto: el `Set-Cookie` y la fila en MySQL

| | |
|---|---|
| **Qué metes en la API** | `POST /api/login` · `Content-Type: application/json` · `{"usuario":"ana","contrasena":"ana12345"}` |
| **Qué debe obtenerse** | `200` · `{"usuario":{"id":1,"usuario":"ana","nombre":"Ana López","rol":"alumno"},"sesionAntes":null,"sesionDespues":"TUJWDXIh…"}` (sin `contrasena_hash`). Encabezado: `Set-Cookie: connect.sid=s%3A…; Path=/; Expires=…; HttpOnly; SameSite=Lax`. En Workbench, **una fila** nueva; `session_id` coincide con lo que va entre `s%3A` y el punto de la cookie, y `data` trae el usuario y el rol |
| **Evidencia** | 1) Network → `login` → *Response Headers* con `Set-Cookie`. 2) Workbench con la fila. Marca en las dos capturas el mismo id |
| **Responde** | ¿La cookie dice "ana" o "alumno"? ¿Dónde están entonces esos datos? |

### P-05 · El navegador regresa la cookie solo y el servidor recuerda

| | |
|---|---|
| **Qué metes en la API** | Con la sesión de P-04: `GET /api/perfil` dos veces (sin agregar nada: la cookie la manda el navegador/Postman) |
| **Qué debe obtenerse** | `200` · `{"mensaje":"Hola, Ana López","rol":"alumno","visitas":1}` y luego `"visitas":2`. En *Request Headers*: `Cookie: connect.sid=s%3A…`. En Workbench, `data` tiene el nuevo número de visitas |
| **Evidencia** | Network → `perfil` → *Request Headers* con `Cookie` + la respuesta con `visitas` |

### P-06 · El estado y la tabla del servidor

| | |
|---|---|
| **Qué metes en la API** | `GET /api/sesion` y `GET /api/diagnostico/sesiones` (los hace tu `demo.js` al pulsar **Volver a preguntar**) |
| **Qué debe obtenerse** | `/api/sesion` → `200` · `{"usuario":{…},"sesion":"TUJWDXIh…","expiraEnSegundos":600}` (o un poco menos). `/api/diagnostico/sesiones` → `200` · `{"almacen":"mysql","sesiones":[{"sesion":"TUJWDXIh…","esLaTuya":true,"usuario":"ana","visitas":2,"expira":"…"}]}`. En la página: estado en verde y la fila marcada *(la tuya)* |
| **Evidencia** | Captura de la página completa (tarjetas 1 y 4) |

### P-07 · 403: sé quién eres pero no puedes

| | |
|---|---|
| **Qué metes en la API** | Con sesión de **ana**: `GET /api/admin/reporte` |
| **Qué debe obtenerse** | `403` · `{"error":"403 · Eres ana, pero esta ruta es solo para admin"}` |
| **Evidencia** | Bitácora con el 403 |

### P-08 · 401 contra 200 en la ruta de admin

| | |
|---|---|
| **Qué metes en la API** | 1) `POST /api/logout` y `GET /api/admin/reporte`. 2) `POST /api/login` con `{"usuario":"admin","contrasena":"admin12345"}` y `GET /api/admin/reporte` |
| **Qué debe obtenerse** | 1) `401`. 2) `200` · `{"reporte":"Talleres: 3 · Inscritos: 57 · Cupo libre: 18"}` |
| **Evidencia** | Bitácora con los tres códigos (403 de P-07, 401 y 200) + la tabla llena: |

| Situación | Código | ¿Qué significa? |
|---|---|---|
| Sin sesión | | |
| Con sesión de ana | | |
| Con sesión de admin | | |

### P-09 · `httpOnly`: ¿la ve JavaScript?

| | |
|---|---|
| **Qué metes en la API** | Con sesión iniciada: escribe `document.cookie` en la **Console**. Luego en `config.js` pon `httpOnly: false`, reinicia, recarga, inicia sesión y repite. Regresa a `true` |
| **Qué debe obtenerse** | Con `true`: `''` (vacío) y `Set-Cookie` **con** `HttpOnly`. Con `false`: `'connect.sid=s%3A…'` y `Set-Cookie` **sin** `HttpOnly` |
| **Evidencia** | Dos capturas del recuadro **document.cookie** (o la Console), una por valor |

### P-10 · Logout destruye la sesión en el servidor

| | |
|---|---|
| **Qué metes en la API** | `POST /api/logout` — sin cuerpo |
| **Qué debe obtenerse** | `200` · `{"mensaje":"Sesión cerrada: el servidor la borró"}` · `Set-Cookie: connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`. La cookie desaparece de Application y la fila desaparece de Workbench |
| **Evidencia** | *Response Headers* del logout + Workbench sin la fila |

### P-11 · Secuestro de sesión (y cómo lo corta el logout)

| | |
|---|---|
| **Qué metes en la API** | **Víctima** (ventana normal): login de ana y copia el *Value* de `connect.sid`. **Atacante** (incógnito, o Postman sin cookies): `GET /api/perfil` con el encabezado `Cookie: connect.sid=<valor copiado>` (en el navegador: `document.cookie = 'connect.sid=<valor>; path=/'` en la Console). Después la **víctima** hace `POST /api/logout` y el atacante repite `GET /api/perfil` |
| **Qué debe obtenerse** | Antes del logout: el atacante recibe `200` · `"Hola, Ana López"` **sin contraseña**, y en la tabla del servidor los dos usan **la misma** sesión. Después del logout: el atacante recibe `401` |
| **Evidencia** | Captura del atacante con 200, captura del atacante con 401 |
| **Responde** | ¿Qué tres controles limitan el daño de una cookie robada? |

### P-12 · Expiración y `rolling`

| | |
|---|---|
| **Qué metes en la API** | En `config.js`: `maxAgeMs: 20 * 1000` y `rolling: false`. Reinicia, recarga, login de ana y pulsa `GET /api/perfil` **cada 5 s** (no dejes de usarla) mirando el estado *"vence en N s"*. Luego `rolling: true`, reinicia, login y `GET /api/perfil` cada 5 s durante 40 s; después **deja de tocarla** 25 s y pulsa otra vez. Al final regresa `10 * 60 * 1000` y `rolling: false` |
| **Qué debe obtenerse** | Con `rolling: false`: el contador **baja** aunque la uses, y a los ~20 s responde `401` · `{"error":"401 · Tu sesión venció: vuelve a iniciar sesión"}` (lo decidió el **servidor**, con su función `vencida`) y la cookie se borra. Con `rolling: true`: mientras la usas, siempre `200` y el contador **vuelve a 20** en cada petición; tras 25 s sin usarla, `401` (con el mensaje *"No has iniciado sesión (o tu sesión ya venció)"*, porque el navegador ya ni siquiera mandó la cookie vencida) |
| **Evidencia** | 1) Bitácora con el 401 *"Tu sesión venció"* (rolling false). 2) Dos capturas del estado con `rolling: true` mostrando que el contador se reinicia. 3) El 401 por inactividad |
| **Responde** | En las dos configuraciones el `Expires` del `Set-Cookie` cambia en cada respuesta (revísalo en Network). Entonces, ¿quién decide realmente que la sesión venció con `rolling: false`: el navegador o tu servidor? |

### P-13 · Fijación de sesión **sin** protección

| | |
|---|---|
| **Qué metes en la API** | `regenerarAlEntrar: false`, reinicia. **Atacante** (incógnito): `POST /api/visita` y copia su `connect.sid`. **Víctima**: la planta con `document.cookie = 'connect.sid=<valor del atacante>; path=/'` y hace login de ana. **Atacante**: `GET /api/sesion` |
| **Qué debe obtenerse** | En el login de la víctima, `sesionAntes` **igual** a `sesionDespues` (el id no cambió). El atacante recibe `200` y es **Ana López** |
| **Evidencia** | Respuesta del login con los dos ids iguales + estado del atacante como Ana |

### P-14 · Fijación de sesión **con** protección (`regenerate`)

| | |
|---|---|
| **Qué metes en la API** | `regenerarAlEntrar: true`, reinicia y repite P-13 |
| **Qué debe obtenerse** | `sesionAntes` **distinto** de `sesionDespues`. El atacante recibe `401` |
| **Evidencia** | Respuesta del login con los dos ids distintos + el 401 del atacante |

### P-15 · ¿Dónde vive la sesión? MySQL contra memoria

| | |
|---|---|
| **Qué metes en la API** | Con `almacen: 'mysql'`: login de ana, **Ctrl+C**, `npm start` y (sin recargar) **Volver a preguntar**. Luego `almacen: 'memoria'`, reinicia, recarga, login, **Ctrl+C**, `npm start` y **Volver a preguntar**. Regresa a `'mysql'` |
| **Qué debe obtenerse** | MySQL: sigues con sesión (`200`). Memoria: la cookie sigue en Application pero el servidor responde `401`, y la tabla `sessions` de Workbench no se usó |
| **Evidencia** | Estado tras reiniciar en cada caso |

### P-16 · Pruebas automáticas

| | |
|---|---|
| **Qué metes** | En la carpeta `base/`: `npm run probar` |
| **Qué debe obtenerse** | 21 líneas con ✔ y al final `21 de 21 pruebas pasaron.` |
| **Evidencia** | Captura de la terminal completa. Estas pruebas revisan el servidor, no tu `demo.js`: si alguna sale con ✘, avisa a tu docente (puede ser tu MySQL o tu `.env`) |

---

## 6. Entrega

1. `public/demo.js` **comentado con tus palabras** (un comentario por función que explique *por qué*, no
   *qué*).
2. Carpeta `evidencias/` con `P-01.png` … `P-16.png`.
3. Un documento corto con:
   - Las respuestas de los recuadros **Responde** y la tabla de P-08.
   - Tres preguntas de cierre:
     1. ¿Qué guarda el navegador y qué guarda el servidor en una sesión? Usa tu evidencia de P-04.
     2. Elige **una** opción (`httpOnly`, `maxAge`/`rolling`, `regenerate`, logout con `destroy`) y explica qué ataque
        evita, con tu evidencia.
     3. Si el servidor se reinicia o hay dos servidores, ¿por qué conviene guardar las sesiones en MySQL?

### Lista de cotejo

| Criterio | Sí / No |
|---|---|
| `demo.js` está escrito por el alumno y usa los `id` de `index.html` sin cambiar el HTML | |
| `npm run probar` da 21 de 21 | |
| La página funciona sin errores en la Console (estado, bitácora, tabla, configuración) | |
| `demo.js` usa `textContent` para los datos que vienen del servidor | |
| Evidencias P-01 a P-16 completas y con nombre | |
| Explica con sus palabras 401 contra 403 | |
| Explica secuestro y fijación y qué control evita cada uno | |
| Puede explicar cualquier línea de su código cuando se le pregunta | |
